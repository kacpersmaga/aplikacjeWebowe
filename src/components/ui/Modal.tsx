import React, { useEffect } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

// Track how many modals are open to correctly manage body scroll
let openModalCount = 0;

export const Modal: React.FC<ModalProps> = ({ onClose, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    openModalCount++;
    if (openModalCount === 1) {
      document.body.style.overflow = 'hidden';
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
      openModalCount--;
      if (openModalCount === 0) {
        document.body.style.overflow = '';
      }
    };
    // onClose intentionally omitted — we only want to register/unregister on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`w-full ${maxWidth} bg-bg-sidebar border border-border rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
};
