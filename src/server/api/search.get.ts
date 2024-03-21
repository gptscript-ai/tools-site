import * as db from '@/lib/db'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/json')

  return await db.getToolsForQuery(getQuery(event).q as string)
})
