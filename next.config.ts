// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactCompiler: true,
//   output: "export",
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true, // IMPORTANT for Apache to serve /…/index.html
 
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  
};

module.exports = { ...nextConfig };