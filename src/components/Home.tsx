'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Loader2, Menu } from 'lucide-react';
import { useRules, useBulkDeleteRules } from '@/hooks/useRules';
import { useSelection } from '@/hooks/useSelection';
import { RuleList, RuleListHeader } from '@/components/rules';
import { Sidebar } from '@/components/Sidebar';

export function Home() {
    const { data: rules = [], isLoading } = useRules();
    const bulkDelete = useBulkDeleteRules();
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const groups = useMemo(() => {
        const groupSet = new Set(rules.map((r) => r.group_name));
        return Array.from(groupSet).sort();
    }, [rules]);

    const filteredRules = useMemo(() => {
        if (!selectedGroup) return rules;
        return rules.filter((r) => r.group_name === selectedGroup);
    }, [rules, selectedGroup]);

    const {
        selectionMode,
        setSelectionMode,
        selectedIds,
        handleSelect,
        handleSelectAll,
        exitSelectionMode,
        allSelected
    } = useSelection({
        items: filteredRules,
        getItemId: (r) => r.id
    });

    // Auto-select first group when groups change
    useEffect(() => {
        if (groups.length === 0) return;
        if (!selectedGroup || !groups.includes(selectedGroup)) {
            setSelectedGroup(groups[0]);
        }
    }, [groups, selectedGroup]);

    const handleBulkDelete = useCallback(() => {
        if (selectedIds.size === 0) return;
        bulkDelete.mutate(Array.from(selectedIds), {
            onSuccess: () => {
                exitSelectionMode();
            },
        });
    }, [selectedIds, bulkDelete, exitSelectionMode]);

    const handleSelectGroup = useCallback((group: string) => {
        // Prevent accidental cross-group selection/bulk delete
        exitSelectionMode();
        setSelectedGroup(group);
    }, [exitSelectionMode]);

    if (isLoading) {
        return (
            <div className="h-full min-h-dvh md:min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-dvh md:flex-row overflow-hidden">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-3 border-b border-border shrink-0 bg-background">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-base font-bold tracking-tight">WRule</h1>
                <div className="w-9" />
            </header>

            <Sidebar
                groups={groups}
                selectedGroup={selectedGroup}
                onSelectGroup={handleSelectGroup}
                isOpen={sidebarOpen}
                onOpenChange={setSidebarOpen}
            />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 flex flex-col gap-3 md:gap-4 overflow-hidden">
                {selectedGroup && (
                    <RuleListHeader
                        groupName={selectedGroup}
                        totalCount={filteredRules.length}
                        selectionMode={selectionMode}
                        selectedCount={selectedIds.size}
                        allSelected={allSelected}
                        onEnterSelectionMode={() => setSelectionMode(true)}
                        onExitSelectionMode={exitSelectionMode}
                        onSelectAll={handleSelectAll}
                        onDelete={handleBulkDelete}
                        isDeleting={bulkDelete.isPending}
                    />
                )}

                <div className="flex-1 min-h-0">
                    <RuleList
                        rules={filteredRules}
                        selectionMode={selectionMode}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                    />
                </div>
            </main>
        </div>
    );
}
