export const removeHttps = (url) => {
  if (url.startsWith("https")) {
    return url.slice(8)
  }
  if (url.startsWith("http")) {
    return url.slice(7)
  }

  return url
}

export default removeHttps
