const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 根據 ENV_FILE 環境變數載入 .env 檔案
const envFile = process.env.ENV_FILE || '.env.local'; // 預設使用 .env.local
const envPath = path.resolve(__dirname, envFile);

if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envFile}`);
  dotenv.config({ path: envPath });
} else {
  console.warn(`Environment file ${envFile} not found.`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
    unoptimized: true
  },
};

module.exports = nextConfig;
