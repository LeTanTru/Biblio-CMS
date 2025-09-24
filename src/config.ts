import { logger } from '@/logger';
import { z } from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z.string(),
  NEXT_PUBLIC_API_ENDPOINT_URL: z.url(),
  NEXT_PUBLIC_TENANT_ID: z.string().min(1).max(100).optional(),
  NEXT_PUBLIC_URL: z.string().optional(),
  NEXT_PUBLIC_TINYMCE_URL: z.string().optional(),
  NEXT_PUBLIC_API_MEDIA_URL: z.string().optional()
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXT_PUBLIC_API_ENDPOINT_URL: process.env.NEXT_PUBLIC_API_ENDPOINT_URL,
  NEXT_PUBLIC_TENANT_ID: process.env.NEXT_PUBLIC_TENANT_ID,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_TINYMCE_URL: process.env.NEXT_PUBLIC_TINYMCE_URL,
  NEXT_PUBLIC_API_MEDIA_URL: process.env.NEXT_PUBLIC_API_MEDIA_URL
});

if (!configProject.success) {
  logger.error('Invalid environment variables:', configProject.error);
  throw new Error('Các khai báo biến môi trường không hợp lệ');
}

const envConfig = configProject.data;

export default envConfig;
