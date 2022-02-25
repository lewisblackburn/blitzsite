export const Card: React.FC = ({ children }) => {
  return (
    <div className="flex items-center justify-center rounded-xl border border-black/40 bg-black/20 px-6 py-12 md:px-10 md:py-20">
      {children}
    </div>
  )
}
