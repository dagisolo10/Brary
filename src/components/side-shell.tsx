"use client";

import { Sidebar001, Sidebar001Content, Sidebar001Header, Sidebar001Item, Sidebar001Section } from "@/components/unlumen-ui/sidebar-001";
import { SidebarToggleIcon } from "@/components/unlumen-ui/sidebar-toggle-icon";
import { createSupabaseClient } from "@/lib/supabase/client";
import { History, LayoutDashboard, Library, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const mainNav = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/books", label: "My Library", icon: Library },
    { href: "/sessions", label: "History", icon: History },
];

const userNav = [{ href: "/profile", label: "Profile", icon: User }];

export function SideShell() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createSupabaseClient();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace("/sign-in");
        router.refresh();
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="fixed top-4 right-4 z-50 flex size-9 cursor-pointer items-center justify-center rounded-lg md:hidden"
                aria-label="Toggle sidebar"
            >
                <SidebarToggleIcon isOpen={open} />
            </button>

            {open && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}

            <div
                className={`bg-background fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:static md:z-auto md:block ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <Sidebar001 className="h-screen" defaultWidth={240} maxWidth={260}>
                    <Sidebar001Header>
                        <span className="text-primary text-3xl font-bold">Brary.</span>
                    </Sidebar001Header>

                    <Sidebar001Content className="flex flex-col gap-4">
                        <Sidebar001Section label="Library" className="flex-1">
                            {mainNav.map((item) => (
                                <Sidebar001Item key={item.href} href={item.href} label={item.label} icon={item.icon} isActive={pathname === item.href} />
                            ))}
                        </Sidebar001Section>

                        <Sidebar001Section label="Account">
                            {userNav.map((item) => (
                                <Sidebar001Item key={item.href} href={item.href} label={item.label} icon={item.icon} isActive={pathname === item.href} />
                            ))}

                            <button onClick={handleSignOut} className="w-full text-left">
                                <Sidebar001Item href="#" label="Log Out" icon={LogOut} isActive={false} />
                            </button>
                        </Sidebar001Section>
                    </Sidebar001Content>
                </Sidebar001>
            </div>
        </>
    );
}
