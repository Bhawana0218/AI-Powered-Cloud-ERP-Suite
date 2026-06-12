export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost';
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}
