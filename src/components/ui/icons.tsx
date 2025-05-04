
import React from 'react';
import { LucideProps } from 'lucide-react';

export const VideoIcon: React.FC<LucideProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM4 12a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z" />
      <path d="m16 7 4-3v12l-4-3" />
    </svg>
  );
};

export const ImageIcon: React.FC<LucideProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
};

export const StoryIcon: React.FC<LucideProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="12" x2="12" y1="6" y2="10" />
      <line x1="12" x2="12" y1="14" y2="18" />
      <circle cx="12" cy="6" r="1" />
      <circle cx="12" cy="18" r="1" />
      <path d="M19 5c-1.5 0-2.1.6-2.8 1.4-.1.1-.1.2-.2.3-.1.1-.1.2-.2.3-.7.8-1.3 1.4-2.8 1.4-1.5 0-2.1-.6-2.8-1.4-.1-.1-.1-.2-.2-.3-.1-.1-.1-.2-.2-.3C9.1 5.6 8.5 5 7 5" />
    </svg>
  );
};

export const RefreshCcw: React.FC<LucideProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 3v7h-7" />
      <path d="M3 21v-7h7" />
      <path d="M16 3a9 9 0 0 0-9 9" />
      <path d="M8 21a9 9 0 0 0 9-9" />
    </svg>
  );
};

export const CalendarPlus: React.FC<LucideProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <line x1="19" x2="19" y1="16" y2="22" />
      <line x1="16" x2="22" y1="19" y2="19" />
    </svg>
  );
};

export const History: React.FC<LucideProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
};
