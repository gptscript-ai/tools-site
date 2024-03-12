import * as db from '@/lib/db';
import type { Tool } from '@/lib/types';

export default defineEventHandler(async (event) => {
  // NOTE: this path may be incorrect
  const url = event.path.replace(/^\/api\//, "");

  // should update this to account for subpaths
  if (!/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/.test(url)) {
    return {
      status: 404,
      body: "path not found"
    };
  }

  const query = getQuery(event)
  const tools = await getOrIndexRepo(url, query.force === "true");

  if (tools.length === 0) {
    return {
      status: 404,
      body: "no tools found"
    };
  }

  return {
    status: 200,
    body: tools
  };
})

const getOrIndexRepo = async (url: string, force: boolean): Promise<Tool[]> => {
  // todo: 
  // - look for a tool.gpt if it exists and if it doesn't look if the file specified is a tool file
  const tools = await db.getToolsForUrl(url);

  if (tools.length > 0 && !force) {
    return tools;
  }

  const [owner, repo] = url.split("/").slice(-2);

  // Tool file wasn't found in the db or force is true so we need to try and index the URL
  try {
    const toolResponse = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/tool.gpt`);
    const parserResponse = await fetch(useRuntimeConfig().parserUrl as string, {
      method: 'POST',
      body: await toolResponse.text(),
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    const parserResponseBody = await parserResponse.text();
    const insertedTools = await db.upsertToolForUrl(url, JSON.parse(parserResponseBody) as Tool[]);
    return insertedTools;
  } catch (error) {
    console.error(error);
  }
  return [];
}