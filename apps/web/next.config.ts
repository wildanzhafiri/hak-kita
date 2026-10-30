import path from 'node:path';
import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@hakkita/schema', '@hakkita/domain'],
  outputFileTracingRoot: path.resolve(process.cwd(), '../..'),
};

export default config;
