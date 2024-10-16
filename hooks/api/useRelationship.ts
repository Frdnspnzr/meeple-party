import {
  RelationshipDeleteResult,
  RelationshipGetResult,
  RelationshipPatchResult,
  RelationshipPutResult,
} from "@/app/api/v2/relationship/[userId]/route";
import { Relationship } from "@/datatypes/relationship";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { DeleteableResult } from "./types";
import useRelationships from "./useRelationships";

interface Result<T> extends DeleteableResult<T> {
  acceptMutation: UseMutationResult<T, Error, void, unknown>;
  createMutation: UseMutationResult<T, Error, void, unknown>;
}

export default function useRelationship(userId: string): Result<Relationship> {
  const { invalidate: invalidateRelationships } = useRelationships();
  const queryKey = ["relationship", userId];
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => {
      return axios
        .get<RelationshipGetResult>(`/api/v2/relationship/${userId}`, {
          validateStatus: (status) => {
            return (status >= 200 && status < 300) || status === 404;
          },
        })
        .then((response) => {
          if (response.status === 404) {
            return null;
          } else {
            return response.data.normalizedRelationship;
          }
        });
    },
  });

  const deleteMutation = useMutation<Relationship>({
    mutationKey: queryKey,
    mutationFn: () => {
      return axios
        .delete<RelationshipDeleteResult>(`/api/v2/relationship/${userId}`)
        .then((response) => response.data.normalizedRelationship);
    },
    onSettled: () => {
      queryClient.removeQueries({ queryKey });
      invalidateRelationships();
    },
  });

  const acceptMutation = useMutation<Relationship>({
    mutationKey: queryKey,
    mutationFn: () => {
      return axios
        .patch<RelationshipPatchResult>(`/api/v2/relationship/${userId}`)
        .then((response) => response.data.normalizedRelationship);
    },
    onSettled: (data) => {
      queryClient.setQueryData(queryKey, data);
      invalidateRelationships();
    },
  });

  const createMutation = useMutation<Relationship>({
    mutationKey: queryKey,
    mutationFn: () => {
      return axios
        .put<RelationshipPutResult>(`/api/v2/relationship/${userId}`)
        .then((response) => response.data.normalizedRelationship);
    },
    onSettled: (data) => {
      queryClient.setQueryData(queryKey, data);
      invalidateRelationships();
    },
  });

  return {
    isLoading,
    isError,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
      queryClient.invalidateQueries({ queryKey });
    },
    deleteMutation,
    acceptMutation,
    createMutation,
  };
}
