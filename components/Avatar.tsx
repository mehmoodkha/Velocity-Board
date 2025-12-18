
import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'sm', className = '' }) => {
  const sizes = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full border border-slate-200 object-cover ${className}`}
    />
  );
};

export default Avatar;
