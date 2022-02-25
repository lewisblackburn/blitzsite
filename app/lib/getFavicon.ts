export default function getFavicon(url: string): string {
  const urlParts = url.split("/")
  const host = urlParts[2]
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${host}`
  return faviconUrl
}
