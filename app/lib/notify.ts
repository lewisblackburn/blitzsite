import toast from "react-hot-toast"

export const notify = (message: string) =>
  toast.error(message, {
    style: {
      background: "black",
      color: "white",
    },
  })
