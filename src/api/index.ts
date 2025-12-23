import type { Rule, CreateRuleInput, UpdateRuleInput } from "@/db/types";

const API_BASE = "/api";

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Request failed" })) as { error?: string };
        throw new Error(error.error || "Request failed");
    }
    return res.json();
}

// Rules API
export const rulesApi = {
    getAll: async (): Promise<Rule[]> => {
        const res = await fetch(`${API_BASE}/rules`);
        return handleResponse<Rule[]>(res);
    },

    getById: async (id: number): Promise<Rule> => {
        const res = await fetch(`${API_BASE}/rules/${id}`);
        return handleResponse<Rule>(res);
    },

    create: async (data: CreateRuleInput): Promise<{ success: boolean; id: number }> => {
        const res = await fetch(`${API_BASE}/rules`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    update: async (id: number, data: UpdateRuleInput): Promise<{ success: boolean }> => {
        const res = await fetch(`${API_BASE}/rules/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

    delete: async (id: number): Promise<{ success: boolean }> => {
        const res = await fetch(`${API_BASE}/rules/${id}`, { method: "DELETE" });
        return handleResponse(res);
    },

    deleteBatch: async (ids: number[]): Promise<{ success: boolean; deleted: number }> => {
        const res = await fetch(`${API_BASE}/rules/batch`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        });
        return handleResponse(res);
    },

    deleteGroup: async (group: string): Promise<{ success: boolean; deleted: number }> => {
        const res = await fetch(`${API_BASE}/rules?group=${encodeURIComponent(group)}`, {
            method: "DELETE",
        });
        return handleResponse(res);
    },
};

// Auth API
export const authApi = {
    login: async (password: string): Promise<{ success: boolean }> => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        return handleResponse(res);
    },

    logout: async (): Promise<{ success: boolean }> => {
        const res = await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
        return handleResponse(res);
    },

    check: async (): Promise<{ authenticated: boolean }> => {
        const res = await fetch(`${API_BASE}/auth/check`);
        return handleResponse(res);
    },
};

