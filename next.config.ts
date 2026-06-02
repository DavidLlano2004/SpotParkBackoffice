import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@heroui/react', 'lucide-react', 'recharts'],
  },
}

export default nextConfig
