import { defineConfig } from 'vitest/config';

const integrationVirtual = [
  'tests/integration/google-ai-mode-dom-keeper/src/index.tests.js'
];

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'node-core',
          environment: 'node',
          include: [ '**/*.tests.js' ],
          exclude: integrationVirtual
        }
      },
      {
        test: {
          name: 'integration-virtual',
          environment: 'jsdom',
          include: integrationVirtual,
          pool: 'forks',
          forksOptions: {
            isolate: true
          }
        }
      }
    ]
  }
});
