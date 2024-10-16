import type { Meta, StoryObj } from "@storybook/react";

import ShareProfile from "./ShareProfile";

const meta = {
  title: "Parts/Share Profile",
  component: ShareProfile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShareProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profileId: "clnhj5o0n00002ct679u4mwd7",
  },
};

export const NoNativeSharing: Story = {
  args: {
    profileId: "clnhj5o0n00002ct679u4mwd7",
    disableNative: true,
  },
};
