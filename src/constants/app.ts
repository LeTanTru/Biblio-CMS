import envConfig from '@/config';

const apiUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT_URL;
const mediaUrl = envConfig.NEXT_PUBLIC_API_MEDIA_URL;
const socketUrl = envConfig.NEXT_PUBLIC_API_SOCKET;

const AppConstants = {
  apiUrl: `${apiUrl}/api/`,
  mediaUrl: `${mediaUrl}/api/`,
  contentRootUrl: `${mediaUrl}/api/v1/file/download`,
  socketUrl
};

export default AppConstants;
