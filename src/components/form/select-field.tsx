'use client';

import * as React from 'react';
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/form';
import Image from 'next/image';
import { emptyData } from '@/assets';

type SelectFieldProps<
  TFieldValues extends FieldValues,
  TOption extends Record<string, any>
> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: TOption[];
  description?: string;
  className?: string;
  required?: boolean;
  multiple?: boolean;
  getLabel: (option: TOption) => string | number;
  getValue: (option: TOption) => string | number;
  getPrefix?: (option: TOption) => React.ReactNode;
  allowClear?: boolean;
  searchText?: string;
  notFoundContent?: React.ReactNode;
  labelClassName?: string;
  disabled?: boolean;
  onValueChange?: (value: string | number | (string | number)[]) => void;
};

const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export default function SelectField<
  TFieldValues extends FieldValues,
  TOption extends Record<string, any>
>({
  control,
  name,
  label,
  placeholder,
  options,
  description,
  className,
  required,
  multiple = false,
  getLabel,
  getValue,
  getPrefix,
  allowClear,
  searchText,
  notFoundContent = 'Không có kết quả nào',
  labelClassName,
  disabled = false,
  onValueChange
}: SelectFieldProps<TFieldValues, TOption>) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  function isFuzzyMatch(input: string, target: string): boolean {
    let i = 0,
      j = 0;
    while (i < input.length && j < target.length) {
      if (input[i] === target[j]) i++;
      j++;
    }
    return i === input.length;
  }

  const normalizedSearch = normalizeText(searchValue);

  const filteredOptions = options.filter((option) => {
    const label = String(getLabel(option));
    const normalizedLabel = normalizeText(label);
    return isFuzzyMatch(normalizedSearch, normalizedLabel);
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValues: (string | number)[] =
          field.value === undefined
            ? []
            : multiple
              ? Array.isArray(field.value)
                ? field.value
                : []
              : [field.value];

        const toggleValue = (val: string | number) => {
          if (multiple) {
            const next = selectedValues.includes(val)
              ? selectedValues.filter((v) => v !== val)
              : [...selectedValues, val];
            field.onChange(next);
            onValueChange?.(next);
          } else {
            field.onChange(val);
            onValueChange?.(val);
            setOpen(false);
          }
        };

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
                <Button
                  type='button'
                  variant='outline'
                  role='combobox'
                  aria-label='Select'
                  disabled={disabled}
                  className={cn(
                    'w-full flex-wrap justify-between border-1 py-0 text-black opacity-80 opacity-100 focus:ring-0 focus-visible:border-gray-200 focus-visible:shadow-none focus-visible:ring-0',
                    {
                      'pl-1!': selectedValues.length > 1,
                      'disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:bg-transparent disabled:[&>div>span]:opacity-80':
                        disabled,
                      'border-dodger-blue ring-dodger-blue ring-1': open,
                      '[&>div>span]:text-gray-300': fieldState.invalid,
                      'border-red-500 ring-1 ring-red-500': fieldState.invalid,
                      'pl-[5px]!': multiple && selectedValues.length
                    }
                  )}
                >
                  {multiple ? (
                    selectedValues.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {selectedValues.map((val) => {
                          const opt = options.find((o) => getValue(o) === val);
                          if (!opt) return null;
                          return (
                            <div
                              key={val}
                              className='bg-accent text-accent-foreground flex items-center rounded-lg px-3 py-1 text-sm'
                            >
                              {getPrefix?.(opt) && (
                                <span className='mr-1 font-mono text-xs opacity-70'>
                                  {getPrefix(opt)}
                                </span>
                              )}
                              {getLabel(opt)}
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(
                                    selectedValues.filter((v) => v !== val)
                                  );
                                }}
                                className='hover:text-destructive ml-2 cursor-pointer text-lg leading-none'
                              >
                                <X />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className='opacity-30'>{placeholder}</span>
                    )
                  ) : selectedValues.length === 1 ? (
                    (() => {
                      const val = selectedValues[0];
                      const opt = options.find((o) => getValue(o) === val);
                      return opt ? (
                        <div className='flex items-center gap-2 truncate'>
                          {getPrefix?.(opt)}
                          <span>{getLabel(opt)}</span>
                        </div>
                      ) : (
                        <span className='opacity-30'>{placeholder}</span>
                      );
                    })()
                  ) : (
                    <span className='opacity-30'>{placeholder}</span>
                  )}

                  {selectedValues.length > 0 && allowClear ? (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange(multiple ? [] : '');
                        setOpen(false);
                      }}
                      className='bg-accent ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full p-2 hover:opacity-80'
                    >
                      <X className='size-3' />
                    </span>
                  ) : (
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  )}
                </Button>
              </PopoverTrigger>

              {description && (
                <FormDescription className='ml-1.5'>
                  {description}
                </FormDescription>
              )}

              <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
                <Command className='bg-background' shouldFilter={false}>
                  <CommandInput
                    placeholder={searchText}
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandEmpty className='mx-auto pt-4 pb-2 text-center text-sm'>
                    <Image
                      src={emptyData.src}
                      width={120}
                      height={50}
                      className='mx-auto mt-2'
                      alt={notFoundContent as string}
                    />
                    {notFoundContent}
                  </CommandEmpty>
                  <CommandGroup className='max-h-100 overflow-y-auto max-[1560px]:max-h-50'>
                    {filteredOptions.map((opt) => {
                      const val = getValue(opt);
                      return (
                        <CommandItem
                          key={val}
                          onSelect={() => toggleValue(val)}
                          className={cn(
                            'cursor-pointer rounded transition-all duration-150 ease-linear select-none',
                            {
                              'bg-accent text-accent-foreground':
                                selectedValues.includes(val)
                            }
                          )}
                        >
                          {getPrefix?.(opt) && (
                            <span className='mr-1 font-mono text-xs opacity-70'>
                              {getPrefix(opt)}
                            </span>
                          )}
                          {getLabel(opt) ?? 'Không có kết quả nào'}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage className={'mb-0 ml-1'} />
          </FormItem>
        );
      }}
    />
  );
}
