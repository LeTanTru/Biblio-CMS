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
import { useState, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DropdownProps } from 'react-day-picker';
import { DEFAULT_DATE_FORMAT } from '@/constants';

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
  format: dateFormat = DEFAULT_DATE_FORMAT,
  disabled,
  required,
  placeholder,
  labelClassName
}: Props) {
  const calendarLocale: Locale = vi;
  const [open, setOpen] = useState(false);
  // const [popoverWidth, setPopoverWidth] = useState<number | undefined>();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // useEffect(() => {
  //   if (triggerRef.current) {
  //     setPopoverWidth(triggerRef.current.offsetWidth);
  //   }
  // }, [open]);

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
                    ref={triggerRef}
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal text-black opacity-100',
                      'focus:ring-0 focus-visible:border-gray-200 focus-visible:ring-0',
                      'data-[state=open]:border-dodger-blue data-[state=open]:ring-dodger-blue data-[state=open]:ring-1',
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
              <PopoverContent
                className='w-90 origin-top space-y-2 p-4'
                align='center'
              >
                <Calendar
                  locale={calendarLocale}
                  className='w-full'
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
                      'data-[selected-single=true]:bg-dodger-blue data-[selected-single=true]:text-white cursor-pointer !ring-0 !focus-visible:ring-0 !focus-visible:ring-offset-0',
                    button_next:
                      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 transition-all ease-linear duration-200 outline-none focus-visible:border-transparent focus-visible:ring-transparent focus-visible:ring-0 hover:bg-transparent size-8 -mr-2 aria-disabled:opacity-50 p-0 select-none rdp-button_previous cursor-pointer hover:text-dodger-blue',
                    button_previous:
                      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 transition-all ease-linear duration-200 outline-none focus-visible:border-transparent focus-visible:ring-transparent focus-visible:ring-0 hover:bg-transparent size-8 -ml-2 aria-disabled:opacity-50 p-0 select-none rdp-button_previous cursor-pointer hover:text-dodger-blue'
                  }}
                  captionLayout='dropdown'
                  defaultMonth={new Date(field.value)}
                  startMonth={new Date(1700, 0)}
                  endMonth={new Date(2050, 12)}
                  components={{ Dropdown: CustomSelectDropdown }}
                  formatters={{
                    formatMonthDropdown: (date) =>
                      date.toLocaleString('vi-VN', { month: 'long' })
                  }}
                  onMonthChange={(month: Date) => {
                    const firstDay = new Date(
                      month.getFullYear(),
                      month.getMonth(),
                      1
                    );
                    field.onChange(firstDay);
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

function CustomSelectDropdown(props: DropdownProps) {
  const { options, value, onChange } = props;

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: newValue
        }
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger className='z-9999 cursor-pointer justify-center gap-1!'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem
              className='cursor-pointer text-center'
              key={option.value}
              value={option.value.toString()}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
