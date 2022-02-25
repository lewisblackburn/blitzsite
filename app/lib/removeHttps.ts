export const removeHttps = (url) => {
  if (url.startsWith("https")) {
    return url.slice(8)
  }
  return url
}

export default removeHttps
