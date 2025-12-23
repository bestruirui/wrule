export interface Rule {
    id: number;
    group_name: string;
    rule_type: string;
    content: string;
    created_at?: string;
}

export interface CreateRuleInput {
    group_name: string;
    rule_type: string;
    content: string;
}

export interface UpdateRuleInput {
    group_name: string;
    rule_type: string;
    content: string;
}


