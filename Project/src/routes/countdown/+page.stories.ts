// ------- TIMER/COUNTDOWN STORIES -------

// src/routes/countdown/+page.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import CountdownPage from './+page.svelte';

const meta = {
  title: 'Pages/Timer',
  component: CountdownPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<CountdownPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    Component: CountdownPage,
  }),
};

export const CustomTime: Story = {
  render: () => ({
    Component: CountdownPage,
  }),
  play: async ({ canvas }) => {
    const minutesInput = canvas.querySelector('input[id="minutes"]') as HTMLInputElement;
    const secondsInput = canvas.querySelector('input[id="seconds"]') as HTMLInputElement;
    
    if (minutesInput && secondsInput) {
      minutesInput.value = '10';
      minutesInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      secondsInput.value = '30';
      secondsInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

export const TimerRunning: Story = {
  render: () => ({
    Component: CountdownPage,
  }),
  play: async ({ canvas }) => {
    // Set time first
    const minutesInput = canvas.querySelector('input[id="minutes"]') as HTMLInputElement;
    if (minutesInput) {
      minutesInput.value = '1';
      minutesInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Click start button
    const startBtn = canvas.querySelector('button:has-text("Start Timer")');
    if (startBtn) {
      (startBtn as HTMLElement).click();
    }
  },
};

export const TimerPaused: Story = {
  render: () => ({
    Component: CountdownPage,
  }),
  play: async ({ canvas }) => {
    // Set and start
    const minutesInput = canvas.querySelector('input[id="minutes"]') as HTMLInputElement;
    if (minutesInput) {
      minutesInput.value = '2';
      minutesInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    const startBtn = canvas.querySelector('button:has-text("Start Timer")');
    if (startBtn) {
      (startBtn as HTMLElement).click();
    }
    
    // Then pause
    await new Promise(resolve => setTimeout(resolve, 500));
    const pauseBtn = canvas.querySelector('button:has-text("Pause Timer")');
    if (pauseBtn) {
      (pauseBtn as HTMLElement).click();
    }
  },
};

export const MobileTimer: Story = {
  render: () => ({
    Component: CountdownPage,
  }),
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  },
};
