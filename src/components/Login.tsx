'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '@/stores/appStore';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const login = useAppStore((state) => state.login);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!password.trim()) {
            setError('请输入密码');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const success = await login(password);
            if (!success) {
                setError('密码错误');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full min-h-dvh md:min-h-[400px] flex flex-col items-center justify-center px-6 py-12 text-foreground"
        >
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <div className="flex items-center gap-2">
                    <Input
                        id="password"
                        type="password"
                        placeholder="请输入密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        disabled={isSubmitting}
                        aria-invalid={!!error}
                        title={error ?? undefined}
                        className="h-11 flex-1"
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 w-11 shrink-0 rounded-xl"
                        aria-label="登录"
                        title="登录"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <ArrowRight className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
