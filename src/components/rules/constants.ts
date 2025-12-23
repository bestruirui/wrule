export const RULE_TYPES = [
    { value: 'DOMAIN', label: '匹配完整域名' },
    { value: 'DOMAIN-SUFFIX', label: '匹配域名后缀' },
    { value: 'DOMAIN-KEYWORD', label: '域名关键字匹配' },
    { value: 'DOMAIN-WILDCARD', label: '通配符匹配（支持 * 和 ?）' },
    { value: 'DOMAIN-REGEX', label: '域名正则表达式匹配' },
    { value: 'IP-CIDR', label: '匹配 IP 地址范围' },
    { value: 'IP-CIDR6', label: '匹配 IP 地址范围（IPv6）' },
    { value: 'IP-SUFFIX', label: '匹配 IP 后缀范围' },
    { value: 'IP-ASN', label: '匹配 IP 所属 ASN' },
    { value: 'GEOIP', label: '匹配 IP 所属国家代码' },
    { value: 'SRC-GEOIP', label: '匹配来源 IP 所属国家代码' },
    { value: 'SRC-IP-ASN', label: '匹配来源 IP 所属 ASN' },
    { value: 'SRC-IP-CIDR', label: '匹配来源 IP 地址范围' },
    { value: 'SRC-IP-SUFFIX', label: '匹配来源 IP 后缀范围' },
    { value: 'PROCESS-PATH', label: '使用完整进程路径匹配' },
    { value: 'PROCESS-PATH-REGEX', label: '使用进程路径正则表达式匹配' },
    { value: 'PROCESS-NAME', label: '使用进程名匹配' },
    { value: 'PROCESS-NAME-REGEX', label: '使用进程名正则表达式匹配' },
] as const;

export type RuleType = (typeof RULE_TYPES)[number]['value'];
