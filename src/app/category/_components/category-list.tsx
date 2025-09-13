'use client';

import {
  AvatarField,
  Button,
  Col,
  InputField,
  Row,
  ToolTip
} from '@/components/form';
import { BaseForm } from '@/components/form/base-form';
import { HasPermission } from '@/components/has-permission';
import { PageWrapper } from '@/components/layout';
import ListPageWrapper from '@/components/layout/list-page-wrapper';
import { CircleLoading } from '@/components/loading';
import { DragDropTable } from '@/components/table';
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
import { Separator } from '@/components/ui/separator';
import {
  apiConfig,
  DEFAULT_TABLE_PAGE_START,
  MAX_PAGE_SIZE,
  statusOptions
} from '@/constants';
import { useDragDrop, useNavigate, useQueryParams } from '@/hooks';
import { cn } from '@/lib';
import { useCategoryListQuery, useDeleteCategoryMutation } from '@/queries';
import route from '@/routes';
import { categorySearchParamSchema } from '@/schemaValidations';
import { CategoryResType, CategorySearchParamType, Column } from '@/types';
import { renderImageUrl } from '@/utils';
import {
  BrushCleaning,
  Edit2,
  Info,
  PlusIcon,
  Save,
  Search,
  Trash
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

export default function CategoryList() {
  const navigate = useNavigate();
  const [queryFilter, setQueryFilter] = useState<CategorySearchParamType>({
    page: DEFAULT_TABLE_PAGE_START,
    size: MAX_PAGE_SIZE
  });
  const { searchParams, setQueryParams } =
    useQueryParams<CategorySearchParamType>();
  const categoryListQuery = useCategoryListQuery(queryFilter);
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const handleEdit = (id: string) => {
    navigate(`${route.category.getList.path}/${id}`);
  };

  const handleDelete = async (record: CategoryResType) => {
    deleteCategoryMutation.mutateAsync(record.id);
  };

  const {
    sortColumn,
    loading,
    sortedData,
    isChanged,
    onDragEnd,
    handleUpdate
  } = useDragDrop<CategoryResType>({
    key: 'category-list',
    objectName: 'danh mục',
    data: categoryListQuery.data?.data.content || [],
    apiConfig: apiConfig.category.updateOrdering,
    sortField: 'ordering'
  });

  const columns: Column<CategoryResType>[] = [
    ...(sortedData.length > 1 ? [sortColumn] : []),
    {
      title: '#',
      dataIndex: 'imageUrl',
      width: 80,
      align: 'center',
      render: (value) => {
        return (
          <AvatarField
            size={50}
            className={cn('mx-auto', {
              rounded: value
            })}
            previewClassName='rounded'
            disablePreview={!value}
            src={renderImageUrl(value)}
          />
        );
      }
    },
    {
      title: 'Tên',
      dataIndex: 'name'
    },
    {
      title: 'Trạng thái',
      width: 150,
      dataIndex: 'status',
      align: 'center',
      render: (value) => {
        const status = statusOptions.find((st) => st.value === value);
        return (
          <Badge
            className='text-sm font-normal'
            style={{ backgroundColor: status?.color }}
          >
            {status?.label}
          </Badge>
        );
      }
    },
    {
      title: 'Hành động',
      align: 'center',
      width: 120,
      render: (_, record) => {
        return (
          <div className='flex items-center justify-center'>
            <HasPermission
              requiredPermissions={[apiConfig.category.update.permissionCode]}
            >
              <ToolTip title='Sửa danh mục'>
                <Button
                  onClick={() => handleEdit(record.id)}
                  className='border-none bg-transparent shadow-none hover:bg-transparent'
                >
                  <Edit2 className='stroke-dodger-blue size-3.5' />
                </Button>
              </ToolTip>
              <Separator orientation='vertical' className='h-4! bg-gray-200' />
            </HasPermission>
            <HasPermission
              requiredPermissions={[apiConfig.category.delete.permissionCode]}
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <span>
                    <ToolTip title='Xóa danh mục'>
                      <Button className='border-none bg-transparent shadow-none hover:bg-transparent'>
                        <Trash className='size-3.5 stroke-red-600' />
                      </Button>
                    </ToolTip>
                  </span>
                </AlertDialogTrigger>
                <AlertDialogContent className='data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-0! data-[state=closed]:slide-out-to-top-0! data-[state=open]:slide-in-from-left-0! data-[state=open]:slide-in-from-top-0! top-[30%]'>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-md flex items-center gap-2 font-normal'>
                      <Info className='size-8 fill-orange-500 stroke-white' />
                      Bạn có chắc chắn muốn xóa danh mục này không ?
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
                    <AlertDialogAction asChild>
                      <Button
                        onClick={() => handleDelete(record)}
                        className='bg-dodger-blue hover:bg-dodger-blue/80 cursor-pointer transition-all duration-200 ease-linear'
                      >
                        Có
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </HasPermission>
          </div>
        );
      }
    }
  ];

  const defaultValues: CategorySearchParamType = {
    name: ''
  };

  const initialValues = useMemo(() => Object.fromEntries(searchParams), []);

  const onSubmit = async (values: CategorySearchParamType) => {
    const filtered = Object.entries(values).filter(
      ([, value]) =>
        value !== null && value !== undefined && value.toString().trim() !== ''
    );
    setQueryFilter({ ...queryFilter, ...Object.fromEntries(filtered) });
    setQueryParams({ ...searchParams, ...Object.fromEntries(filtered) });
  };

  const handleReset = (form: UseFormReturn<CategorySearchParamType>) => {
    form.reset();
    setQueryFilter({
      page: DEFAULT_TABLE_PAGE_START,
      size: MAX_PAGE_SIZE
    });
    setQueryParams({});
  };

  return (
    <PageWrapper
      breadcrumbs={[
        { label: 'Trang chủ', href: route.home.path },
        { label: 'Danh mục' }
      ]}
    >
      <ListPageWrapper
        actionBar={
          <HasPermission
            requiredPermissions={[apiConfig.category.create.permissionCode]}
          >
            <Link href={`${route.category.getList.path}/create`}>
              <Button className='bg-dodger-blue hover:bg-dodger-blue/80 font-normal'>
                <PlusIcon />
                Thêm mới
              </Button>
            </Link>
          </HasPermission>
        }
        searchForm={
          <BaseForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            schema={categorySearchParamSchema}
            initialValues={initialValues}
          >
            {(form) => (
              <>
                <Row className='gap-2'>
                  <Col span={4}>
                    <InputField
                      control={form.control}
                      name='name'
                      placeholder='Tên danh mục'
                      className='focus-visible:ring-dodger-blue'
                    />
                  </Col>
                  <Col className='w-9'>
                    <Button
                      type='submit'
                      className='bg-dodger-blue hover:bg-dodger-blue/80'
                    >
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
        }
      >
        <DragDropTable
          columns={columns}
          dataSource={sortedData}
          loading={
            categoryListQuery.isLoading ||
            categoryListQuery.isFetching ||
            deleteCategoryMutation.isPending
          }
          onDragEnd={onDragEnd}
        />
        {sortedData.length > 1 &&
          !(
            categoryListQuery.isLoading ||
            categoryListQuery.isFetching ||
            deleteCategoryMutation.isPending
          ) && (
            <div className='mr-4 flex justify-end py-4'>
              <Button
                onClick={handleUpdate}
                disabled={!isChanged || loading}
                className='bg-dodger-blue hover:bg-dodger-blue/80 w-40 disabled:pointer-events-auto disabled:cursor-not-allowed'
              >
                {loading ? (
                  <CircleLoading />
                ) : (
                  <>
                    <Save />
                    Cập nhật
                  </>
                )}
              </Button>
            </div>
          )}
      </ListPageWrapper>
    </PageWrapper>
  );
}
