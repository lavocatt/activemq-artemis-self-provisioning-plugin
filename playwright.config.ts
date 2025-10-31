import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,
  reporter: 'list',
  timeout: 360000,
  use: {
    baseURL: 'http://localhost:9000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
