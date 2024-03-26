import type { Meta, StoryObj } from "@storybook/react";
import StatusButton from "./StatusButton";

const meta = {
  title: "Parts/StatusButton",
  component: StatusButton,
  tags: ["autodocs"],
} satisfies Meta<typeof StatusButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Own: Story = {
  args: {
    status: "own",
    active: true,
  },
};

export const WantToPlay: Story = {
  args: {
    status: "wanttoplay",
    active: true,
  },
};

export const Wishlist: Story = {
  args: {
    status: "wishlist",
    active: true,
  },
};

export const Loading: Story = {
  args: {
    status: "own",
    active: true,
    loading: true,
  },
};
