'use client';

import { useState } from 'react';
import { Copy, Trash2, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useDeleteGroup } from '@/hooks/useRules';

interface GroupListProps {
    groups: string[];
    selectedGroup: string | null;
    onSelectGroup: (group: string) => void;
}

export function GroupList({ groups, selectedGroup, onSelectGroup }: GroupListProps) {
    const deleteGroup = useDeleteGroup();
    const [copiedGroup, setCopiedGroup] = useState<string | null>(null);
    const [confirmDeleteGroup, setConfirmDeleteGroup] = useState<string | null>(null);

    const subscribeToken = process.env.NEXT_PUBLIC_SUBSCRIBE_TOKEN || '';

    const copySubscribeLink = async (group: string) => {
        const origin = window.location.origin;
        const url = `${origin}/api/subscribe/${encodeURIComponent(subscribeToken)}/${encodeURIComponent(group)}`;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = url;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setCopiedGroup(group);
            setTimeout(() => setCopiedGroup((prev) => (prev === group ? null : prev)), 2000);
        } catch (err) {
            console.error('Failed to copy subscribe link:', err);
        }
    };

    return (
        <div className="space-y-1">
            {groups.map((group) => (
                <motion.div
                    key={group}
                    layout
                    className={`group relative flex items-center gap-2 rounded-xl transition-all ${selectedGroup === group
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <button
                        onClick={() => onSelectGroup(group)}
                        className="flex-1 min-w-0 text-left px-4 py-2.5 text-sm font-medium truncate"
                    >
                        {group}
                    </button>

                    {/* Keep fixed-size action slots so the row doesn't shift when confirm overlay appears */}
                    <div className="flex items-center gap-1 pr-2">
                        <div className="h-8 w-8 shrink-0">
                            <button
                                onClick={() => copySubscribeLink(group)}
                                disabled={!subscribeToken}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all active:scale-95 ${selectedGroup === group
                                    ? 'bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25'
                                    : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
                                    } disabled:opacity-50 disabled:pointer-events-none`}
                                title={subscribeToken ? '复制订阅链接' : '未配置 SUBSCRIBE_TOKEN'}
                            >
                                <AnimatePresence mode="wait">
                                    {copiedGroup === group ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Check className="h-4 w-4" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="copy"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>

                        <div className="h-8 w-8 shrink-0">
                            {!confirmDeleteGroup || confirmDeleteGroup !== group ? (
                                <motion.button
                                    layoutId={`delete-group-${group}`}
                                    onClick={() => setConfirmDeleteGroup(group)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${selectedGroup === group
                                        ? 'bg-destructive-foreground/15 text-primary-foreground hover:bg-destructive-foreground/25'
                                        : 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground'
                                        }`}
                                    title="删除分组"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </motion.button>
                            ) : null}
                        </div>
                    </div>

                    <AnimatePresence>
                        {confirmDeleteGroup === group && (
                            <motion.div
                                layoutId={`delete-group-${group}`}
                                className="absolute inset-0 flex items-center justify-center gap-2 bg-destructive p-3 rounded-xl"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            >
                                <button
                                    onClick={() => setConfirmDeleteGroup(null)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive-foreground/20 text-destructive-foreground transition-all hover:bg-destructive-foreground/30 active:scale-95"
                                    title="取消"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() =>
                                        deleteGroup.mutate(group, {
                                            onSuccess: () => {
                                                setConfirmDeleteGroup(null);
                                            },
                                        })
                                    }
                                    disabled={deleteGroup.isPending}
                                    className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg bg-destructive-foreground text-destructive text-sm font-medium transition-all hover:bg-destructive-foreground/90 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    {deleteGroup.isPending ? '...' : '确认'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
}

