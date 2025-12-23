'use client';

import { ChevronLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GroupList } from '@/components/groups';
import { CreateRuleDialog } from '@/components/rules';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface SidebarProps {
    groups: string[];
    selectedGroup: string | null;
    onSelectGroup: (group: string) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
}

export function Sidebar({
    groups,
    selectedGroup,
    onSelectGroup,
    isOpen,
    onOpenChange,
    className
}: SidebarProps) {
    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
            />

            {/* Unified Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out md:static md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    className
                )}
            >
                <div className="flex items-center justify-between p-4 shrink-0">
                    <h1 className="text-lg font-bold tracking-tight">WRule</h1>
                    <div className="flex items-center gap-2">
                        <CreateRuleDialog selectedGroup={selectedGroup} groups={groups} />
                        <button
                            onClick={() => onOpenChange(false)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors md:hidden"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-3 py-2">
                        {groups.length === 0 ? (
                            <div className="text-sm text-muted-foreground text-center py-8">
                                暂无分组
                            </div>
                        ) : (
                            <GroupList
                                groups={groups}
                                selectedGroup={selectedGroup}
                                onSelectGroup={(g) => {
                                    onSelectGroup(g);
                                    onOpenChange(false);
                                }}
                            />
                        )}
                    </div>
                </ScrollArea>
            </aside>
        </>
    );
}
