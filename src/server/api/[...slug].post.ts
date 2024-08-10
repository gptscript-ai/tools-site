import { Octokit } from '@octokit/core'
import * as db from '@/lib/db'
import type { ParserResponse, Tool, ToolExample } from '@/lib/types'

export default defineEventHandler(async (event) => {
  const octokit = new Octokit({ auth: useRuntimeConfig().githubToken })

  // grab the github URL from the path and check that it is valid
  const url = event.path.replace(/^\/api\//, '').split('?')[0]

  // if the url starts with sys. then it is a system tool and we should return the system tool. system tools
  // are not fetched from github and are instead loaded directly into the database through the indexing
  // cronjob defined in render.
  if (url.startsWith('sys.')) {
    const tool = await db.getSystemTool(url)

    if (!tool.tools.length) {
      throw createError({
        statusCode:    404,
        statusMessage: 'Tool not found',
      })
    }
    setResponseHeader(event, 'Content-Type', 'application/json')
    return tool
  }

  if (!/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+(\/[\w-]+)*$/.test(url)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid URL"
    });
  }

  // if the tool is already indexed and force is not true, return the tool
  const entry = await db.getToolsForUrl(url)

  // if the tool is already indexed or if force is not set and the last index time is less than 1 hour ago, return the tool
  const forceSetAndReady = getQuery(event).force && entry.lastIndexedAt && (Date.now() - Number(entry.lastIndexedAt)) > 3600000
  if (entry.tools.length > 0 && !forceSetAndReady) {
    // add headers to communicate that the response is cached and when it was last indexed
    setResponseHeader(event, 'Content-Type', 'application/json')
    setResponseHeader(event, 'Cached-Response', 'true')
    setResponseHeader(event, 'Last-Indexed-At', entry.lastIndexedAt.toISOString())
    setResponseStatus(event, 200)

    return entry
  }
  setResponseHeader(event, 'Cached-Response', 'false')

  // grab the owner, repo and subdirs from the URL if they exist
  const [owner, repo, ...subdirs] = url.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').split('/')

  // find the default branch name
  const branchResponse = await octokit.request(`GET https://api.github.com/repos/${ owner }/${ repo }`)
  const branch = branchResponse.data.default_branch

  // construct the path to the tool.gpt file
  const path = subdirs.length > 0 ? `${ subdirs.join('/') }` : ''

  // fetch the tool.gpt file from github
  const toolResponse = await fetch(`https://raw.githubusercontent.com/${ owner }/${ repo }/${ branch }/${ path }/tool.gpt`)

  if (!toolResponse.ok) {
    // clean-up any existing tools if the tool.gpt file is no longer found or is private
    if (toolResponse.status === 404 || toolResponse.status === 403) {
      await db.removeToolForUrlIfExists(url)
    }
    throw createError({
      statusCode:    toolResponse.status,
      statusMessage: await toolResponse.text(),
    })
  }

  // parse the tool.gpt file into a JSON object
  const parserResponse = await fetch(useRuntimeConfig().parserUrl, {
    method:  'POST',
    body:    await toolResponse.text(),
    headers: { 'Content-Type': 'text/plain' },
  })

  // if the parser fails, return the error
  if (!parserResponse.ok) {
    throw createError({
      statusCode:    parserResponse.status,
      statusMessage: await parserResponse.text(),
    })
  }

  // if the parser returns no tools, return an error
  const parserNodes = JSON.parse(await parserResponse.text()) as ParserResponse

  if (parserNodes.nodes.length === 0) {
    throw createError({
      statusCode:    400,
      statusMessage: 'No tools found in file',
    })
  }

  const tools = parserNodes.nodes.map(node => {
    if (node.toolNode) {
      return node.toolNode.tool
    }
    return {
      instructions: node.textNode!.text
    }
  })

  // upsert the tool into the database and return the tool
  setResponseHeader(event, 'Content-Type', 'application/json')
  setResponseStatus(event, 201)

  return await db.upsertToolForUrl(url, tools, await getExamples(owner, repo, path, octokit),
  )
})

// getExamples fetches the examples from the repo located at github.com/owner/repo and returns them as an array of ToolExample objects
async function getExamples(owner: string, repo: string, path: string, octokit: Octokit): Promise<ToolExample[]> {
  let gptFiles: ToolExample[] = []
  try {
    // Get the contents of the examples directory
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path: path+'/examples',
      ref:  'main',
    })

    // Filter the response to include only .gpt files
    const gptExamples = (response.data as any[]).filter((file: any) => file.type === 'file' && file.name.endsWith('.gpt'))

    gptFiles = await Promise.all(gptExamples.map(async (example: any) => {
      const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path: example.path,
        ref:  'main',
      })

      const content = Buffer.from((response.data as any).content, 'base64').toString()
      const githubLink = `https://github.com/${ owner }/${ repo }/blob/main/${ example.path }`

      return { name: example.name, url: githubLink, content }
    }))
  } catch (e) {
    // if the error is not a 404, throw it
    if ((e as any).status !== 404) { throw e }
  }

  // Fetch the example.gpt file if it exists
  const exampleDotGPT = await fetch(`https://raw.githubusercontent.com/${ owner }/${ repo }/main/${path}/example.gpt`)
  if (exampleDotGPT.ok) {
    const content = await exampleDotGPT.text()
    gptFiles.push({ name: 'example.gpt', url: `https://github.com/${ owner }/${ repo }/blob/main/${path}/example.gpt`, content }) 
  }

  return gptFiles
}
