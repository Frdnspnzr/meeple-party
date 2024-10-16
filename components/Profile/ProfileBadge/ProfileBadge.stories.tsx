import type { Meta, StoryObj } from "@storybook/react";
import ProfileBadge from "./ProfileBadge";

const meta = {
  title: "Parts/Profile badge",
  component: ProfileBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  args: {
    type: "admin",
  },
};

export const FriendsAndFamily: Story = {
  args: {
    type: "family",
  },
};

export const Friend: Story = {
  args: {
    type: "friend",
  },
};

export const Me: Story = {
  args: {
    type: "me",
  },
};

export const Premium: Story = {
  args: {
    type: "premium",
  },
};

export const User: Story = {
  args: {
    type: "user",
  },
};
