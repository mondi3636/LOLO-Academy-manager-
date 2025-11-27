import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="100" cy="40" r="18" fill="#16a34a" /> 
        {/* Body */}
        <path d="M100 58 Q90 100 80 130" stroke="#16a34a" strokeWidth="14" strokeLinecap="round" fill="none" />
        {/* Legs */}
        <path d="M80 130 L40 170" stroke="#16a34a" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M80 120 L140 160" stroke="#16a34a" strokeWidth="14" strokeLinecap="round" fill="none" />
        {/* Arms */}
        <path d="M95 70 L50 90" stroke="#16a34a" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M95 70 L150 50" stroke="#16a34a" strokeWidth="12" strokeLinecap="round" fill="none" />
        {/* Racket */}
        <line x1="150" y1="50" x2="170" y2="40" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="185" cy="32" rx="18" ry="24" stroke="#1f2937" strokeWidth="6" transform="rotate(60 185 32)" fill="none"/>
        <line x1="179" y1="18" x2="191" y2="46" stroke="#e5e7eb" strokeWidth="2" transform="rotate(60 185 32)" />
        <line x1="170" y1="32" x2="200" y2="32" stroke="#e5e7eb" strokeWidth="2" transform="rotate(60 185 32)" />
        {/* Shuttlecock */}
        <path d="M35 55 L15 65 L25 35 Z" fill="#dc2626" />
        <circle cx="25" cy="35" r="3" fill="#ffffff" />
    </svg>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }> = ({ 
  children, variant = 'primary', className = '', ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input 
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${className}`} 
      {...props} 
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, className = '', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select 
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${className}`} 
      {...props}
    >
      {children}
    </select>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' }> = ({ children, color = 'gray' }) => {
    const colors = {
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        blue: 'bg-blue-100 text-blue-800',
        gray: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
            {children}
        </span>
    );
};