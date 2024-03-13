import type { Tool, ToolExample } from '@/lib/types';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getToolsForUrl = async (url: string): Promise<{ tools: Tool[], examples: ToolExample[] }> => {
    const toolEntry = await prisma.toolEntry.findFirst({
        where: {
            url: url
        },
        include: {
            examples: true
        }
    });

    if (!toolEntry) {
        return { tools: [], examples: [] };
    }

    return {
        tools: JSON.parse(toolEntry.content as string) as Tool[],
        examples: toolEntry.examples.map((example) => ({
            name: example.name,
            url: example.url,
            content: example.content as string || '' // Ensure content is always a string
        }))
    };
}

export const upsertToolForUrl = async (url: string, tools: Tool[], examples: ToolExample[]): Promise<{ tools: Tool[], examples: ToolExample[] }> => {
    const toolEntry = await prisma.toolEntry.upsert({
        where: {
            url: url
        },
        update: {
            content: JSON.stringify(tools),
            examples: {
                deleteMany: {},
                create: examples
            }
        },
        create: {
            url: url,
            content: JSON.stringify(tools),
            examples: {
                create: examples
            }
        },
        include: {
            examples: true
        }
    });
    
    return {
        tools: JSON.parse(toolEntry.content as string) as Tool[],
        examples: toolEntry.examples.map((example) => ({
            name: example.name,
            url: example.url,
            content: example.content as string || '' // Ensure content is always a string
        }))
    };
}

export const removeToolForUrl = async (url: string): Promise<Tool[]> => {
    const toolEntry = await prisma.toolEntry.delete({
        where: {
            url: url
        }
    });
    return toolEntry.content as Tool[];
}

export const getToolsForQuery = async (query: string): Promise<Record<string, Tool[]>> => {
    const toolEntries = await prisma.toolEntry.findMany({
        where: {
            url: {
                contains: query
            }
        }
    });

    const tools: Record<string, Tool[]> = {};
    for (const entry of toolEntries) {
        const parsedTool = JSON.parse(entry.content as string) as Tool[];
        for (const tool of parsedTool) {
            if (tools[entry.url]) {
                tools[entry.url].push(tool);
            } else {
                tools[entry.url] = [tool];
            }
        }
    }
    return tools;
}