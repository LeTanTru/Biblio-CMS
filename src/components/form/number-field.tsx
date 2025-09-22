'use client';

import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import {
  Control,
  FieldPath,
  FieldValues,
  useController
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { ReactNode, useState, useEffect } from 'react';
import Button from '@/components/form/button';
import ToolTip from '@/components/form/tooltip';

type NumberFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  formItemClassName?: string;
  required?: boolean;
  labelClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  step?: number;
  min?: number;
  max?: number;
  allowNegative?: boolean;
  delimiter?: string;
  isFloat?: boolean;
};

export default function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  className,
  formItemClassName,
  required,
  labelClassName,
  disabled,
  readOnly = false,
  prefixIcon,
  suffixIcon,
  step = 1,
  min,
  max,
  allowNegative = false,
  delimiter = '.',
  isFloat = false
}: NumberFieldProps<T>) {
  const { field, fieldState } = useController({ control, name });

  const [raw, setRaw] = useState<string>('0');

  useEffect(() => {
    if (field.value !== undefined) {
      setRaw(
        isFloat ? (field.value as string).toString() : formatNumber(field.value)
      );
    } else {
      setRaw('0');
    }
  }, [field.value, isFloat]);

  const formatInteger = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
  };

  const formatNumber = (value: number) => {
    if (isFloat) return value.toString().replace('.', delimiter);
    return formatInteger(Math.round(value));
  };

  const parseNumber = (value: string) => {
    const normalized = value
      .replace(new RegExp(`\\${delimiter}`, 'g'), '.')
      .replace(/\./g, '.');
    const parsed = isFloat
      ? parseFloat(normalized)
      : parseInt(normalized.replace(/\./g, ''), 10);
    return isNaN(parsed) ? undefined : parsed;
  };

  const commit = (val: number) => {
    let next = val;
    if (!allowNegative && next < 0)
      next = min !== undefined ? Math.max(min, 0) : 0;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;

    field.onChange(next);
    setRaw(formatNumber(next));
  };

  const increment = () => commit((field.value ?? 0) + step);
  const decrement = () => commit((field.value ?? 0) - step);

  return (
    <FormItem
      className={cn(
        { 'cursor-not-allowed opacity-50': disabled },
        formItemClassName
      )}
    >
      {label && (
        <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
          {label} {required && <span className='text-destructive'>*</span>}
        </FormLabel>
      )}
      <FormControl>
        <div className='relative flex items-center'>
          <div className='relative flex-1'>
            {prefixIcon && (
              <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                {prefixIcon}
              </div>
            )}
            <Input
              placeholder={placeholder}
              type='text'
              disabled={disabled}
              readOnly={readOnly}
              value={raw}
              onChange={(e) => {
                const val = e.target.value;

                const regex = isFloat
                  ? allowNegative
                    ? /^-?\d*(\.\d*)?$/
                    : /^\d*(\.\d*)?$/
                  : allowNegative
                    ? /^-?\d*$/
                    : /^[\d.]*$/;

                if (!regex.test(val)) return;

                setRaw(val);

                if (val === '' || val === '-') {
                  field.onChange('');
                  return;
                }

                const parsed = parseNumber(val);
                if (parsed !== undefined) field.onChange(parsed);
                else field.onChange('');
              }}
              onBlur={() => {
                const parsed = parseNumber(raw);
                if (parsed !== undefined) {
                  setRaw(formatNumber(parsed));
                  field.onChange(parsed);
                } else {
                  setRaw('');
                  field.onChange('');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  increment();
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  decrement();
                }
              }}
              className={cn(
                className,
                'pt-0! pb-0 font-normal',
                {
                  'pl-10': prefixIcon,
                  'pr-10': suffixIcon,
                  'cursor-not-allowed opacity-50': disabled
                },
                fieldState.error
                  ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-[1px] focus-visible:ring-red-500'
                  : 'focus-visible:ring-dodger-blue focus-visible:border-transparent focus-visible:ring-2'
              )}
            />
            {suffixIcon && (
              <div className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'>
                {suffixIcon}
              </div>
            )}
          </div>
          <div className='ml-1 flex flex-col gap-1'>
            <ToolTip title='Tăng'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={increment}
                disabled={
                  disabled || (max !== undefined && (field.value ?? 0) >= max)
                }
                className='h-4 w-4 rounded'
              >
                +
              </Button>
            </ToolTip>
            <ToolTip title='Giảm'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={decrement}
                disabled={
                  disabled || (min !== undefined && (field.value ?? 0) <= min)
                }
                className='h-4 w-4 rounded'
              >
                –
              </Button>
            </ToolTip>
          </div>
        </div>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <p className='text-destructive ml-1'>{fieldState.error?.message}</p>
    </FormItem>
  );
}
