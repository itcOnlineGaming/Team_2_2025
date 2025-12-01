// ------- CALENDAR STORIES -------

// src/routes/calender/+page.stories.ts
import type { Meta, StoryObj } from '@storybook/svelte';
import CalendarPage from './+page.svelte';

const meta = {
  title: 'Pages/Calendar',
  component: CalendarPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<CalendarPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    Component: CalendarPage,
  }),
};

export const MonthlyView: Story = {
  render: () => ({
    Component: CalendarPage,
  }),
};

export const WeeklyView: Story = {
  render: () => ({
    Component: CalendarPage,
  }),
  play: async ({ canvas }) => {
    // Click toggle to switch to weekly
    const toggleBtn = canvas.querySelector('button:has-text("Monthly View")');
    if (toggleBtn) {
      (toggleBtn as HTMLElement).click();
    }
  },
};

export const AddEventModal: Story = {
  render: () => ({
    Component: CalendarPage,
  }),
  play: async ({ canvas }) => {
    // Click first + button to add event
    const addBtn = canvas.querySelector('button:has-text("+")');
    if (addBtn) {
      (addBtn as HTMLElement).click();
    }
  },
};

export const PieChartView: Story = {
  render: () => ({
    Component: CalendarPage,
  }),
};

export const BarGraphView: Story = {
  render: () => ({
    Component: CalendarPage,
  }),
  play: async ({ canvas }) => {
    // Find and click the chart select
    const selects = canvas.querySelectorAll('select');
    if (selects.length > 0) {
      const chartSelect = selects[selects.length - 1] as HTMLSelectElement;
      chartSelect.value = 'bar';
      chartSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
};

export const MobileCalendar: Story = {
  render: () => ({
    Component: CalendarPage,
  }),
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  },
};
