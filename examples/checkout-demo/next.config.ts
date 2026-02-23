import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  transpilePackages: ['jamaica-currency', 'jamaica-addresses', 'jamaica-parishes', 'jamaica-phone'],
};
export default nextConfig;
