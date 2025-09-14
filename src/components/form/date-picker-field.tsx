'use client';

import { Control } from 'react-hook-form';
import { format, Locale } from 'date-fns';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/form';
import { useState } from 'react';

type Props = {
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  className?: string;
  format?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
};

export default function DatePickerField({
  control,
  name,
  label,
  description,
  className,
  format: dateFormat = 'dd/MM/yyyy',
  disabled,
  required,
  placeholder,
  labelClassName
}: Props) {
  const calendarLocale: Locale = vi;
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const parsedValue =
          typeof field.value === 'string' ? new Date(field.value) : field.value;

        return (
          <FormItem
            className={cn(className, {
              'cursor-not-allowed opacity-50': disabled
            })}
          >
            {label && (
              <FormLabel className={cn('ml-1 gap-1.5', labelClassName)}>
                {label}
                {required && <span className='text-destructive'>*</span>}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      'data-[state=open]:border-[dodgerblue] data-[state=open]:ring-1 data-[state=open]:ring-[dodgerblue]',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={disabled}
                  >
                    <CalendarIcon className='mr-1 h-4 w-4' />
                    {field.value
                      ? format(parsedValue, dateFormat, {
                          locale: calendarLocale
                        })
                      : placeholder}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto space-y-2 p-4' align='start'>
                <Calendar
                  locale={calendarLocale}
                  mode='single'
                  selected={parsedValue}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date);
                      setOpen(false);
                    }
                  }}
                  classNames={{
                    day_button:
                      'data-[selected-single=true]:bg-dodger-blue data-[selected-single=true]:text-white cursor-pointer !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0'
                  }}
                />
                <Button
                  type='button'
                  variant='outline'
                  className='w-full'
                  onClick={() => {
                    const today = new Date();
                    field.onChange(today);
                    setOpen(false);
                  }}
                >
                  Hôm nay
                </Button>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage className='mb-0 ml-1' />
          </FormItem>
        );
      }}
    />
  );
}
