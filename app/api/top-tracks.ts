import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import { getNowPlaying, getTopTracks } from "app/lib/spotify"

const handler = async (_req: BlitzApiRequest, res: BlitzApiResponse) => {
  const response = await getTopTracks()
  const { items } = await response.json()

  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200")

  return res.status(200).json({ items })
}
export default handler
