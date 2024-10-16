import { UseMutationResult } from "@tanstack/react-query";

export interface Result<T> {
  isLoading: boolean;
  isError: boolean;
  data: T | undefined | null;
  invalidate: () => void;
}

export interface MutableResult<T> extends Result<T> {
  mutate: (data: Partial<T>, configuration?: MutationConfiguration) => void;
}

export interface DeleteableResult<T> extends Result<T> {
  deleteMutation: UseMutationResult<T, Error, void, unknown>;
}

export interface MutationConfiguration {}
