import Avatar from "@/components/Avatar/Avatar";
import ProfileRealName from "@/components/Profile/RealName/ProfileRealName";
import ProfileUsername from "@/components/Profile/Username/ProfileUsername";
import { Relationship } from "@/datatypes/relationship";
import { Card, Group, Stack } from "@mantine/core";
import FriendRequestStatus from "../FriendRequestStatus/FriendRequestStatus";

interface Props {
  friendRequest: Relationship;
}

export default function FriendRequest({ friendRequest }: Readonly<Props>) {
  return (
    <Card shadow="md" radius="sm" padding="lg" withBorder>
      <Group justify="space-between">
        <Group>
          <Avatar
            name={friendRequest.profile.name || ""}
            image={friendRequest.profile.image}
          />
          <Stack gap="xs">
            <ProfileUsername>{friendRequest.profile.name}</ProfileUsername>
            {friendRequest.profile.realName && (
              <ProfileRealName>
                {friendRequest.profile.realName}
              </ProfileRealName>
            )}
          </Stack>
        </Group>
        <FriendRequestStatus userId={friendRequest.profile.id} />
      </Group>
    </Card>
  );
}
