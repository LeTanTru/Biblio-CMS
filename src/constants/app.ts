import envConfig from '@/config';

const apiUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT_URL;

const AppConstants = {
  apiUrl: `${apiUrl}/api/`,
  contentRootUrl: `${apiUrl}/api/v1/file/download`
};

export default AppConstants;
