import Spinner from "./Spinner"

export const Loading: React.FC = () => {
  return (
    <div className="fixed grid place-items-center bg-gray-900 z-50 inset-0 w-screen h-screen">
      <Spinner />
    </div>
  )
}

export default Loading
