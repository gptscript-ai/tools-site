import type { Tool } from '@/lib/types';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getToolsForUrl = async (url: string): Promise<Tool[]> => {
    const toolEntry = await prisma.toolEntry.findFirst({
        where: {
        url: url
        }
    });

    if (!toolEntry) {
        return [];
    }

    return toolEntry?.content as Tool[];;
}

export const upsertToolForUrl = async (url: string, tools: Tool[]): Promise<Tool[]> => {
    const toolEntry = await prisma.toolEntry.upsert({
        where: {
        url: url
        },
        update: {
        content: JSON.stringify(tools)
        },
        create: {
        url: url,
        content: JSON.stringify(tools)
        }
    });
    return toolEntry.content as Tool[];
}

export const removeToolForUrl = async (url: string): Promise<Tool[]> => {
    const toolEntry = await prisma.toolEntry.delete({
        where: {
        url: url
        }
    });
    return toolEntry.content as Tool[];
}
