import { fileApiRequest } from '@/api-requests';
import { useMutation } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async ({
      file,
      options
    }: {
      file: Blob;
      options?: AxiosRequestConfig;
    }) => await fileApiRequest.image(file, options)
  });
};
