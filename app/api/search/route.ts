import { searchIndex } from "@/data/search-index"

export async function POST(req: Request) {
  const { q, limit = 5 } = await req.json().catch(() => ({ q: "", limit: 5 }))

  const doLocal = (query: string, lim: number) => {
    const needle = (query || "").toLowerCase().trim()
    const items = !needle
      ? searchIndex
      : searchIndex.filter(
          (it) =>
            it.title.toLowerCase().includes(needle) ||
            it.snippet.toLowerCase().includes(needle) ||
            it.link.toLowerCase().includes(needle),
        )
    return items.slice(0, Math.min(10, Math.max(1, Number(lim))))
  }

  // If no query at all, return helpful defaults from local index.
  if (!q) {
    const items = doLocal("", limit)
    return Response.json({ ok: true, results: items })
  }

  // If external keys are missing, return local results instead of ok:false.
  const key = process.env.GOOGLE_API_KEY
  const cx = process.env.GOOGLE_CSE_ID
  if (!key || !cx) {
    const items = doLocal(q, limit)
    return Response.json({ ok: true, results: items })
  }

  const items = doLocal(q, limit)
  return Response.json({ ok: true, results: items })
}
