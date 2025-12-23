'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, Check } from 'lucide-react';
import { useDeleteRule } from '@/hooks/useRules';
import { Badge } from '@/components/ui/badge';
import type { Rule } from '@/db/types';

interface RuleItemProps {
    rule: Rule;
    selectionMode?: boolean;
    selected?: boolean;
    onSelect?: (id: number, selected: boolean) => void;
}

export function RuleItem({ rule, selectionMode = false, selected = false, onSelect }: RuleItemProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const deleteRule = useDeleteRule();

    const handleClick = () => {
        if (selectionMode && onSelect) {
            onSelect(rule.id, !selected);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`group relative flex items-center gap-3 p-3 rounded-xl overflow-hidden origin-top ${selectionMode ? 'cursor-pointer' : ''
                } ${selected
                    ? 'bg-primary/10 ring-1 ring-primary/30'
                    : 'bg-muted/40 hover:bg-muted/60'
                }`}
            onClick={selectionMode ? handleClick : undefined}
        >
            {selectionMode && (
                <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${selected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground/30 hover:border-muted-foreground/50'
                        }`}
                >
                    {selected && <Check className="h-3 w-3" />}
                </div>
            )}

            <Badge variant="outline" className="shrink-0 text-xs">
                {rule.rule_type}
            </Badge>
            <span className="flex-1 text-sm font-medium truncate">
                {rule.content}
            </span>

            {/* Keep a fixed-size action slot in the normal document flow so the item height
                stays the same in selection mode and when we switch to the absolute confirm overlay. */}
            <div className="h-8 w-8 shrink-0">
                {!selectionMode && !confirmDelete && (
                    <motion.button
                        layoutId={`delete-rule-${rule.id}`}
                        onClick={() => setConfirmDelete(true)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                        <Trash2 className="h-4 w-4" />
                    </motion.button>
                )}
            </div>

            <AnimatePresence>
                {!selectionMode && confirmDelete && (
                    <motion.div
                        layoutId={`delete-rule-${rule.id}`}
                        className="absolute inset-0 flex items-center justify-center gap-2 bg-destructive p-3 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive-foreground/20 text-destructive-foreground transition-all hover:bg-destructive-foreground/30 active:scale-95"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => deleteRule.mutate(rule.id)}
                            disabled={deleteRule.isPending}
                            className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-destructive-foreground text-destructive text-sm font-medium transition-all hover:bg-destructive-foreground/90 active:scale-[0.98] disabled:opacity-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deleteRule.isPending ? '...' : '确认'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
