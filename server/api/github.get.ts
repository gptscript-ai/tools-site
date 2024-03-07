import { Octokit } from '@octokit/core';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const { owner, repo, path } = query;
    const octokit = new Octokit({
        auth: useRuntimeConfig().githubToken,
    });

    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: owner?.toString() ?? '',
            repo: repo?.toString() ?? '',
            path: path?.toString() ?? '',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (!response.data.content) {
            throw createError({
                statusCode: 404,
                statusMessage: `file not found`,
            });
        }

        return response.data.content;
    } catch (error) {
        throw error;
    }
});
