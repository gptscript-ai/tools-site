import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import type { Tool, ToolExample } from '@/lib/types'
import { FeaturedTools } from '@/lib/featured'

const prisma = new PrismaClient()
const all = -1

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
  console.log('Deleting tool for url:', url)
  const toolEntry = await prisma.toolEntry.findFirst({ where: { reference: url } })

  if (!toolEntry) {
    return []
  }
  await prisma.toolEntry.delete({ where: { reference: url } })

  return toolEntry.content as Tool[]
}

export async function getToolsForQuery(query: string, page: number, pageSize: number): Promise<{ tools: Record<string, Tool[]>, totalCount: number }> {
  const skip = (page - 1) * pageSize

  // First get the tools whose name (GitHub reference) contains the query
  const toolEntriesWithReference = await prisma.toolEntry.findMany({
    where: {
      reference: {
        contains: query,
        mode: 'insensitive'
      }
    },
    take: page != all ? pageSize : undefined,
    skip: skip > 0 && page != all ? skip : undefined,
  })

  // Next, get the tools whose description contains the query
  const toolEntriesWithDescription = await prisma.toolEntry.findMany({
    where: {
      AND: [
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          NOT: {
            reference: {
              contains: query,
              mode: 'insensitive'
            }
          }
        }
      ]
    },
    take: page != all ? pageSize : undefined,
    skip: skip > 0 && page != all ? skip : undefined,
  })

  const featured: Record<string, Tool[]> = {}
  const tools: Record<string, Tool[]> = {}

  // Add them to the results so that the ones with the query in the reference come first
  for (const entry of toolEntriesWithReference) {
    const parsedTool = entry.content as Tool[]
    if (FeaturedTools.has(entry.reference)) {
      featured[entry.reference] = featured[entry.reference] || []
      featured[entry.reference].push(...parsedTool)
    } else {
      tools[entry.reference] = tools[entry.reference] || []
      tools[entry.reference].push(...parsedTool)
    }
  }

  for (const entry of toolEntriesWithDescription) {
    const parsedTool = entry.content as Tool[]
    if (FeaturedTools.has(entry.reference)) {
      featured[entry.reference] = featured[entry.reference] || []
      featured[entry.reference].push(...parsedTool)
    } else {
      tools[entry.reference] = tools[entry.reference] || []
      tools[entry.reference].push(...parsedTool)
    }
  }

  const totalCount = await prisma.toolEntry.count({
    where: {
      OR: [
        {
          reference: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    }
  })

  return { tools: {...featured, ...tools}, totalCount }
}
