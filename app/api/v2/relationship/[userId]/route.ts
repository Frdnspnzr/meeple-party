import { Relationship } from "@/datatypes/relationship";
import { prisma } from "@/db";
import { RelationshipType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getUser } from "../../authentication";
import { normalizeRelationship } from "../../utility";

interface RelationshipReadResult {
  normalizedRelationship: Relationship;
}

export type RelationshipGetResult = RelationshipReadResult;
export type RelationshipDeleteResult = RelationshipReadResult;
export type RelationshipPatchResult = RelationshipReadResult;
export type RelationshipPutResult = RelationshipReadResult;

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const user = await getUser();
  const targetUserId = params.userId;

  checkUserId(targetUserId);

  const normalizedRelationships = await findNormalizedRelationships(
    user.id,
    targetUserId
  );

  if (normalizedRelationships.length > 1) {
    return new Response("More than one relationship found", { status: 500 });
  } else if (!normalizedRelationships || normalizedRelationships.length === 0) {
    return new Response(
      `You don't have a relationship with user ${targetUserId}`,
      { status: 404 }
    );
  } else {
    return NextResponse.json({
      normalizedRelationship: normalizedRelationships[0],
    } as RelationshipGetResult);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const user = await getUser();
  const targetUserId = params.userId;

  checkUserId(targetUserId);

  const relationships = await findRelationships(user.id, targetUserId);

  if (relationships.length > 1) {
    return new Response("More than one relationship found", { status: 500 });
  } else if (relationships.length === 0) {
    return new Response(
      `You don't have a relationship with user ${targetUserId}`,
      { status: 404 }
    );
  } else {
    const targetRelationship = relationships[0];

    await prisma.relationship.delete({
      where: {
        senderId_recipientId: {
          recipientId: targetRelationship.recipientId,
          senderId: targetRelationship.senderId,
        },
      },
    });

    return NextResponse.json({
      normalizedRelationship: normalizeRelationship(
        targetRelationship,
        user.id
      ),
    } as RelationshipDeleteResult);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const user = await getUser();
  const targetUserId = params.userId;

  checkUserId(targetUserId);

  if (user.id === targetUserId) {
    return new Response("You can't be in a relationship with yourself!", {
      status: 500,
    });
  }

  const relationships = await findRelationships(user.id, targetUserId);

  if (relationships.length > 0) {
    return new Response("You already have a relationship!", { status: 500 });
  } else {
    const result = await prisma.relationship.create({
      data: {
        recipientId: targetUserId,
        senderId: user.id,
        type: RelationshipType.FRIEND_REQUEST,
      },
      include: { recipient: true, sender: true },
    });
    return NextResponse.json({
      normalizedRelationship: normalizeRelationship(result, user.id),
    } as RelationshipPatchResult);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const user = await getUser();
  const targetUserId = params.userId;

  checkUserId(targetUserId);

  const relationships = await findRelationships(user.id, targetUserId);

  if (relationships.length > 1) {
    return new Response("More than one relationship found", { status: 500 });
  } else if (relationships.length === 0) {
    return new Response(
      `You don't have a relationship with user ${targetUserId}`,
      { status: 404 }
    );
  } else {
    const relationship = relationships[0];

    if (relationship.senderId === user.id) {
      return new Response(
        "You can't accept friend requests you have sent yourself.",
        { status: 500 }
      );
    } else {
      const result = await prisma.relationship.update({
        where: {
          senderId_recipientId: {
            recipientId: relationship.recipientId,
            senderId: relationship.senderId,
          },
        },
        data: {
          type: RelationshipType.FRIENDSHIP,
        },
        include: { recipient: true, sender: true },
      });
      return NextResponse.json({
        normalizedRelationship: normalizeRelationship(result, user.id),
      } as RelationshipPatchResult);
    }
  }
}

function checkUserId(id: string) {
  if (id.length < 20 || id.length > 40) {
    throw new Error("User Profile ID format error");
  }
}

async function findRelationships(selfId: string, otherId: string) {
  return await prisma.relationship.findMany({
    where: {
      OR: [
        { recipientId: selfId, senderId: otherId },
        { recipientId: otherId, senderId: selfId },
      ],
    },
    include: {
      recipient: true,
      sender: true,
    },
  });
}

async function findNormalizedRelationships(selfId: string, otherId: string) {
  const relationships = await findRelationships(selfId, otherId);
  return relationships.map((r) => normalizeRelationship(r, selfId));
}
