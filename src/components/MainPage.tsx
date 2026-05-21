import { useMemo, useState } from "react";
import { Check, Copy, Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useCreateRuleMutation, useDeleteRuleMutation, useDeleteRulesByGroupMutation, useRulesQuery, useUpdateRuleMutation, type Rule, type RuleInput } from "@/api/rules";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RULE_TYPES } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function MainPage() {
	const rulesQuery = useRulesQuery();
	const createRuleMutation = useCreateRuleMutation();
	const updateRuleMutation = useUpdateRuleMutation();
	const deleteRuleMutation = useDeleteRuleMutation();
	const deleteRulesByGroupMutation = useDeleteRulesByGroupMutation();
	const [activeGroupName, setActiveGroupName] = useState("");
	const [copiedGroupName, setCopiedGroupName] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [ruleFormOpen, setRuleFormOpen] = useState(false);
	const [customGroupName, setCustomGroupName] = useState(false);
	const [editingRule, setEditingRule] = useState<Rule | null>(null);
	const [draftRule, setDraftRule] = useState<RuleInput | null>(null);

	const ruleGroups = useMemo(() => {
		const groups = new Map<string, Rule[]>();
		for (const rule of rulesQuery.data || []) {
			if (!groups.has(rule.group_name)) groups.set(rule.group_name, []);
			groups.get(rule.group_name)!.push(rule);
		}
		return [...groups].map(([name, rules]) => ({ name, rules }));
	}, [rulesQuery.data]);

	const activeGroup = ruleGroups.find((group) => group.name === activeGroupName) || ruleGroups[0];
	const filteredRules = (activeGroup?.rules || []).filter((rule) =>
		rule.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
		rule.rule_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
		rule.group_name.toLowerCase().includes(searchQuery.toLowerCase())
	);
	const showError = (error: unknown) => {
		toast.error(error instanceof Error ? error.message : "操作失败。");
	};
	return (
		<div className="flex h-screen min-h-0 flex-col bg-background">
			<main className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 overflow-hidden">
				<aside className="flex min-h-0 w-70 flex-col bg-background px-4 py-6">
					<div className="mb-6 flex h-10 items-center gap-2 px-3">
						<img src="/favicon.svg" alt="" className="size-7" />
						<div className="text-base font-semibold text-foreground">WRule</div>
					</div>
					<ScrollArea className="min-h-0 flex-1 overflow-hidden rounded-xl">
						<div className="flex flex-col gap-2">
							{ruleGroups.map((group) => (
								<div
									key={group.name}
									onClick={() => setActiveGroupName(group.name)}
									className="group flex cursor-pointer items-center justify-between rounded-xl bg-card px-4 py-3 transition-all"
								>
									<div className="overflow-hidden">
										<div className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm ${group.name === (activeGroup?.name || "") ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
											{group.name}
										</div>
									</div>
									<div className="flex items-center">
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={(event) => {
												event.stopPropagation();
												const secret = window.sessionStorage.getItem("wrule:secret");
												if (!secret) {
													toast.error("密钥缺失，请重新登录。");
													return;
												}
												void navigator.clipboard.writeText(`${window.location.origin}/subs/${encodeURIComponent(secret)}/${encodeURIComponent(group.name)}`).then(() => {
													setCopiedGroupName(group.name);
													window.setTimeout(() => setCopiedGroupName(""), 2000);
												}).catch(showError);
											}}
											title="复制订阅链接"
											className={copiedGroupName === group.name ? "bg-accent text-accent-foreground hover:bg-accent/80" : "text-muted-foreground"}
										>
											{copiedGroupName === group.name ? <Check size={16} /> : <Copy size={16} />}
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={(event) => {
												event.stopPropagation();
												deleteRulesByGroupMutation.mutate({ group_name: group.name }, {
													onSuccess: () => setActiveGroupName(""),
													onError: showError,
												});
											}}
											title="删除分组"
											className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
										>
											<Trash2 size={16} />
										</Button>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				</aside>
				<Separator orientation="vertical" className="data-vertical:h-96 data-vertical:self-center" />

				<section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background px-8 py-6">
					<div className="mb-6 flex h-10 items-center justify-between">
						<h1 className="m-0 text-2xl font-semibold text-foreground">{activeGroup?.name || "Wrule"}</h1>
						<div className="flex items-center gap-4">
							<div className="flex w-75 items-center gap-2">
								<Search size={16} className="mr-2 text-muted-foreground" />
								<Input
									type="text"
									placeholder="搜索规则..."
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
								/>
							</div>
							<Button
								variant="outline"
								type="button"
								size="icon-lg"
								title="添加规则"
								onClick={() => {
									setEditingRule(null);
									setCustomGroupName(!activeGroup);
									setDraftRule({ group_name: activeGroup?.name || "", rule_type: "DOMAIN-SUFFIX", content: "" });
									setRuleFormOpen(true);
								}}
								className="rounded-full"
							>
								<Plus size={18} />
							</Button>
						</div>
					</div>

					<ScrollArea className="min-h-0 flex-1 overflow-hidden rounded-xl">
						<div className="flex flex-col gap-2">
							{rulesQuery.isLoading ? (
								<div className="py-16 text-center text-sm text-muted-foreground">加载中</div>
							) : rulesQuery.error instanceof Error ? (
								<div className="py-16 text-center text-sm text-muted-foreground">{rulesQuery.error.message}</div>
							) : filteredRules.length > 0 ? (
								filteredRules.map((rule) => (
									<div key={rule.id} className="group flex items-center rounded-xl bg-card px-4 py-3">
										<div className="w-32">
											<span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
												{rule.rule_type}
											</span>
										</div>
										<div className="flex-1 px-4 font-mono text-sm text-foreground">{rule.content}</div>
										<div className="flex w-24 items-center justify-end gap-1 text-right">
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												title="编辑"
												onClick={() => {
													setEditingRule(rule);
													setCustomGroupName(!ruleGroups.some((group) => group.name === rule.group_name));
													setDraftRule({ group_name: rule.group_name, rule_type: rule.rule_type, content: rule.content });
													setRuleFormOpen(true);
												}}
												className="text-muted-foreground"
											>
												<Edit2 size={16} />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon-sm"
												title="删除"
												onClick={() => deleteRuleMutation.mutate({ id: rule.id }, { onError: showError })}
												className="text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
											>
												<Trash2 size={16} />
											</Button>
										</div>
									</div>
								))
							) : (
								<div className="py-16 text-center text-sm text-muted-foreground">暂无规则</div>
							)}
						</div>
					</ScrollArea>
				</section>
			</main>
			{/* 关闭动画期间 Radix 会继续保留内容节点，open 状态不能直接由 draftRule 派生，否则内容先被清空会导致弹层瞬间塌缩。 */}
			<Dialog open={ruleFormOpen} onOpenChange={setRuleFormOpen}>
				<DialogContent>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							if (!draftRule) return;
							if (editingRule) {
								updateRuleMutation.mutate({ id: editingRule.id, body: draftRule }, {
									onSuccess: (item) => {
										setActiveGroupName(item.group_name);
										setRuleFormOpen(false);
									},
									onError: showError,
								});
								return;
							}
							createRuleMutation.mutate(draftRule, {
								onSuccess: (item) => {
									setActiveGroupName(item.group_name);
									setRuleFormOpen(false);
								},
								onError: showError,
							});
						}}
						className="grid gap-4"
					>
						<DialogHeader>
							<DialogTitle>{editingRule ? "编辑规则" : "添加规则"}</DialogTitle>
						</DialogHeader>
						{draftRule && (
							<FieldGroup className="gap-4">
								<Field>
									<FieldLabel>分组名称</FieldLabel>
									{ruleGroups.length > 0 && (
										<Select
											value={customGroupName ? "__custom__" : draftRule.group_name}
											onValueChange={(group_name) => {
												setCustomGroupName(group_name === "__custom__");
												setDraftRule({ ...draftRule, group_name: group_name === "__custom__" ? "" : group_name });
											}}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent position="popper">
												<SelectItem value="__custom__">自定义</SelectItem>
												{ruleGroups.map((group) => (
													<SelectItem key={group.name} value={group.name}>{group.name}</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
									{(customGroupName || ruleGroups.length === 0) && (
										<Input
											id="rule-group-name"
											value={draftRule.group_name}
											onChange={(event) => setDraftRule({ ...draftRule, group_name: event.target.value })}
											placeholder="分组名称"
										/>
									)}
								</Field>
								<Field>
									<FieldLabel>规则类型</FieldLabel>
									<Select
										value={draftRule.rule_type}
										onValueChange={(rule_type) => setDraftRule({ ...draftRule, rule_type })}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent position="popper">
											{RULE_TYPES.map((item) => (
												<SelectItem key={item.value} value={item.value} textValue={item.value}>
													<span className="flex w-full min-w-0 items-center justify-between gap-6">
														<span className="shrink-0 font-mono">{item.value}</span>
														<span className="min-w-0 truncate text-muted-foreground">{item.label}</span>
													</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
								<Field>
									<FieldLabel htmlFor="rule-content">规则内容</FieldLabel>
									<Input
										id="rule-content"
										value={draftRule.content}
										onChange={(event) => setDraftRule({ ...draftRule, content: event.target.value })}
										placeholder="规则内容"
										className="font-mono"
									/>
								</Field>
							</FieldGroup>
						)}
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="secondary">取消</Button>
							</DialogClose>
							<Button type="submit">保存</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
