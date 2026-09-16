import type { Meta, StoryObj } from '@storybook/react';
import { H2 } from '../components/H2';

const meta: Meta<typeof H2> = {
  title: 'SnapUI/H2',
  component: H2,
};

export default meta;
export type Story = StoryObj<typeof H2>;

export const Default: Story = {};
