import { defineConfig } from 'vitest/config';

const integrationVirtual = [
  'tests/integration/google-ai-mode-dom-keeper/src/index.tests.js',
  'tests/integration/google-ai-mode-dom-keeper/dist/js/index.tests.js'
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
          setupFiles: [ './vitest.setup.js' ],
          pool: 'forks',
          forksOptions: {
            isolate: true
          }
        }
      }
    ]
  }
});
