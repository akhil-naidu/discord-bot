import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (config) => {
    config.externals.push('zlib-sync', 'ws', 'bufferutil', 'utf-8-validate') // Ensure compatibility
    return config
  },
}

export default withPayload(nextConfig)
