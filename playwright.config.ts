import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: 'tests/e2e',
    timeout: 30_000,
    use: {
        baseURL: process.env.PW_BASE_URL || 'http://127.0.0.1:8001',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'pnpm dev',
        url: process.env.FRONTEND_BASE_URL || 'http://127.0.0.1:3000',
        reuseExistingServer: true,
        timeout: 120_000,
    },
})
