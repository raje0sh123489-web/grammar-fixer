import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure server-only packages are not bundled into client components
  serverExternalPackages: ['@google/genai', 'groq-sdk'],
};

export default nextConfig;
