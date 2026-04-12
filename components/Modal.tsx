import { ReactNode } from "react";
export default function Modal({ onClose, isOpen, children }: { onClose: () => void, isOpen: boolean, children: ReactNode }) {
  return (
    <div 
      onClick={onClose}
      className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className="bg-white p-6 rounded-xl"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
