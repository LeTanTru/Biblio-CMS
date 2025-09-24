'use client';

import { Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useController, Control } from 'react-hook-form';
import { useId } from 'react';
import { FormLabel } from '@/components/ui/form';
import { cn } from '@/lib';

type BooleanFieldProps = {
  control: Control<any>;
  name: string;
  label?: string;
  required?: boolean;
  labelClassName?: string;
  className?: string;
};

export default function BooleanField({
  control,
  name,
  label,
  required,
  className,
  labelClassName
}: BooleanFieldProps) {
  const id = useId();

  const {
    field: { value, onChange }
  } = useController({ name, control });

  return (
    <div className='mt-auto flex items-center gap-2'>
      <div
        className={cn(
          'relative inline-grid h-8 grid-cols-[1fr_1fr] items-center text-sm font-medium',
          className
        )}
      >
        <Switch
          id={id}
          checked={value}
          onCheckedChange={onChange}
          className='peer data-[state=unchecked]:bg-input/50 data-[state=checked]:bg-dodger-blue absolute inset-0 h-[inherit] w-auto cursor-pointer [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full'
        />
        <span className='relative ms-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full'>
          <X size={16} aria-hidden='true' />
        </span>
        <span className='peer-data-[state=checked]:text-background relative me-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full'>
          <Check size={16} aria-hidden='true' />
        </span>
      </div>
      {label && (
        <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
          {label}
          {required && <span className='text-destructive'>*</span>}
        </FormLabel>
      )}
    </div>
  );
}
