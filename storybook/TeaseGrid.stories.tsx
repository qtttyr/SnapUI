import type { Meta, StoryObj } from '@storybook/react';
import { TeaseGrid } from '../components/TeaseGrid';

const meta: Meta<typeof TeaseGrid> = {
  title: 'SnapUI/TeaseGrid',
  component: TeaseGrid,
};

export default meta;
export type Story = StoryObj<typeof TeaseGrid>;

export const Default: Story = {};
