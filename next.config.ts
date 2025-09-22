import type { NextConfig } from 'next';
import createBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'api-book.moviehub.biz',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn1.fahasa.com',
        pathname: '/**'
      }
    ]
  }
};

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

export default withBundleAnalyzer(nextConfig);
