import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  transpilePackages: ['jamaica-tax', 'jamaica-currency', 'jamaica-trn'],
};
export default nextConfig;
