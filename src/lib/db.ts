import type { Tool, ToolExample } from '@/lib/types';

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const getToolsForUrl = async (url: string): Promise<{ tools: Tool[], examples: ToolExample[] }> => {
    const toolEntry = await prisma.toolEntry.findFirst({
        where: {
            reference: url
        },
        include: {
            examples: true
        }
    });

    if (!toolEntry) {
        return { tools: [], examples: [] };
    }

    return {
        tools: toolEntry.content as Tool[],
        examples: toolEntry.examples.map((example) => ({
            name: example.name,
            url: example.url,
            content: example.content as string || '' // Ensure content is always a string
        }))
    };
}

export const getSystemTool = async (name: string): Promise<{ tools: Tool[], examples: ToolExample[] }> => {
    const toolEntry = await prisma.toolEntry.findFirst({
        where: {
            reference: name,
            systemTool: true
        },
        include: {
            examples: true
        }
    });

    if (!toolEntry) {
        return { tools: [], examples: [] };
    }

    return {
        tools: toolEntry.content as Tool[],
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
            reference: url
        },
        update: {
            content: tools as Prisma.JsonArray,
            examples: {
                deleteMany: {},
                create: examples
            }
        },
        create: {
            reference: url,
            content: tools as Prisma.JsonArray,
            examples: {
                create: examples
            }
        },
        include: {
            examples: true
        }
    });
    
    return {
        tools: toolEntry.content as Tool[],
        examples: toolEntry.examples.map((example) => ({
            name: example.name,
            url: example.url,
            content: example.content as string || '' // Ensure content is always a string
        }))
    };
}

export const removeToolForUrlIfExists = async (url: string): Promise<Tool[]> => {
    const toolEntry = await prisma.toolEntry.findFirst({
        where: {
            reference: url
        }
    });
    if (!toolEntry) {
        return [];
    }
    await prisma.toolEntry.delete({
        where: {
            reference: url
        }
    });
    return toolEntry.content as Tool[];
}

export const getToolsForQuery = async (query: string): Promise<Record<string, Tool[]>> => {
    const toolEntries = await prisma.toolEntry.findMany({
        where: {
            reference: {
                contains: query
            }
        }
    });

    const tools: Record<string, Tool[]> = {};
    for (const entry of toolEntries) {
        const parsedTool = entry.content as Tool[];
        for (const tool of parsedTool) {
            if (tools[entry.reference]) {
                tools[entry.reference].push(tool);
            } else {
                tools[entry.reference] = [tool];
            }
        }
    }
    return tools;
}