'use client';

import { Control } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { cn } from '@/lib';

type ColorPickerFieldProps = {
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  labelClassName?: string;
};

export default function ColorPickerField({
  control,
  name,
  label,
  description,
  className,
  disabled,
  required,
  labelClassName
}: ColorPickerFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
              {label}
              {required && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <div className='flex items-center space-x-4'>
            <FormControl>
              <input
                type='color'
                value={field.value || '#000000'}
                onChange={field.onChange}
                disabled={disabled}
                className='border-input bg-background h-10 w-10 cursor-pointer rounded border p-0'
              />
            </FormControl>
            <span className='bg-muted rounded border px-2 py-1 font-mono text-sm'>
              {field.value}
            </span>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className={'mb-0 ml-1'} />
        </FormItem>
      )}
    />
  );
}
