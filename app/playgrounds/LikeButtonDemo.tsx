import Button from "app/core/components/Button"
import { IconButton } from "app/core/components/IconButton"
import classNames from "classnames"
import { useState } from "react"
import { IoHeart } from "react-icons/io5"

export const LikeButtonDemo = ({}) => {
  const [{ likes, isLiked, isLiking, isUnliking, isFetchingLikes }, setState] = useState({
    likes: 0,
    isLiked: false,
    isLiking: false,
    isUnliking: false,
    isFetchingLikes: false,
  })

  return (
    <div>
      <IconButton
        icon={IoHeart}
        className={classNames("h-8", {
          "text-red-500": isLiked,
        })}
        onClick={() => {
          if (isLiked)
            setState({
              likes: 0,
              isLiked: false,
              isLiking: false,
              isUnliking: true,
              isFetchingLikes: false,
            })
          else {
            setState((prev) => ({
              likes: 1,
              isLiked: true,
              isLiking: true,
              isUnliking: false,
              isFetchingLikes: false,
            }))
          }

          setTimeout(() => {
            setState((prev) => ({
              likes: prev.likes,
              isLiked: prev.isLiked,
              isLiking: false,
              isUnliking: false,
              isFetchingLikes: false,
            }))
          }, 1000)
        }}
        loading={isLiking || isUnliking || isFetchingLikes}
        disabled={isLiking || isUnliking || isFetchingLikes}
      >
        {likes}
      </IconButton>
    </div>
  )
}
