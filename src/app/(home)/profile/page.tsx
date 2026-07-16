import Link from "next/link";
import prisma from "@/lib/prisma";
import { getUser } from "@/server/user";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/utils/formatters";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowRight, BookOpen, Calendar, Clock, Fingerprint, Mail, Shield, User } from "lucide-react";

export default async function Profile() {
    const supabase = await createSupabaseServer();
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData?.session) {
        redirect("/sign-in");
    }

    const supabaseUser = sessionData.session.user;
    const email = supabaseUser.email ?? "No email provided";

    const user = await getUser({ userId: supabaseUser.id, name: supabaseUser.user_metadata?.name ?? "User" });

    const [totalBooks, totalSessions] = await Promise.all([prisma.book.count({ where: { userId: user.id } }), prisma.session.count({ where: { userId: user.id } })]);

    return (
        <div className="h-screen w-full space-y-6">
            <div className="flex flex-col gap-1">
                <span className="text-primary font-mono text-[10px] tracking-widest uppercase">Console / Account</span>
                <h1 className="text-3xl font-extrabold tracking-tight">System Profile</h1>
                <p className="text-muted-foreground text-sm">Manage your credentials, active preferences, and security settings.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="border-border relative overflow-hidden rounded-2xl border bg-linear-to-br from-[#141414] to-[#0A0A0A] p-6 md:col-span-2">
                    <div className="bg-primary/5 absolute -top-10 -right-10 size-32 rounded-full blur-3xl" />

                    <div className="flex h-full flex-col justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="border-primary/20 bg-primary/5 text-primary flex size-16 shrink-0 items-center justify-center rounded-2xl border text-2xl font-bold">
                                {user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold">{user.name}</h2>
                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Active</span>
                                </div>
                                <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                    <Fingerprint className="text-muted-foreground size-3.5" /> ID: {supabaseUser.id.slice(0, 8)}...
                                </p>
                            </div>
                        </div>

                        <div className="border-border grid grid-cols-2 gap-4 border-t pt-4">
                            <div className="space-y-1">
                                <span className="text-muted-foreground flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase">
                                    <User className="size-3" /> Account Name
                                </span>
                                <span className="text-sm font-semibold">{user.name}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-muted-foreground flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase">
                                    <Mail className="size-3" /> Address
                                </span>
                                <span className="block truncate text-sm font-semibold">{email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-border bg-card flex flex-col justify-between rounded-2xl border p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">Security Status</span>
                            <Shield className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="border-border flex justify-between border-b pb-2 text-xs">
                                <span className="text-muted-foreground">Password</span>
                                <span className="font-semibold">Configured</span>
                            </div>
                            <div className="border-border flex justify-between border-b pb-2 text-xs">
                                <span className="text-muted-foreground">Auth Method</span>
                                <span className="font-semibold capitalize">{supabaseUser.app_metadata?.provider ?? "Email"}</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/profile/change-password"
                        className="group border-border hover:border-foreground/20 hover:bg-foreground/5 hover:text-foreground mt-6 flex items-center justify-between rounded-xl border bg-transparent px-4 py-3 text-xs font-semibold transition-all"
                    >
                        <span className="flex items-center gap-2">
                            <Shield className="text-primary size-4" /> Update Password
                        </span>
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="border-border bg-card rounded-2xl border p-6">
                    <div className="flex h-full flex-col justify-between">
                        <div className="space-y-2">
                            <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase">
                                <Calendar className="size-3.5" /> Established
                            </span>
                            <div className="text-primary text-lg font-bold">{formatDateTime(user.createdAt)}</div>
                        </div>
                        <p className="text-muted-foreground mt-4 text-[11px] leading-relaxed">This timestamp registers the exact point your system account records were initiated.</p>
                    </div>
                </div>

                <div className="border-border from-card rounded-2xl border bg-linear-to-br to-[#0A0A0A] p-6 md:col-span-2">
                    <div className="flex h-full flex-col justify-between gap-6">
                        <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase">
                            <BookOpen className="size-3.5" /> Activity Metrics
                        </span>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-1">
                                <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                    <BookOpen className="text-primary size-3.5" /> Total Books Saved
                                </span>
                                <div className="text-3xl font-extrabold tracking-tight">{totalBooks}</div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                    <Clock className="text-primary size-3.5" /> Total Sessions
                                </span>
                                <div className="text-3xl font-extrabold tracking-tight">{totalSessions}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
