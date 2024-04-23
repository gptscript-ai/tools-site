import * as db from '@/lib/db'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/json')
  let { q, page, limit } = getQuery(event)

  limit = Number.parseInt(limit as string, 10)

  if (!limit || Number.isNaN(limit)) {
    limit = 10
  }

  return await db.getToolsForQuery(q as string, page as number, limit as number)
})
