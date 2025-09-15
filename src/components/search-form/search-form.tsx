'use client';
import { Button, Col, InputField, Row, SelectField } from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { DEFAULT_COL_SPAN, FieldTypes } from '@/constants';
import { SearchFormProps } from '@/types';
import { BrushCleaning, Search } from 'lucide-react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import z from 'zod';

function buildDefaultValues<S extends FieldValues>(
  searchFields: SearchFormProps<S>['searchFields']
): Record<string, any> {
  return searchFields.reduce(
    (acc, field) => {
      if (!field.key) return acc;
      switch (field.type) {
        case FieldTypes.STRING:
          acc[field.key as string] = '';
          break;
        case FieldTypes.NUMBER:
          acc[field.key as string] = 0;
          break;
        case FieldTypes.SELECT:
        case FieldTypes.AUTOCOMPLETE:
          acc[field.key as string] = null;
          break;
        case FieldTypes.DATE:
        case FieldTypes.DATE_RANGE:
          acc[field.key as string] = null;
          break;
        default:
          acc[field.key as string] = '';
      }
      return acc;
    },
    {} as Record<string, any>
  );
}

export default function SearchForm<S extends FieldValues>({
  searchFields,
  schema,
  initialValues,
  handleSearchSubmit,
  handleSearchReset
}: SearchFormProps<S>) {
  const defaultValues: z.infer<typeof schema> =
    buildDefaultValues(searchFields);

  const onSubmit = (values: z.infer<typeof schema>) => {
    handleSearchSubmit(values);
  };

  const handleReset = (form: UseFormReturn<z.infer<typeof schema>>) => {
    handleSearchReset(form);
  };

  return (
    <BaseForm
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      schema={schema}
      initialValues={initialValues}
    >
      {(form) => (
        <>
          <Row className='gap-2'>
            {searchFields.map((sf) => {
              return (
                <Col
                  key={sf.key as string}
                  span={sf.colSpan || DEFAULT_COL_SPAN}
                >
                  {sf.type === FieldTypes.SELECT ? (
                    <SelectField
                      control={form.control}
                      name={sf.key as string}
                      placeholder={sf.placeholder}
                      options={sf.options ?? []}
                      getLabel={(option) => option.label}
                      getValue={(option) => option.value}
                      className='focus-visible:ring-dodger-blue'
                    />
                  ) : (
                    <InputField
                      control={form.control}
                      name={sf.key as string}
                      placeholder={sf.placeholder}
                      className='focus-visible:ring-dodger-blue'
                    />
                  )}
                </Col>
              );
            })}

            <Col className='w-9'>
              <Button type='submit' variant={'primary'}>
                <Search />
              </Button>
            </Col>
            <Col className='w-9'>
              <Button
                type='button'
                onClick={() => handleReset(form)}
                className='hover:[&>svg]:stroke-dodger-blue hover:border-dodger-blue border border-gray-300 bg-white hover:bg-transparent [&>svg]:stroke-black'
              >
                <BrushCleaning className='transition-all duration-200 ease-linear' />
              </Button>
            </Col>
          </Row>
        </>
      )}
    </BaseForm>
  );
}
