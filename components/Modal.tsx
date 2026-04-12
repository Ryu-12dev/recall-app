import { ReactNode } from "react";

export default function Modal({ onClose, children }: { onClose: () => void, children: ReactNode }) {
  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div 
        className="bg-white p-6 rounded-xl"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
