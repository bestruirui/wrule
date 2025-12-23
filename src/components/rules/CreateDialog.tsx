'use client';

import { Plus } from 'lucide-react';
import {
    MorphingDialog,
    MorphingDialogTrigger,
    MorphingDialogContainer,
    MorphingDialogContent,
    MorphingDialogClose,
    MorphingDialogTitle,
} from '@/components/ui/morphing-dialog';
import { CreateRuleForm } from './CreateForm';

interface CreateRuleDialogProps {
    selectedGroup: string | null;
    groups: string[];
}

export function CreateRuleDialog({ selectedGroup, groups }: CreateRuleDialogProps) {
    return (
        <MorphingDialog>
            <MorphingDialogTrigger className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
            </MorphingDialogTrigger>

            <MorphingDialogContainer>
                <MorphingDialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-border bg-card p-6 md:p-8">
                    <MorphingDialogTitle>
                        <header className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold tracking-tight text-card-foreground">
                                新建规则
                            </h2>
                            <MorphingDialogClose
                                className="relative right-0 top-0"
                                variants={{
                                    initial: { opacity: 0, scale: 0.8 },
                                    animate: { opacity: 1, scale: 1 },
                                    exit: { opacity: 0, scale: 0.8 }
                                }}
                            />
                        </header>
                    </MorphingDialogTitle>
                    <CreateRuleForm selectedGroup={selectedGroup} groups={groups} />
                </MorphingDialogContent>
            </MorphingDialogContainer>
        </MorphingDialog>
    );
}
