export const renderImageUrl = (url: string | undefined | null) => {
  if (!url) return '';
  return `/api/image-proxy?url=${url}`;
};
