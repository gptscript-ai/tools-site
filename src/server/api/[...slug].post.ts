import * as db from '@/lib/db';
import type { Tool, ToolExample } from '@/lib/types';
import { Octokit } from '@octokit/core';

export default defineEventHandler(async (event) => {
    // grab the github URL from the path and check that it is valid
    const url = event.path.replace(/^\/api\//, "").split("?")[0];

    // if the url starts with sys. then it is a system tool and we should return the system tool. system tools
    // are not fetched from github and are instead loaded directly into the database through the indexing
    // cronjob defined in render.
    if (url.startsWith("sys.")) {
        const tool = await db.getSystemTool(url);
        if (!tool.tools.length) {
            throw createError({
                statusCode: 404,
                statusMessage: "Tool not found"
            });
        }
        setResponseHeader(event, "Content-Type", "application/json");
        return tool;
    }

    if (!/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+(\/[\w-]+)*$/.test(url)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid URL"
        });
    }
    
    // if the tool is already indexed and force is not true, return the tool
    let entry = await db.getToolsForUrl(url);
    if (entry.tools.length > 0 && !getQuery(event).force) {
        setResponseHeader(event, "Content-Type", "application/json");
        return entry;
    }

    // grab the owner, repo and subdirs from the URL if they exist
    const [owner, repo, ...subdirs] = url.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "").split("/");
    
    // construct the path to the tool.gpt file
    const toolPath = subdirs.length > 0 ? `${subdirs.join("/")}/tool.gpt` : "tool.gpt";
    console.log(`https://raw.githubusercontent.com/${owner}/${repo}/main/${toolPath}`)

    // fetch the tool.gpt file from github
    const toolResponse = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${toolPath}`);
    if (!toolResponse.ok) {
        // clean-up any existing tools if the tool.gpt file is no longer found or is private
        if (toolResponse.status === 404 || toolResponse.status === 403) {
            await db.removeToolForUrlIfExists(url);
        }
        throw createError({
            statusCode: toolResponse.status,
            statusMessage: await toolResponse.text()
        });
    }

    // parse the tool.gpt file into a JSON object
    const parserResponse = await fetch(useRuntimeConfig().parserUrl, {
        method: 'POST',
        body: await toolResponse.text(),
        headers: { 'Content-Type': 'text/plain' }
    });

    // if the parser fails, return the error
    if (!parserResponse.ok) {
        throw createError({
            statusCode: parserResponse.status,
            statusMessage: await parserResponse.text()
        });
    }

    // if the parser returns no tools, return an error
    const parsedTools = JSON.parse(await parserResponse.text()) as Tool[];
    if (parsedTools.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "No tools found in file"
        });
    }

    // upsert the tool into the database and return the tool
    setResponseHeader(event, "Content-Type", "application/json");
    return await db.upsertToolForUrl(url, 
        parsedTools, 
        await getExamples(owner, repo)
    );
})

// getExamples fetches the examples from the repo located at github.com/owner/repo and returns them as an array of ToolExample objects
const getExamples = async (owner: string, repo: string): Promise<ToolExample[]> => {
    const octokit = new Octokit({ auth: useRuntimeConfig().githubToken});

    try {
        // Get the contents of the examples directory
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path: 'examples',
            ref: 'main' // Replace 'main' with the desired branch name
        });

        // Filter the response to include only .gpt files
        const gptExamples = (response.data as any[]).filter((file: any) => file.type === 'file' && file.name.endsWith('.gpt'));

        const gptFiles: ToolExample[] = await Promise.all(gptExamples.map(async (example: any) => {
            const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner,
                repo,
                path: example.path,
                ref: 'main' // Replace 'main' with the desired branch name
            });

            const content = Buffer.from((response.data as any).content, 'base64').toString();
            const githubLink = `https://github.com/${owner}/${repo}/blob/main/${example.path}`; 

            return { name: example.name, url: githubLink, content };
        }));

        return gptFiles;
    } catch (e) {
        return [];
    }
};