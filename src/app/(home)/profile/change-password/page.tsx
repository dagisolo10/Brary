"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createSupabaseClient } from "@/lib/supabase/client";
import { ArrowLeft, Eye, EyeOff, KeyRound, Save, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
    const supabase = createSupabaseClient();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError(null);

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
                current_password: currentPassword,
            });

            if (error && error.code === "current_password_invalid") {
                setError("Current password is invalid");
                setIsSubmitting(false);
                return;
            }

            setNewPassword("");
            setCurrentPassword("");
            setConfirmPassword("");
            toast.success("Password updated successfully.");
        } catch {
            setError("Unable to update password right now. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="space-y-6 px-4 sm:px-6">
                <Link href="/profile" className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors">
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                    Back to Profile
                </Link>

                <header className="space-y-1">
                    <span className="text-primary font-mono text-[10px] tracking-widest uppercase">Security / Credentials</span>
                    <h1 className="text-3xl font-extrabold tracking-tight">Update Key-pass</h1>
                    <p className="text-muted-foreground text-sm">Modify your authentication credential parameters safely below.</p>
                </header>

                <section className="border-border bg-card relative space-y-4 overflow-hidden rounded-2xl border p-6 sm:p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                <KeyRound className="text-primary size-4.5" /> Authority Check
                            </h2>
                            <p className="text-muted-foreground mt-1 text-xs">Make sure you choose a unique key to maintain node security.</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="border-border hover:text-foreground text-muted-foreground hover:border-foreground/40 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] transition-all"
                        >
                            {showPasswords ? (
                                <div className="flex items-center gap-2">
                                    <EyeOff className="size-3.5" /> Hide Keys
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Eye className="size-3.5" /> Show Keys
                                </div>
                            )}
                        </button>
                    </div>

                    <Separator />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label className="font-mono text-[9px] tracking-widest uppercase">Current Credentials</Label>
                            <Input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" />
                        </div>

                        <Separator />

                        <div className="space-y-1.5">
                            <Label className="font-mono text-[9px] tracking-widest uppercase">New Password</Label>
                            <Input type={showPasswords ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="font-mono text-[9px] tracking-widest uppercase">Confirm New Password</Label>
                            <Input
                                required
                                minLength={6}
                                placeholder="••••••••"
                                value={confirmPassword}
                                type={showPasswords ? "text" : "password"}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="border-destructive/20 bg-destructive/5 text-destructive-foreground flex items-center gap-2 rounded-xl border p-3.5 text-xs font-semibold">
                                <ShieldAlert className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="pt-2">
                            <Button type="submit" size={"cta"} variant={"ctaPrimary"} disabled={isSubmitting}>
                                <Save className="size-4 transition-transform group-hover:scale-110" />
                                {isSubmitting ? "Syncing credentials..." : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
