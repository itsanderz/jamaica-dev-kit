import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "jamaica-gov-fees",
    "jamaica-trn",
    "jamaica-currency",
    "jamaica-holidays",
  ],
};

export default nextConfig;
