import type { Meta, StoryObj } from '@storybook/react';
import { IconList } from '../components/IconList';

const meta: Meta<typeof IconList> = {
  title: 'SnapUI/IconList',
  component: IconList,
};

export default meta;
export type Story = StoryObj<typeof IconList>;

export const Default: Story = {};
