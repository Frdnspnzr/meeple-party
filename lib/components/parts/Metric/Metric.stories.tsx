import { Meta, StoryObj } from "@storybook/react/*";
import Metric from "./Metric";

const meta = {
  title: "Parts/Metric",
  component: Metric,
  tags: ["autodocs"],
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Metric",
    value: 3.14,
  },
};

export const StringValue: Story = {
  args: {
    label: "Metric",
    value: "Value",
  },
};

export const WithPrecission: Story = {
  args: {
    label: "Metric",
    value: 3.14159265,
    precision: 2,
  },
};
