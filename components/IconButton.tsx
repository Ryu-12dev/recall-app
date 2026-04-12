import { ReactNode } from "react";

export default function IconButton({ onClick, children }: { onClick: () => void, children: ReactNode }) {
  return (
    <button 
      className="text-gray-400 hover:text-black hover:cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
