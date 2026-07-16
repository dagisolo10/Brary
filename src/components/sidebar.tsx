"use client";

import { Sidebar001, Sidebar001Content, Sidebar001Header, Sidebar001Item, Sidebar001Section } from "@/components/unlumen-ui/sidebar-001";
import { createSupabaseClient } from "@/lib/supabase/client";
import { History, LayoutDashboard, Library, LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const mainNav = [
    {
        href: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/books",
        label: "My Library",
        icon: Library,
    },
    {
        href: "/sessions",
        label: "History",
        icon: History,
    },
];

const userNav = [{ href: "/profile", label: "Profile", icon: User }];

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createSupabaseClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace("/sign-in");
        router.refresh();
    };

    return (
        <Sidebar001 className="h-screen" maxWidth={260}>
            <Sidebar001Header>
                <span className="text-3xl font-bold">Brary</span>
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
    );
}
