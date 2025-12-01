
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.ts'],

  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-docs'
  ],

  framework: {
    name: '@storybook/sveltekit',
    options: {},
  }
};

export default config;