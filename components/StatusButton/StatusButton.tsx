import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import StatusButtonStatic from "@/lib/components/parts/StatusButton/StatusButton";
import { useCallback, useMemo } from "react";

interface StatusButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  gameId: number;
  status: "own" | "wanttoplay" | "wishlist";
}

export default function StatusButton({
  status,
  gameId,
  ...props
}: Readonly<StatusButtonProps>) {
  const { data, isLoading, mutate } = useCollectionStatus(gameId);
  const active = useMemo(() => {
    if (!data) {
      return false;
    } else if (status === "own") {
      return data.own;
    } else if (status === "wishlist") {
      return data.wishlist;
    } else if (status === "wanttoplay") {
      return data.wantToPlay;
    }
  }, [data, status]);
  const updateStatus = useCallback(() => {
    if (!data) {
      return;
    } else if (status === "own") {
      mutate({ ...data, own: !data.own });
    } else if (status === "wanttoplay") {
      mutate({ ...data, wantToPlay: !data.wantToPlay });
    } else if (status === "wishlist") {
      mutate({ ...data, wishlist: !data.wishlist });
    }
  }, [status, mutate, data]);

  return (
    <StatusButtonStatic
      active={active || false}
      loading={isLoading}
      status={status}
      toggle={updateStatus}
      {...props}
    />
  );
}
