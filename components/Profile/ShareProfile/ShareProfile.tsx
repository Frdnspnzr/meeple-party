"use client";

import useBasePath from "@/hooks/useBasePath";
import { useTranslation } from "@/i18n/client";
import {
  ActionIcon,
  Button,
  Group,
  TextInput,
  Tooltip,
  Transition,
} from "@mantine/core";
import { IconCheck, IconCopy, IconShare2 } from "@tabler/icons-react";
import { useCallback, useRef, useState } from "react";

export interface ShareProfileProps {
  profileId: string;
  disableNative?: boolean;
}

export default function ShareProfile({
  profileId,
  disableNative = false,
}: Readonly<ShareProfileProps>) {
  const basePath = useBasePath();
  const { t } = useTranslation("profile");
  const [linkOpen, setLinkOpen] = useState(false);
  const url = `${basePath}/profile/${profileId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const share = useCallback(() => {
    const shareData: ShareData = {
      url,
    };
    if (!disableNative && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else {
      setLinkOpen(true);
    }
  }, [profileId]);
  const copy = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 999);
      navigator.clipboard.writeText(inputRef.current.value);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 800);
    }
  }, [inputRef]);
  return (
    <Group>
      {!linkOpen && (
        <Button variant="filled" onClick={share} leftSection={<IconShare2 />}>
          {t("Share")}
        </Button>
      )}
      <Transition mounted={linkOpen} transition="slide-right">
        {(style) => (
          <TextInput
            style={style}
            styles={{ input: { width: "35ch" } }}
            value={url}
            ref={inputRef}
            rightSection={
              <Tooltip label={success ? "Copied" : "Click to copy"}>
                <ActionIcon
                  radius="xs"
                  size="lg"
                  variant="subtle"
                  onClick={copy}
                >
                  {success ? <IconCheck /> : <IconCopy />}
                </ActionIcon>
              </Tooltip>
            }
          />
        )}
      </Transition>
    </Group>
  );
}
