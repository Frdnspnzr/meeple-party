"use client";

import { generateColors } from "@mantine/colors-generator";
import {
  VariantColorsResolver,
  createTheme,
  defaultVariantColorsResolver,
} from "@mantine/core";

const variantColorResolver: VariantColorsResolver = (input) => {
  if (input.variant === "danger") {
    return {
      background: "var(--mantine-color-red-9)",
      hover: "var(--mantine-color-red-8)",
      color: "var(--mantine-color-white)",
      border: "none",
    };
  }
  return defaultVariantColorsResolver(input);
};

export const theme = createTheme({
  colors: {
    murple: generateColors("hsl(269, 80%, 56%)"),
    mink: generateColors("rgb(238, 102, 217)"),
    gold: generateColors("rgb(255,215,0)"),
    darkgray: generateColors("rgba(99, 99, 99, 1)"),
  },
  primaryColor: "murple",
  primaryShade: 5,
  variantColorResolver,
});
