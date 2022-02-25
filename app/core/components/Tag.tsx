export const Tag: React.FC = ({ children }) => {
  return (
    <div className="flex-none w-fit justify-center flex items-center space-x-2 cursor-pointer self-start border uppercase rounded-full hover:bg-opacity-30 px-3 py-0.5 text-xs font-semibold leading-5 tracking-wide border-opacity-10 border-red-200 text-red-200 bg-red-500 bg-opacity-10">
      {children}
    </div>
  )
}
