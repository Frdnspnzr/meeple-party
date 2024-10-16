"use client";

import { useTranslation } from "@/i18n/client";
import { Badge, rem } from "@mantine/core";
import {
  IconCodeCircle2,
  IconFriends,
  IconHeart,
  IconStar,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";

type ProfileBadgeType =
  | "admin"
  | "premium"
  | "user"
  | "family"
  | "me"
  | "friend";
export interface ProfileBadgeProps {
  type: ProfileBadgeType;
}

interface ProfileBadgeDefinition {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const iconStyles = { width: rem(16), height: rem(16) };

const typeMap = new Map<ProfileBadgeType, ProfileBadgeDefinition>();
typeMap.set("admin", {
  label: "Badges.Admin",
  icon: <IconCodeCircle2 style={iconStyles} />,
  color: "murple",
});
typeMap.set("family", {
  label: "Badges.FriendsFamily",
  icon: <IconHeart style={iconStyles} />,
  color: "mink",
});
typeMap.set("me", {
  label: "Badges.You",
  icon: <IconUserCheck style={iconStyles} />,
  color: "gray",
});
typeMap.set("friend", {
  label: "Badges.Friend",
  icon: <IconFriends style={iconStyles} />,
  color: "cyan",
});
typeMap.set("premium", {
  label: "Badges.Premium",
  icon: <IconStar style={iconStyles} />,
  color: "gold",
});
typeMap.set("user", {
  label: "Badges.User",
  icon: <IconUser style={iconStyles} />,
  color: "darkgray",
});

export default function ProfileBadge({ type }: Readonly<ProfileBadgeProps>) {
  const { t } = useTranslation("profile");
  const definition = typeMap.get(type);
  if (!definition) {
    return "Error";
  }
  return (
    <Badge color={definition.color} leftSection={definition.icon} radius="sm">
      {t(definition.label)}
    </Badge>
  );
}
