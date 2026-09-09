import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'http', hostname: 'titan.test' }],
  },
  // /api/seed reads this at runtime, so it must ship with the deployment.
  outputFileTracingIncludes: {
    '/api/seed': ['./scripts/wp-export.json'],
  },
}

export default withPayload(nextConfig)
