import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./client";

export type Rule = {
	id: number;
	group_name: string;
	rule_type: string;
	content: string;
};

export type RuleInput = {
	group_name: string;
	rule_type: string;
	content: string;
};

export function useRulesQuery() {
	return useQuery({
		queryKey: ["rules", "list"] as const,
		queryFn: async ({ signal }) => (await apiRequest<{ items: Rule[] }>("/api/rules", { signal })).items,
		refetchOnMount: "always",
	});
}

export function useRuleQuery(id: number | null | undefined) {
	return useQuery({
		queryKey: ["rules", "detail", id || 0] as const,
		queryFn: async ({ signal }) => (await apiRequest<{ item: Rule }>(`/api/rules/${id}`, { signal })).item,
		enabled: Boolean(id),
	});
}

export function useCreateRuleMutation() {
	return useMutation({
		mutationFn: async (body: RuleInput) =>
			(await apiRequest<{ item: Rule }>("/api/rules", {
				method: "POST",
				body,
			})).item,
		onSuccess: (item) => {
			queryClient.setQueryData(["rules", "detail", item.id] as const, item);
			queryClient.setQueryData(["rules", "list"] as const, (previous: Rule[] | undefined) =>
				[...(previous || []), item].sort((left, right) => left.id - right.id),
			);
		},
	});
}

export function useUpdateRuleMutation() {
	return useMutation({
		mutationFn: async ({ id, body }: { id: number; body: RuleInput }) =>
			(await apiRequest<{ item: Rule }>(`/api/rules/${id}`, {
				method: "PUT",
				body,
			})).item,
		onSuccess: (item) => {
			queryClient.setQueryData(["rules", "detail", item.id] as const, item);
			queryClient.setQueryData(["rules", "list"] as const, (previous: Rule[] | undefined) => {
				const merged = new Map(previous?.map((current) => [current.id, current] as const));
				merged.set(item.id, item);
				return [...merged.values()].sort((left, right) => left.id - right.id);
			});
		},
	});
}

export function useDeleteRuleMutation() {
	return useMutation({
		mutationFn: ({ id }: { id: number }) =>
			apiRequest<{ ok: true; deleted_id: number }>(`/api/rules/${id}`, { method: "DELETE" }),
		onSuccess: ({ deleted_id }) => {
			queryClient.removeQueries({ queryKey: ["rules", "detail", deleted_id] as const });
			queryClient.setQueryData(["rules", "list"] as const, (previous: Rule[] | undefined) =>
				previous?.filter((item) => item.id !== deleted_id),
			);
		},
	});
}

export function useDeleteRulesByGroupMutation() {
	return useMutation({
		mutationFn: ({ group_name }: { group_name: string }) =>
			apiRequest<{ ok: true; deleted_group_name: string }>(`/api/rules/group/${encodeURIComponent(group_name)}`, {
				method: "DELETE",
			}),
		onSuccess: ({ deleted_group_name }) => {
			for (const item of queryClient.getQueryData<Rule[]>(["rules", "list"] as const) || []) {
				if (item.group_name === deleted_group_name) queryClient.removeQueries({ queryKey: ["rules", "detail", item.id] as const });
			}
			queryClient.setQueryData(["rules", "list"] as const, (previous: Rule[] | undefined) =>
				previous?.filter((item) => item.group_name !== deleted_group_name),
			);
		},
	});
}
