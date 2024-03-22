import * as db from '@/lib/db'

const pageSize = 10

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/json')
  const {q, page} = getQuery(event)
  return await db.getToolsForQuery(q as string, page as number, pageSize)
})
