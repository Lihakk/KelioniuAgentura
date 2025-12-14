// src/components/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

type BackButtonProps = {
  to?: string;
  label?: string;
  className?: string;
};

const BackButton: React.FC<BackButtonProps> = ({ to, label = 'Sugrįžti', className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 ${className}`}
      aria-label={label}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default BackButton;