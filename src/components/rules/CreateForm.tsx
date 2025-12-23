'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Plus, List } from 'lucide-react';
import { useCreateRule } from '@/hooks/useRules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMorphingDialog } from '@/components/ui/morphing-dialog';
import { RULE_TYPES, type RuleType } from './constants';

interface CreateRuleFormProps {
    selectedGroup: string | null;
    groups: string[];
}

export function CreateRuleForm({ selectedGroup, groups }: CreateRuleFormProps) {
    const { setIsOpen } = useMorphingDialog();
    const createRule = useCreateRule();
    const existingGroups = groups;

    const [groupName, setGroupName] = useState(selectedGroup || '');
    const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(existingGroups.length === 0);
    const [ruleType, setRuleType] = useState<RuleType>('DOMAIN');
    const [content, setContent] = useState('');

    const newGroupInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (existingGroups.length === 0) {
            setIsCreatingNewGroup(true);
        }
    }, [existingGroups.length]);

    useEffect(() => {
        if (isCreatingNewGroup && newGroupInputRef.current) {
            newGroupInputRef.current.focus();
        }
    }, [isCreatingNewGroup]);

    const handleGroupNameChange = (value: string) => {
        const filtered = value.toLowerCase().replace(/[^a-z]/g, '');
        setGroupName(filtered);
    };

    const handleStartNewGroup = () => {
        setIsCreatingNewGroup(true);
        setGroupName('');
    };

    const handleBackToSelect = () => {
        setIsCreatingNewGroup(false);
        setGroupName(selectedGroup || existingGroups[0] || '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName.trim() || !content.trim()) return;

        await createRule.mutateAsync({
            group_name: groupName.trim(),
            rule_type: ruleType,
            content: content.trim(),
        });

        setGroupName(selectedGroup || '');
        setContent('');
        setIsCreatingNewGroup(existingGroups.length === 0);
        setIsOpen(false);
    };

    const isFormValid = groupName.trim() && content.trim();
    const showInputMode = isCreatingNewGroup || existingGroups.length === 0;
    const canToggleMode = existingGroups.length > 0;

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* 分组名称 */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">分组名称</Label>

                <div className="flex gap-2">
                    {showInputMode ? (
                        <Input
                            ref={newGroupInputRef}
                            placeholder="输入分组名称（仅小写字母）"
                            value={groupName}
                            onChange={(e) => handleGroupNameChange(e.target.value)}
                            className="flex-1"
                        />
                    ) : (
                        <Select value={groupName} onValueChange={setGroupName}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="选择分组" />
                            </SelectTrigger>
                            <SelectContent>
                                {existingGroups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                        {group}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {canToggleMode && (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={showInputMode ? handleBackToSelect : handleStartNewGroup}
                            title={showInputMode ? '选择现有分组' : '新建分组'}
                        >
                            {showInputMode ? <List className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </div>

            {/* 规则类型 */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">规则类型</Label>
                <Select value={ruleType} onValueChange={(value) => setRuleType(value as RuleType)}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {RULE_TYPES.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                <span className="font-mono">{value}</span>
                                <span className="text-muted-foreground text-xs ml-3">{label}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 规则内容 */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">规则内容</Label>
                <Input
                    placeholder="例如: example.com"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="font-mono"
                />
            </div>

            {/* 提交按钮 */}
            <Button
                type="submit"
                className="w-full"
                disabled={createRule.isPending || !isFormValid}
            >
                {createRule.isPending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        添加中...
                    </>
                ) : (
                    '添加规则'
                )}
            </Button>
        </form>
    );
}
