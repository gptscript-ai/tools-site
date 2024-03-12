import * as db from '@/lib/db';
import type { Tool } from '@/lib/types';

export default defineEventHandler(async (event) => {
  // grab the github URL from the path and check that it is valid
  const url = event.path.replace(/^\/api\//, "");
  if (!/^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+$/.test(url)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid URL"
    });
  }

  let tools = await db.getToolsForUrl(url);

  // if the tool is already indexed and force is not true, return the tool
  if (tools.length > 0 && !getQuery(event).force) {
    setResponseHeader(event, "Content-Type", "application/json");
    return tools;
  }

  const [owner, repo] = url.split("/").slice(-2);

  // fetch the tool.gpt file from github
  const toolResponse = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/tool.gpt`);
  if (!toolResponse.ok) {
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

  // upsert the tool into the database and return the tool
  const parserResponseBody = await parserResponse.text();
  setResponseHeader(event, "Content-Type", "application/json");
  return await db.upsertToolForUrl(url, JSON.parse(parserResponseBody) as Tool[]);
})
