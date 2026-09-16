import type { Meta, StoryObj } from '@storybook/react';
import { Test } from '../components/Test';

const meta: Meta<typeof Test> = {
  title: 'SnapUI/Test',
  component: Test,
};

export default meta;
export type Story = StoryObj<typeof Test>;

export const Default: Story = {};
