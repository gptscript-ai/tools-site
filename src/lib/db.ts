import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import type { Tool, ToolExample } from '@/lib/types'

const prisma = new PrismaClient()

export async function getToolsForUrl(url: string): Promise<{ tools: Tool[], examples: ToolExample[], lastIndexedAt: Date }> {
  const toolEntry = await prisma.toolEntry.findFirst({
    where:   { reference: url },
    include: { examples: true },
  })

  if (!toolEntry) {
    return { tools: [], examples: [], lastIndexedAt: new Date() }
  }

  return {
    tools:         toolEntry.content as Tool[],
    lastIndexedAt: toolEntry.lastIndexedAt,
    examples:      toolEntry.examples.map((example) => ({
      name:    example.name,
      url:     example.url,
      content: example.content as string || '', // Ensure content is always a string
    })),
  }
}

export async function getSystemTool(name: string): Promise<{ tools: Tool[], examples: ToolExample[] }> {
  const toolEntry = await prisma.toolEntry.findFirst({
    where: {
      reference:  name,
      systemTool: true,
    },
    include: { examples: true },
  })

  if (!toolEntry) {
    return { tools: [], examples: [] }
  }

  return {
    tools:    toolEntry.content as Tool[],
    examples: toolEntry.examples.map((example) => ({
      name:    example.name,
      url:     example.url,
      content: example.content as string || '', // Ensure content is always a string
    })),
  }
}

export async function upsertToolForUrl(url: string, tools: Tool[], examples: ToolExample[]): Promise<{ tools: Tool[], examples: ToolExample[] }> {
  const toolEntry = await prisma.toolEntry.upsert({
    where:  { reference: url },
    update: {
      content:  tools as Prisma.JsonArray,
      examples: {
        deleteMany: {},
        create:     examples,
      },
    },
    create: {
      reference: url,
      content:   tools as Prisma.JsonArray,
      examples:  { create: examples },
    },
    include: { examples: true },
  })

  return {
    tools:    toolEntry.content as Tool[],
    examples: toolEntry.examples.map((example) => ({
      name:    example.name,
      url:     example.url,
      content: example.content as string || '', // Ensure content is always a string
    })),
  }
}

export async function removeToolForUrlIfExists(url: string): Promise<Tool[]> {
  const toolEntry = await prisma.toolEntry.findFirst({ where: { reference: url } })

  if (!toolEntry) {
    return []
  }
  await prisma.toolEntry.delete({ where: { reference: url } })

  return toolEntry.content as Tool[]
}

export async function getToolsForQuery(query: string, page: number, pageSize: number): Promise<{ tools: Record<string, Tool[]>, totalCount: number }> {
  const skip = (page - 1) * pageSize
  const toolEntries = await prisma.toolEntry.findMany({
    where: { reference: { contains: query } },
    take: pageSize,
    skip: skip > 0 ? skip : undefined,
  })

  const tools: Record<string, Tool[]> = {}

  for (const entry of toolEntries) {
    const parsedTool = entry.content as Tool[]
    tools[entry.reference] = tools[entry.reference] || []
    tools[entry.reference].push(...parsedTool)
  }

  const totalCount = await prisma.toolEntry.count({ where: { reference: { contains: query } } })
  return { tools, totalCount }
}
