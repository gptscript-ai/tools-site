import { Octokit } from '@octokit/core';

export const fetchGithubFile = (owner: string, repo: string, path: string): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        try {
            const octokit = new Octokit({
                auth:  useRuntimeConfig().githubToken,
            });

            const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: owner,
                repo: repo,
                path: path,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });

            const content = response.data.content;
            const decodedContent = base64Decode(content);
            resolve(decodedContent);
        } catch (error) {
            reject(error);
        }
    });
};

function base64Decode(base64: string): string {
    const text = atob(base64);
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
        bytes[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
}