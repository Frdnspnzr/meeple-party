import { generateMetadata as appGenerateMetaData } from "@/app/app/profile/[profileId]/page";
import LoginButton from "@/components/Auth/LoginButton/LoginButton";
import LinkButton from "@/components/LinkButton/LinkButton";
import Logo from "@/components/Logo/Logo";
import UserCard from "@/components/Profile/UserCard/UserCard";
import { prisma } from "@/db";
import { getTranslation } from "@/i18n";
import { cleanUserDetails } from "@/pages/api/user";
import { isLoggedIn } from "@/utility/serverSession";
import { Center, Group, Stack, Text, Title } from "@mantine/core";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next/types";

export async function generateMetadata(params: {
  params: { profileId: string };
}): Promise<Metadata> {
  return appGenerateMetaData(params);
}

export default async function ProfilePage({
  params,
}: Readonly<{
  params: { profileId: string };
}>) {
  const { t } = await getTranslation("profile");
  if (await isLoggedIn()) {
    redirect(`/app/profile/${params.profileId}`);
  } else {
    const user = await getUser(params.profileId);
    if (!user?.profileComplete) {
      notFound();
    }
    return (
      <Center p="md">
        <Stack align="center">
          <Group>
            <Logo size="md" unstyled />
            <Title style={{ fontWeight: 300 }}>
              <Text inherit span fw={900}>
                {user.name}
              </Text>{" "}
              {t("Public.IsOn")}{" "}
              <Text
                inherit
                span
                fw={900}
                variant="gradient"
                gradient={{ from: "murple", to: "mink", deg: 120 }}
              >
                Meeple Party
              </Text>
            </Title>
          </Group>
          <UserCard user={user} />
          <Text>{t("Public.CallToAction")}</Text>
          <Group>
            <LoginButton redirectUrl={`/app/profile/${user.id}`} />
            <LinkButton href="/" variant="light">
              {t("Public.KnowMore")}
            </LinkButton>
          </Group>
        </Stack>
      </Center>
    );
  }
}

const getUser = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: { id },
  });

  if (userData) {
    return cleanUserDetails(userData);
  } else {
    return null;
  }
};
