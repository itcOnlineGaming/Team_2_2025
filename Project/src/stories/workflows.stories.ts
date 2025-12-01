// ------- INTEGRATION STORIES -------

// src/stories/workflows.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import Page from '../routes/+page.svelte';

const meta = {
  title: 'Workflows/TaskCompletion',
  component: Page,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateAndCompleteTask: Story = {
  render: () => ({
    Component: Page,
  }),
  play: async ({ canvas }) => {
    // Step 1: Click add task
    const addBtn = canvas.querySelector('button:has-text("+ Add Task")');
    if (addBtn) {
      (addBtn as HTMLElement).click();
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Step 2: Fill task title
    const titleInput = canvas.querySelector('input[placeholder="Enter task title..."]') as HTMLInputElement;
    if (titleInput) {
      titleInput.value = 'Example Task';
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Step 3: Save
    const saveBtn = canvas.querySelector('button:has-text("Save")');
    if (saveBtn) {
      (saveBtn as HTMLElement).click();
    }
  },
};

export const TimerWorkflow: Story = {
  render: () => ({
    Component: Page,
  }),
};

export const FullUserJourney: Story = {
  render: () => ({
    Component: Page,
  }),
};