import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  transpilePackages: ['jamaica-parishes', 'jamaica-schools', 'jamaica-health', 'jamaica-emergency', 'jamaica-places', 'jamaica-banks'],
};
export default nextConfig;
