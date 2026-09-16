import type { Meta, StoryObj } from '@storybook/react';
import { Div } from '../components/Div';

const meta: Meta<typeof Div> = {
  title: 'SnapUI/Div',
  component: Div,
};

export default meta;
export type Story = StoryObj<typeof Div>;

export const Default: Story = {};
