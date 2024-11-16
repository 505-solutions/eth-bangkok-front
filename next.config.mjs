import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/verifyPol', // API path in your Next.js app
        destination: 'http://0.0.0.0:5000/verifyPol', // Target backend server
      },
    ];
  },
});
