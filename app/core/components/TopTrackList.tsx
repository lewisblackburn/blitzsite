import fetcher from "app/lib/fetcher"
import { TopTrack, TopTracks } from "app/lib/types"
import { Image, Link } from "blitz"
import useSWR from "swr"

export default function TopTrackList() {
  const { data } = useSWR<TopTracks>("/api/top-tracks", fetcher)

  return (
    <div className="grid grid-cols-4 gap-5">
      {data?.items?.map((track) => (
        <Link key={track.name} href={track.uri}>
          <a className="transform hover:scale-[1.01] transition-all">
            <Image
              width={256}
              height={256}
              src={track.album.images[0]?.url ?? ""}
              alt="album_cover"
              className="rounded"
            />
          </a>
        </Link>
      ))}
    </div>
  )
}
