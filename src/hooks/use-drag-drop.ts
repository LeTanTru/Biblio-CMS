'use client';

import { logger } from '@/logger';
import { ApiConfig, ApiResponse } from '@/types';
import { http, notify } from '@/utils';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

const sortColumn = {
  title: '',
  key: 'sort',
  width: 50
};

const useDragDrop = <T extends Record<string, any>>({
  key,
  objectName,
  data,
  apiConfig,
  sortField = 'ordering'
}: {
  key: string;
  objectName: string;
  data: T[];
  apiConfig: ApiConfig;
  sortField?: keyof T;
}) => {
  const queryClient = useQueryClient();
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [draggedData, setDraggedData] = useState<T[]>([]);

  const updateOrderingMutation = useMutation({
    mutationKey: ['updateOrdering', apiConfig.baseUrl],
    mutationFn: (body: any) =>
      http.put<ApiResponse<any>>(apiConfig, {
        body
      })
  });

  const sortedData = useMemo(() => {
    if (draggedData.length > 0) {
      return draggedData;
    }

    if (!data || data.length === 0) return [];

    return [...data].sort((a, b) => {
      const aValue = a[sortField] as number;
      const bValue = b[sortField] as number;
      return aValue - bValue;
    });
  }, [data, sortField, draggedData]);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active || !over || active.id === over.id) return;

      const currentData = sortedData;

      const activeIndex = currentData.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = currentData.findIndex((item) => item.id === over.id);

      if (activeIndex === -1 || overIndex === -1) return;

      const newData = arrayMove(currentData, activeIndex, overIndex);
      setDraggedData(newData);
      setIsChanged(true);
    },
    [sortedData]
  );

  const handleUpdate = useCallback(async () => {
    if (!isChanged || draggedData.length === 0) return;

    const dataUpdate = draggedData.map((item, index) => ({
      id: item.id,
      [sortField]: index
    }));

    await updateOrderingMutation.mutateAsync(dataUpdate, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [key]
        });
        setIsChanged(false);

        notify.success(`Cập nhật thứ tự ${objectName} thành công`);
      },
      onError: (error) => {
        logger.error('Error while updating ordering:', error);
        notify.error(`Cập nhật thứ tự ${objectName} thất bại`);

        setIsChanged(false);
        setDraggedData([]);
      }
    });
  }, [
    draggedData,
    isChanged,
    key,
    objectName,
    queryClient,
    sortField,
    updateOrderingMutation
  ]);

  return {
    isChanged,
    setIsChanged,
    sortedData,
    onDragEnd,
    handleUpdate,
    loading: updateOrderingMutation.isPending,
    sortColumn
  };
};

export default useDragDrop;
