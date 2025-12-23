import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rulesApi } from "@/api";
import type { CreateRuleInput, UpdateRuleInput } from "@/db/types";

// Query Keys
export const ruleKeys = {
    all: ["rules"] as const,
    detail: (id: number) => ["rules", id] as const,
};

// Hooks
export function useRules() {
    return useQuery({
        queryKey: ruleKeys.all,
        queryFn: rulesApi.getAll,
    });
}

export function useRule(id: number) {
    return useQuery({
        queryKey: ruleKeys.detail(id),
        queryFn: () => rulesApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateRule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRuleInput) => rulesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ruleKeys.all });
        },
    });
}

export function useUpdateRule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateRuleInput }) =>
            rulesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ruleKeys.all });
        },
    });
}

export function useDeleteRule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => rulesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ruleKeys.all });
        },
    });
}

export function useBulkDeleteRules() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: number[]) => rulesApi.deleteBatch(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ruleKeys.all });
        },
    });
}

export function useDeleteGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (group: string) => rulesApi.deleteGroup(group),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ruleKeys.all });
        },
    });
}

