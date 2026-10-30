import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const serverOnly = {
  group: ['@/server', '@/server/*'],
  message:
    'Kode di src/server hanya untuk server. Ambil datanya di halaman (server component) lalu teruskan sebagai props.',
};

const featuresFromComponents = {
  group: ['@/features', '@/features/*'],
  message: 'Komponen bersama tidak boleh bergantung pada fitur. Balik arah dependensinya.',
};

const config = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [serverOnly] }],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/hooks/**/*.{ts,tsx}', 'src/config/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [serverOnly, featuresFromComponents] }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default config;
