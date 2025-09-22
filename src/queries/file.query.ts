import { fileApiRequest } from '@/api-requests';
import { useMutation } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: async ({
      file,
      options
    }: {
      file: Blob;
      options?: AxiosRequestConfig;
    }) => await fileApiRequest.uploadAvatar(file, options)
  });
};

export const useUploadImageProduct = () => {
  return useMutation({
    mutationFn: async ({
      file,
      options
    }: {
      file: Blob;
      options?: AxiosRequestConfig;
    }) => await fileApiRequest.uploadProductImage(file, options)
  });
};
