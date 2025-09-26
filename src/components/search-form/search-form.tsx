'use client';

import {
  AutoCompleteField,
  Button,
  Col,
  InputField,
  Row,
  SelectField
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { DEFAULT_COL_SPAN, FieldTypes } from '@/constants';
import { ApiConfig, AutoCompleteOption, SearchFormProps } from '@/types';
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
    handleSearchReset();
    form.reset({});
  };

  return (
    <BaseForm
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      schema={schema}
      initialValues={initialValues}
      className='w-full pl-0'
    >
      {(form) => (
        <>
          <Row className='my-0 flex-wrap gap-2'>
            {searchFields.map((sf) => {
              switch (sf.type) {
                case FieldTypes.SELECT: {
                  return (
                    <Col
                      key={sf.key as string}
                      className={getColWidth({ span: 6, gutter: 8 })}
                    >
                      <SelectField
                        control={form.control}
                        name={sf.key as string}
                        placeholder={sf.placeholder}
                        options={sf.options ?? []}
                        getLabel={(option) => option.label}
                        getValue={(option) => option.value}
                        onValueChange={(val) => {
                          if (sf.submitOnChanged) {
                            form.setValue(sf.key as string, val);
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </Col>
                  );
                }
                case FieldTypes.AUTOCOMPLETE: {
                  return (
                    <Col
                      key={sf.key as string}
                      className={getColWidth({ span: 6, gutter: 8 })}
                    >
                      <AutoCompleteField
                        apiConfig={sf.apiConfig as ApiConfig}
                        control={form.control}
                        mappingData={
                          sf.mappingData as (
                            option: Record<string, any>
                          ) => AutoCompleteOption
                        }
                        name={sf.key as string}
                        searchParams={sf.searchParams as string[]}
                        initialParams={sf.initialParams}
                        placeholder={sf.placeholder}
                      />
                    </Col>
                  );
                }
                default: {
                  return (
                    <Col
                      key={sf.key as string}
                      className={getColWidth({ span: 6, gutter: 8 })}
                    >
                      <InputField
                        control={form.control}
                        name={sf.key as string}
                        placeholder={sf.placeholder}
                      />
                    </Col>
                  );
                }
              }
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

function getColWidth({ span, gutter }: { span: number; gutter: number }) {
  return gutter
    ? `w-[calc(${((span || DEFAULT_COL_SPAN) * 100) / 24}%_-_${gutter}px)]`
    : `w-[${((span || DEFAULT_COL_SPAN) * 100) / 24}%]`;
}
