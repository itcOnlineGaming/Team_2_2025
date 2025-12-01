// ------- TASK BOARD STORIES -------

// src/routes/+page.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import Page from './+page.svelte';

const meta = {
  title: 'Pages/TaskBoard',
  component: Page,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    Component: Page,
  }),
};

export const WithTasks: Story = {
  render: () => ({
    Component: Page,
  }),
};

export const AddTaskModal: Story = {
  render: () => ({
    Component: Page,
  }),
  play: async ({ canvas }) => {
    // Click add task button
    const addBtn = canvas.querySelector('button:has-text("+ Add Task")');
    if (addBtn) {
      (addBtn as HTMLElement).click();
    }
  },
};

export const TaskCompleted: Story = {
  render: () => ({
    Component: Page,
  }),
  decorators: [
    () => ({
      Component: Page,
    }),
  ],
  play: async ({ canvas }) => {
    // Find and toggle a task as complete
    const checkbox = canvas.querySelector('input[type="checkbox"]');
    if (checkbox) {
      (checkbox as HTMLInputElement).checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
};

export const MobileLayout: Story = {
  render: () => ({
    Component: Page,
  }),
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  },
};

export const TabletLayout: Story = {
  render: () => ({
    Component: Page,
  }),
  globals: {
    viewport: {
      value: 'tablet',
      isRotated: false
    }
  },
};