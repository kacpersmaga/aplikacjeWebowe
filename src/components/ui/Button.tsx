import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-primary hover:bg-primary-hover text-white shadow-sm shadow-primary/20 focus-visible:ring-primary/50',
  secondary:
    'bg-bg-sidebar hover:bg-bg-dark text-text-main border border-border hover:border-primary/40 focus-visible:ring-primary/40',
  ghost:
    'text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-main focus-visible:ring-primary/40',
  danger:
    'bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/30 hover:border-danger focus-visible:ring-danger/40',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-xl',
  lg: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => (
  <button
    className={`
      inline-flex items-center justify-center font-medium transition-all duration-150
      active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
      focus-visible:outline-none focus-visible:ring-2
      ${VARIANTS[variant]} ${SIZES[size]} ${className}
    `}
    {...props}
  >
    {icon && <span className="shrink-0 -ml-0.5">{icon}</span>}
    {children}
  </button>
);
