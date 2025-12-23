'use client';

import { FolderOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RuleItem } from './Item';
import type { Rule } from '@/db/types';

interface RuleListProps {
    rules: Rule[];
    selectionMode?: boolean;
    selectedIds?: Set<number>;
    onSelect?: (id: number, selected: boolean) => void;
}

export function RuleList({ rules, selectionMode = false, selectedIds, onSelect }: RuleListProps) {
    if (rules.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <FolderOpen className="h-5 w-5 mr-2" />
                <span className="text-sm">暂无规则</span>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full">
            <div className="space-y-2 pr-4 pb-4">
                {rules.map((rule) => (
                    <RuleItem
                        key={rule.id}
                        rule={rule}
                        selectionMode={selectionMode}
                        selected={selectedIds?.has(rule.id)}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </ScrollArea>
    );
}
