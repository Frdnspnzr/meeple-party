"use client";

import { RelationshipType } from "@/datatypes/relationship";
import useRelationship from "@/hooks/api/useRelationship";
import { useTranslation } from "@/i18n/client";
import { Button, Group, Stack } from "@mantine/core";

interface Props {
  userId: string;
}

export default function FriendRequestStatus({ userId }: Readonly<Props>) {
  const { t } = useTranslation();
  const { t: ft } = useTranslation("friends");
  const {
    data: relationship,
    deleteMutation,
    acceptMutation,
    createMutation,
  } = useRelationship(userId);

  if (!relationship) {
    return (
      <Button
        onClick={() => createMutation.mutate()}
        loading={createMutation.isPending}
      >
        {ft("Actions.Send")}
      </Button>
    );
  } else if (relationship.type === RelationshipType.FRIEND_REQUEST_RECEIVED) {
    return (
      <Stack>
        <Group>
          <Button
            onClick={() => acceptMutation.mutate()}
            disabled={deleteMutation.isPending}
            loading={acceptMutation.isPending}
          >
            {t("Actions.Accept")}
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate()}
            disabled={acceptMutation.isPending}
            loading={deleteMutation.isPending}
          >
            {t("Actions.Deny")}
          </Button>
        </Group>
      </Stack>
    );
  } else if (relationship.type === RelationshipType.FRIEND_REQUEST_SENT) {
    return (
      <Button
        variant="danger"
        onClick={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      >
        {ft("Actions.Withdraw")}
      </Button>
    );
  } else if (relationship.type === RelationshipType.FRIENDSHIP) {
    return (
      <Button
        variant="danger"
        onClick={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      >
        {ft("Actions.Cancel")}
      </Button>
    );
  }
}
