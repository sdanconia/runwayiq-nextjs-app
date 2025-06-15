import React from 'react';
import { CloseIcon } from '../icons/icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-modalShow">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-neutral-darker">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral rounded-full transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-neutral-dark" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};