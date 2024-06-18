import { ExpandedGame } from "@/datatypes/game";
import getQueryClient from "@/utility/queryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{ data: ExpandedGame[] }>;

const PrefetchedGameData: React.FC<Props> = ({ data, children }) => {
  const queryClient = getQueryClient();
  data.forEach((g) => {
    queryClient.setQueryData(["game", g.id], g);
  });
  const dehydratedState = dehydrate(queryClient);
  queryClient.clear();
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
};

export default PrefetchedGameData;
