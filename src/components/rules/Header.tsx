'use client';

import { CheckSquare, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface RuleListHeaderProps {
    groupName: string;
    totalCount: number;
    selectionMode: boolean;
    selectedCount: number;
    allSelected: boolean;
    onEnterSelectionMode: () => void;
    onExitSelectionMode: () => void;
    onSelectAll: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}

export function RuleListHeader({
    groupName,
    totalCount,
    selectionMode,
    selectedCount,
    allSelected,
    onEnterSelectionMode,
    onExitSelectionMode,
    onSelectAll,
    onDelete,
    isDeleting
}: RuleListHeaderProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Reset local confirm state when exiting selection mode
    if (!selectionMode && confirmDelete) {
        setConfirmDelete(false);
    }

    return (
        <div className="flex items-center gap-2 md:gap-3 shrink-0 flex-wrap">
            <h2 className="text-lg md:text-xl font-semibold truncate">{groupName}</h2>
            <Badge variant="secondary" className="font-mono shrink-0">
                {totalCount}
            </Badge>
            <div className="flex-1 min-w-0" />

            <AnimatePresence mode="wait">
                {!selectionMode ? (
                    <motion.button
                        key="enter-selection"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={onEnterSelectionMode}
                        disabled={totalCount === 0}
                        className="flex h-8 items-center gap-1.5 px-2 md:px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none shrink-0"
                    >
                        <CheckSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">多选</span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="selection-actions"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-1 md:gap-2 shrink-0"
                    >
                        <button
                            onClick={onSelectAll}
                            className="flex h-8 items-center gap-1.5 px-2 md:px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <span className="hidden xs:inline">
                                {allSelected ? '取消全选' : '全选'}
                            </span>
                            <span className="xs:hidden">
                                {allSelected ? '取消' : '全选'}
                            </span>
                        </button>

                        {!confirmDelete ? (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                disabled={selectedCount === 0}
                                className="flex h-8 items-center gap-1.5 px-2 md:px-3 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="hidden sm:inline">删除</span>
                                {selectedCount > 0 && <span>({selectedCount})</span>}
                            </button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-1 md:gap-2"
                            >
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete();
                                        setConfirmDelete(false);
                                    }}
                                    disabled={isDeleting}
                                    className="flex h-8 items-center gap-1.5 px-2 md:px-3 rounded-lg text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        {isDeleting ? '删除中...' : `确认删除 ${selectedCount} 条`}
                                    </span>
                                    <span className="sm:hidden">
                                        {isDeleting ? '...' : `确认(${selectedCount})`}
                                    </span>
                                </button>
                            </motion.div>
                        )}

                        <button
                            onClick={onExitSelectionMode}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

