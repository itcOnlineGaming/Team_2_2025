// ------- COMPONENT STORIES -------

// src/lib/components/UnifiedChecklist.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import UnifiedChecklist from './UnifiedChecklist.svelte';

const meta = {
  title: 'Components/UnifiedChecklist',
  component: UnifiedChecklist,
  tags: ['autodocs'],
} satisfies Meta<UnifiedChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    Component: UnifiedChecklist,
  }),
};

export const Expanded: Story = {
  render: () => ({
    Component: UnifiedChecklist,
  }),
  play: async ({ canvas }) => {
    const header = canvas.querySelector('.checklist-header');
    if (header) {
      (header as HTMLElement).click();
    }
  },
};

export const WithCompletedTasks: Story = {
  render: () => ({
    Component: UnifiedChecklist,
  }),
};

export const AllTasksCompleted: Story = {
  render: () => ({
    Component: UnifiedChecklist,
  }),
  decorators: [
    () => ({
      Component: UnifiedChecklist,
    }),
  ],
};