import type { Meta, StoryObj } from "@storybook/react";
import UserCard from "./UserCard";

const meta = {
  title: "Structures/User Card",
  component: UserCard,
  tags: ["autodocs"],
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullUserDetails: Story = {
  args: {
    user: {
      name: "Frdnspnzr",
      realName: "Pascal Greilach",
      bggName: "Friedenspanzer",
      about: "Help, this thing is keeping me from playing games.",
      id: "abc123",
      place: "Kaiserslautern",
      role: "ADMIN",
      image: null,
    },
  },
};

export const MinimalUserDetails: Story = {
  args: {
    user: {
      name: "Frdnspnzr",
      realName: null,
      bggName: null,
      about: null,
      id: "abc123",
      place: null,
      role: "USER",
      image: null,
    },
  },
};
