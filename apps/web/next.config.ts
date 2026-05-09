import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: [
    '@nabodata/api-client',
    '@nabodata/i18n',
    '@nabodata/store',
    '@nabodata/types',
    '@nabodata/ui',
  ],
  turbopack: {},
};

export default nextConfig;
