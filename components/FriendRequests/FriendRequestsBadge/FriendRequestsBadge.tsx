"use client";

import { RelationshipType } from "@/datatypes/relationship";
import useRelationships from "@/hooks/api/useRelationships";
import { useEffect, useState } from "react";

const FriendRequestsBadge: React.FC = () => {
  const { data: relationships } = useRelationships();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (relationships) {
      setCount(
        relationships?.filter(
          (r) => r.type === RelationshipType.FRIEND_REQUEST_RECEIVED
        ).length
      );
    }
  }, [relationships]);

  if (count > 0) {
    return (
      <span className="badge rounded-pill text-bg-secondary">{count}</span>
    );
  } else {
    return <></>;
  }
};

export default FriendRequestsBadge;
