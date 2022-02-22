import toast from "react-hot-toast"

export const notify = (message: string, type: "error" | "success") => {
  if (type === "error") {
    toast.error(message, {
      style: {
        background: "black",
        color: "white",
      },
    })
  } else {
    toast.success(message, {
      style: {
        background: "black",
        color: "white",
      },
    })
  }
}
