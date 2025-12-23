import { useState, useCallback, useMemo } from 'react';

interface UseSelectionProps<T> {
    items: T[];
    getItemId: (item: T) => number;
}

export function useSelection<T>({ items, getItemId }: UseSelectionProps<T>) {
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const handleSelect = useCallback((id: number, selected: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (selected) {
                next.add(id);
            } else {
                next.delete(id);
            }
            return next;
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        setSelectedIds((prev) => {
            const allIds = items.map(getItemId);
            const shouldClear = allIds.length > 0 && prev.size === allIds.length;
            return shouldClear ? new Set() : new Set(allIds);
        });
    }, [items, getItemId]);

    const exitSelectionMode = useCallback(() => {
        setSelectionMode(false);
        setSelectedIds(new Set());
    }, []);

    const allSelected = useMemo(() => {
        return items.length > 0 && selectedIds.size === items.length;
    }, [items.length, selectedIds.size]);

    return {
        selectionMode,
        setSelectionMode,
        selectedIds,
        handleSelect,
        handleSelectAll,
        exitSelectionMode,
        allSelected
    };
}

