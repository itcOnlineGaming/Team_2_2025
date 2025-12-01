// ------- FOREST/GROWTH STORIES -------

// src/routes/forest/+page.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import ForestPage from './+page.svelte';

const meta = {
  title: 'Pages/Forest',
  component: ForestPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<ForestPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    Component: ForestPage,
  }),
};

export const WithTrees: Story = {
  render: () => ({
    Component: ForestPage,
  }),
};

export const MobileForest: Story = {
  render: () => ({
    Component: ForestPage,
  }),
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  },
};
