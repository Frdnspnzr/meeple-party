"use client";

import FriendRequest from "@/components/FriendRequests/FriendRequest/FriendRequest";
import { RelationshipType } from "@/datatypes/relationship";
import useRelationships from "@/hooks/api/useRelationships";
import { useTranslation } from "@/i18n/client";
import { Container, Stack, Title } from "@mantine/core";

const FriendRequests: React.FC = () => {
  const { isLoading, data: relationships } = useRelationships();
  const { t } = useTranslation("friends");

  const incoming =
    relationships?.filter(
      (r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED
    ) || [];
  const sent =
    relationships?.filter(
      (r) => r.type === RelationshipType.FRIEND_REQUEST_SENT
    ) || [];

  return (
    <Container size="sm">
      <Stack>
        {incoming.length > 0 && (
          <Stack>
            <Title order={2}>{t("Requests.Incoming")}</Title>
            {incoming.map((r) => (
              <FriendRequest friendRequest={r} key={r.profile.id} />
            ))}
          </Stack>
        )}
        {sent.length > 0 && (
          <Stack>
            <Title order={2}>{t("Requests.Outgoing")}</Title>
            {sent.map((r) => (
              <FriendRequest friendRequest={r} key={r.profile.id} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default FriendRequests;
