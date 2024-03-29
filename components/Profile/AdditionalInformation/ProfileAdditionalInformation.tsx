import IconBoardGameGeek from "@/components/icons/BoardGameGeek/BoardGameGeek";
import { Flex, Group, Text, useMantineTheme } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";

export interface ProfileAdditionalInformationProps {
  bggName?: string;
  place?: string;
}

export function ProfileAdditionalInformation({
  bggName,
  place,
}: Readonly<ProfileAdditionalInformationProps>) {
  const theme = useMantineTheme();
  return (
    <Flex wrap="wrap" gap="md" justify="center">
      {place && (
        <Group gap="xs">
          <IconHome size={theme.fontSizes.md} />
          <Text>{place}</Text>
        </Group>
      )}
      {bggName && (
        <Group gap="xs">
          <IconBoardGameGeek height={theme.fontSizes.md} />
          <Text>{bggName}</Text>
        </Group>
      )}
    </Flex>
  );
}
