import { ReactNode } from "react";
import { SideShell } from "@/components/side-shell";

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <SideShell />
            <div className="[scrollbar-color:--theme(--color-muted-foreground/40%)_transparent] dark:[scrollbar-color:--theme(--color-muted-foreground/30%)_--theme(--color-muted/20%)] min-h-screen flex-1 [scrollbar-width:thin] overflow-y-auto p-8">
                {children}
            </div>
        </div>
    );
}
