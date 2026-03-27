import React from 'react';
import { ChevronDown } from 'lucide-react';

const labelClass = 'block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5';
const inputBase =
  'w-full px-3.5 py-2.5 bg-bg-dark border border-border rounded-lg text-text-main text-sm ' +
  'placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 ' +
  'transition-all';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className={labelClass}>{label}</label>
    <input id={id} className={inputBase} {...props} />
  </div>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className={labelClass}>{label}</label>
    <textarea id={id} className={`${inputBase} resize-none`} {...props} />
  </div>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className={labelClass}>{label}</label>
    <div className="relative">
      <select id={id} className={`${inputBase} pr-9 cursor-pointer`} {...props}>
        {children}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
    </div>
  </div>
);
