import type { Meta, StoryObj } from "@storybook/react";
import ProfileHeader from "./ProfileHeader";

const meta = {
  title: "Structures/Profile header",
  component: ProfileHeader,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileHeader>;

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

export const MyOwnProfile: Story = {
  args: {
    user: {
      name: "Frdnspnzr",
      realName: "Pascal Greilach",
      bggName: "Friedenspanzer",
      about: "Help, this thing is keeping me from playing games.",
      id: "abc123",
      place: "Kaiserslautern",
      role: "FRIENDS_FAMILY",
      image: null,
    },
    myself: true,
  },
};

export const FriendProfile: Story = {
  args: {
    user: {
      name: "Frdnspnzr",
      realName: "Pascal Greilach",
      bggName: "Friedenspanzer",
      about: "Help, this thing is keeping me from playing games.",
      id: "abc123",
      place: "Kaiserslautern",
      role: "PREMIUM",
      image: null,
    },
    friend: true,
  },
};
