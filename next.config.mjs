/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hsarrohafgtimvropvzm.supabase.co',
        port: '',
        pathname: '/**', // 모든 경로의 이미지를 허용한다는 뜻입니다.
      },
      
    ],
  },
  /* config options here */
};

export default nextConfig;
