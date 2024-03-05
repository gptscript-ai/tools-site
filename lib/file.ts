export const fetchGithubFile = async (path: string): Promise<string> => {
    // const token = process.env.GITHUB_TOKEN;
    // const response = await fetch(`https://raw.githubusercontent.com/${path}/main/tool.gpt`, {
    //     headers: {
    //         Authorization: `Bearer ${token}`
    //     }
    // });
    // return await response.text();

    // Return a dummy promise for now
    return new Promise<string>((resolve) => {
        resolve("tbd data");
    });
};
