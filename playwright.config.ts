import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    // Clear localStorage before each test via storageState reset
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Start the dev server with test env variables before running tests
  webServer: {
    command: 'npx vite --mode test',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
