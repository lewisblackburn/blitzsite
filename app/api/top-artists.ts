import { getTopArtists } from "app/lib/spotify"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const handler = async (_req: BlitzApiRequest, res: BlitzApiResponse) => {
  const response = await getTopArtists()
  const { items } = await response.json()

  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200")

  return res.status(200).json({ items })
}
export default handler
