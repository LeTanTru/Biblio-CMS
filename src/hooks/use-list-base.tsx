'use client';

import { Button, ToolTip } from '@/components/form';
import { HasPermission } from '@/components/has-permission';
import { SearchForm } from '@/components/search-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  DEFAULT_TABLE_PAGE_SIZE,
  DEFAULT_TABLE_PAGE_START,
  FieldTypes,
  statusOptions as defaultStatusOptions
} from '@/constants';
import useNavigate from '@/hooks/use-navigate';
import useQueryParams from '@/hooks/use-query-params';
import { logger } from '@/logger';
import {
  ApiConfig,
  ApiResponse,
  ApiResponseList,
  BaseSearchType,
  Column,
  OptionType,
  PaginationType,
  SearchFormProps
} from '@/types';
import { http, notify } from '@/utils';
import { Separator } from '@radix-ui/react-separator';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { Edit2, Info, PlusIcon, RefreshCcw, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type HandlerType<T extends { id: string }, S extends BaseSearchType> = {
  changePagination: (page: number) => void;
  renderActionColumn: (options?: {
    actions?: Record<'edit' | 'delete' | string, ActionCondition<T>>;
    buttonProps?: Record<string, any>;
    columnProps?: Record<string, any>;
  }) => Column<T>;
  additionalParams: () => Partial<S>;
  additionalPathParams: () => Record<string, any>;
  additionalColumns: () => React.ReactNode | any;
  renderAddButton: () => React.ReactNode | any;
  renderSearchForm: ({
    searchFields,
    schema
  }: {
    searchFields: SearchFormProps<S>['searchFields'];
    schema: SearchFormProps<S>['schema'];
  }) => React.ReactNode | any;
  renderStatusColumn: ({
    statusOptions,
    columnProps
  }?: {
    statusOptions?: OptionType[];
    columnProps?: Record<string, any>;
  }) => Column<T>;
  setQueryParam: (key: keyof S, value: S[keyof S] | null) => void;
  handleEditClick: (id: string) => void;
  handleDeleteClick: (id: string) => void;
  invalidateQueries: () => void;
  renderReloadButton: () => React.ReactNode;
};

type ActionCondition<T> = boolean | ((record: T) => boolean);

type UseListBaseProps<T extends { id: string }, S extends BaseSearchType> = {
  apiConfig: {
    getList: ApiConfig;
    getById?: ApiConfig;
    create?: ApiConfig;
    update?: ApiConfig;
    delete?: ApiConfig;
  };
  options: {
    queryKey: string;
    objectName: string;
    pageSize?: number;
    defaultFilters?: Partial<S>;
    enabled?: boolean;
    excludeFromQueryFilter?: string[];
  };
  override?: (handlers: HandlerType<T, S>) => HandlerType<T, S> | void;
};

export default function useListBase<
  T extends { id: string },
  S extends BaseSearchType
>({ apiConfig, options, override }: UseListBaseProps<T, S>) {
  const {
    queryKey = '',
    objectName = '',
    pageSize = DEFAULT_TABLE_PAGE_SIZE,
    defaultFilters = {} as Partial<S>,
    enabled = true,
    excludeFromQueryFilter = []
  } = options;
  const navigate = useNavigate();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [data, setData] = useState<T[]>([]);

  const [pagination, setPagination] = useState<PaginationType>({
    current: DEFAULT_TABLE_PAGE_START,
    pageSize: DEFAULT_TABLE_PAGE_SIZE,
    total: 0
  });
  const { searchParams, setQueryParams, setQueryParam, serializeParams } =
    useQueryParams<S>();

  // Combined current params with default params
  const mergedSearchParams = useMemo(() => {
    return { ...defaultFilters, ...searchParams };
  }, [searchParams, defaultFilters]);

  // Filter params which will not be filtered by
  const queryFilter = useMemo(() => {
    const filteredParams = Object.fromEntries(
      Object.entries({
        ...mergedSearchParams,
        page: mergedSearchParams.page
          ? Number(mergedSearchParams.page) - 1
          : DEFAULT_TABLE_PAGE_START,
        size: pageSize
      }).filter(([key]) => !excludeFromQueryFilter.includes(key))
    );

    return {
      ...filteredParams
    } as S;
  }, [mergedSearchParams, pageSize, excludeFromQueryFilter]);

  // Clear undefined | null params
  useEffect(() => {
    Object.entries(defaultFilters).forEach(([key, value]) => {
      if (
        searchParams[key as keyof S] === undefined ||
        searchParams[key as keyof S] === null
      ) {
        setQueryParam(key as keyof S, value as S[keyof S]);
      }
    });
  }, [defaultFilters, searchParams, setQueryParam]);

  const additionalPathParams = () => ({});

  const additionalParams = () => ({});

  // query
  const listQuery = useQuery({
    queryKey: [`${queryKey}-list`, queryFilter],
    queryFn: () =>
      http.get<ApiResponseList<T>>(apiConfig.getList, {
        params: { ...queryFilter, ...handlers.additionalParams() },
        pathParams: { ...handlers.additionalPathParams() }
      }),
    placeholderData: keepPreviousData,
    enabled
  });
  const deleteMutation = useMutation({
    mutationKey: [`delete-${queryKey}`],
    mutationFn: (id: string) =>
      http.delete<ApiResponse<any>>(apiConfig.delete as ApiConfig, {
        pathParams: {
          id
        }
      })
  });

  useEffect(() => {
    setData(listQuery.data?.data.content || []);
  }, [listQuery.data?.data.content]);

  // Pagination
  const current = searchParams['page'];
  useEffect(() => {
    setPagination((p) => ({
      ...p,
      current: current ? Number(current) : DEFAULT_TABLE_PAGE_START + 1,
      total: listQuery.data?.data.totalPages ?? 0
    }));
  }, [current, listQuery.data]);

  const changePagination = (page: number) => {
    setPagination({ ...pagination, current: page });

    setQueryParams({
      ...searchParams,
      page
    } as Partial<S>);
    if (page === 1) {
      setQueryParam('page', null);
    }
  };

  const handleEditClick = (id: string) => {
    const query = serializeParams(searchParams);
    const path = query ? `${pathname}/${id}?${query}` : `${pathname}/${id}`;
    navigate(path);
  };

  const handleDeleteClick = async (id: string) => {
    await deleteMutation.mutateAsync(id, {
      onSuccess: (res) => {
        if (res.result) {
          notify.success(`Xoá ${objectName} thành công`);
          close();
          queryClient.invalidateQueries({ queryKey: [`${queryKey}-list`] });
          listQuery.refetch();
        } else {
          notify.error(`Xoá ${objectName} thất bại`);
        }
      },
      onError: (error: Error) => {
        logger.error(`Error while deleting ${queryKey}: `, error);
        notify.error('Có lỗi xảy ra khi xóa');
      }
    });
  };

  const additionalColumns = () => ({});

  const actionColumn = () => ({
    edit: (record: T, buttonProps?: Record<string, any>) => {
      if (!apiConfig.update || !apiConfig.update.permissionCode) return null;
      return (
        <HasPermission
          requiredPermissions={[apiConfig.update.permissionCode as string]}
        >
          <ToolTip title={`Sửa ${objectName}`}>
            <span>
              <Button
                onClick={() => handleEditClick(record.id)}
                className='border-none bg-transparent shadow-none hover:bg-transparent'
                {...buttonProps}
              >
                <Edit2 className='stroke-dodger-blue size-3.5' />
              </Button>
            </span>
          </ToolTip>
        </HasPermission>
      );
    },
    delete: (record: T, buttonProps?: Record<string, any>) => {
      if (!apiConfig.delete || !apiConfig.delete.permissionCode) return null;
      return (
        <HasPermission requiredPermissions={[apiConfig.delete.permissionCode]}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <span>
                <ToolTip title={`Xóa ${objectName}`}>
                  <Button
                    className='border-none bg-transparent shadow-none hover:bg-transparent'
                    {...buttonProps}
                  >
                    <Trash className='size-3.5 stroke-red-600' />
                  </Button>
                </ToolTip>
              </span>
            </AlertDialogTrigger>
            <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%] max-w-xl p-4'>
              <AlertDialogHeader>
                <AlertDialogTitle className='content flex flex-nowrap items-center gap-2 text-sm font-normal'>
                  <Info className='size-8 fill-orange-500 stroke-white' />
                  Bạn có chắc chắn muốn xóa {objectName} này không ?
                </AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button
                    variant='outline'
                    className='border-red-500 text-red-500 transition-all duration-200 ease-linear hover:bg-transparent hover:text-red-500/80'
                  >
                    Không
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteClick(record.id)}
                  className='bg-dodger-blue hover:bg-dodger-blue/80 cursor-pointer transition-all duration-200 ease-linear'
                >
                  Có
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </HasPermission>
      );
    }
  });

  const renderActionColumn = (options?: {
    actions?: Record<'edit' | 'delete' | string, ActionCondition<T>>;
    buttonProps?: Record<string, any>;
    columnProps?: Record<string, any>;
  }): Column<T> => {
    const extraColumns = handlers.additionalColumns?.() || {};
    const actionsObj: Record<
      string,
      (record: T, buttonProps?: any) => React.ReactNode
    > = { ...actionColumn(), ...extraColumns };

    return {
      title: 'Hành động',
      align: 'center' as const,
      width: 120,
      ...options?.columnProps,
      render: (_: any, record: T) => {
        if (!options?.actions) return null;

        const actions = Object.keys(options.actions)
          .filter((key) => {
            const condition = options.actions?.[key];
            if (typeof condition === 'function') return condition(record);
            return condition === true;
          })
          .map((key) => actionsObj[key]?.(record, options?.buttonProps))
          .filter(Boolean);

        return (
          <div className='flex items-center justify-center gap-2'>
            {actions.map((action, idx) => (
              <div key={idx} className='flex items-center'>
                {action}
                {idx < actions.length - 1 && (
                  <Separator
                    orientation='vertical'
                    className='-mr-2 !h-4 w-px bg-gray-200'
                  />
                )}
              </div>
            ))}
          </div>
        );
      }
    };
  };

  const renderStatusColumn = (options?: {
    statusOptions?: OptionType[];
    columnProps?: Record<string, any>;
  }): Column<T> => {
    return {
      title: 'Trạng thái',
      width: 150,
      dataIndex: 'status',
      align: 'center',
      ...options?.columnProps,
      render: (value) => {
        const status = (options?.statusOptions || defaultStatusOptions).find(
          (st) => st.value === value
        );
        return (
          <Badge
            className='text-sm font-normal'
            style={{ backgroundColor: status?.color }}
          >
            {status?.label}
          </Badge>
        );
      }
    };
  };

  const renderAddButton = () => {
    if (!apiConfig.create || !apiConfig.create.permissionCode) return null;
    let path = `${pathname}/create`;
    if (Object.keys(searchParams).length > 0)
      path = `${path}?${serializeParams(searchParams)}`;
    return (
      <HasPermission requiredPermissions={[apiConfig.create.permissionCode]}>
        <Link href={path}>
          <Button variant={'primary'}>
            <PlusIcon />
            Thêm mới
          </Button>
        </Link>
      </HasPermission>
    );
  };

  const renderSearchForm = ({
    searchFields,
    schema
  }: {
    searchFields: SearchFormProps<S>['searchFields'];
    schema: SearchFormProps<S>['schema'];
  }) => {
    // Set value for search fields
    const mergedValues = {
      ...queryFilter,
      ...Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => {
          const field = searchFields.find((f) => f.key === key);
          if (!field) return [key, value];

          switch (field.type) {
            case FieldTypes.NUMBER:
              return [key, value ? Number(value) : undefined];
            case FieldTypes.SELECT || FieldTypes.AUTOCOMPLETE:
              const option = field.options?.find(
                (opt: any) => String(opt.value) === String(value)
              );
              return [key, option ? option.value : value];
            default:
              return [key, value];
          }
        })
      )
    };

    // Handle search
    const handleSearchSubmit = (values: any) => {
      const preservedParams = Object.fromEntries(
        Object.entries(searchParams).filter(([key]) =>
          excludeFromQueryFilter.includes(key)
        )
      );

      setQueryParams({ ...values, ...preservedParams } as Partial<S>);
    };

    // Handle reset
    const handleSearchReset = () => {
      if (Object.keys(searchParams).length === 0) return;

      setPagination({
        current: DEFAULT_TABLE_PAGE_START + 1,
        pageSize: DEFAULT_TABLE_PAGE_SIZE,
        total: 0
      });

      const preservedParams = Object.fromEntries(
        Object.entries(searchParams).filter(([key]) =>
          excludeFromQueryFilter.includes(key)
        )
      );
      setQueryParams({ ...defaultFilters, ...preservedParams });
    };

    return (
      <SearchForm<S>
        initialValues={mergedValues}
        searchFields={searchFields}
        schema={schema}
        handleSearchSubmit={handleSearchSubmit}
        handleSearchReset={handleSearchReset}
      />
    );
  };

  const invalidateQueries = () =>
    queryClient.invalidateQueries({ queryKey: [`${queryKey}-list`] });

  const renderReloadButton = () => (
    <Button
      disabled={listQuery.isFetching}
      onClick={() => listQuery.refetch()}
      variant={'primary'}
    >
      <RefreshCcw />
    </Button>
  );

  const extendableHandlers = (): HandlerType<T, S> => {
    const handlers: HandlerType<T, S> = {
      changePagination,
      renderActionColumn,
      additionalParams,
      additionalPathParams,
      additionalColumns,
      renderAddButton,
      renderSearchForm,
      renderStatusColumn,
      setQueryParam,
      handleEditClick,
      handleDeleteClick,
      invalidateQueries,
      renderReloadButton
    };

    override?.(handlers);
    return handlers;
  };

  const handlers = extendableHandlers();

  return {
    data,
    pagination,
    loading:
      listQuery.isLoading || listQuery.isFetching || deleteMutation.isPending,
    handlers,
    queryFilter,
    listQuery,
    setData
  };
}
