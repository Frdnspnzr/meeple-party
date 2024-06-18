import { Relationship, RelationshipType } from "@/datatypes/relationship";
import {
  UserPreferences,
  UserProfile,
  defaultUserPreferences,
} from "@/datatypes/userProfile";
import {
  Prisma,
  Relationship as PrismaRelationship,
  User,
} from "@prisma/client";

export type FullPrismaRelationship = PrismaRelationship & {
  sender: User;
  recipient: User;
};

export function convertToUserProfile(
  user: User,
  friend: boolean = false
): UserProfile {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    image: user.image,
    realName: allowRealName(user, friend) ? user.realName : null,
    about: user.about,
    place: allowPlace(user, friend) ? user.place : null,
    bggName: allowBggName(user, friend) ? user.bggName : null,
  };
}

export function normalizeRelationship(
  prismaRelationship: FullPrismaRelationship,
  userId: string
): Relationship {
  return {
    profile: getProfile(prismaRelationship, userId),
    type: getRelationshipType(prismaRelationship, userId),
    lastUpdate: prismaRelationship.updatedAt,
  };
}

function allowRealName(user: User, friend: boolean): boolean {
  if (friend) {
    return true;
  }
  const preferences = getPreferences(user);
  return preferences.showRealNameInProfile;
}

function allowPlace(user: User, friend: boolean): boolean {
  if (friend) {
    return true;
  }
  const preferences = getPreferences(user);
  return preferences.showPlaceInProfile;
}

function allowBggName(user: User, friend: boolean): boolean {
  return friend;
}

function getPreferences(user: User): UserPreferences {
  return {
    ...defaultUserPreferences,
    ...(user.preferences as Prisma.JsonObject),
  };
}

function getRelationshipType(
  relationship: FullPrismaRelationship,
  userId: string
): RelationshipType {
  if (relationship.type === "FRIENDSHIP") {
    return RelationshipType.FRIENDSHIP;
  } else if (relationship.type === "FRIEND_REQUEST") {
    if (relationship.sender.id === userId) {
      return RelationshipType.FRIEND_REQUEST_SENT;
    } else {
      return RelationshipType.FRIEND_REQUEST_RECEIVED;
    }
  }
  throw new Error("Error determining relationship type");
}

function getProfile(
  relationship: FullPrismaRelationship,
  userId: string
): UserProfile {
  const profile =
    relationship.recipientId === userId
      ? relationship.sender
      : relationship.recipient;
  return convertToUserProfile(profile, relationship.type === "FRIENDSHIP");
}

//TODO Document, test
export function getCronAuthToken() {
  if (!process.env.CRON_AUTH_TOKEN) {
    throw "No cron auth token configured for current environment";
  }
  return process.env.CRON_AUTH_TOKEN;
}
