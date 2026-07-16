import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="[scrollbar-color:--theme(--color-muted-foreground/40%)_transparent] dark:[scrollbar-color:--theme(--color-muted-foreground/30%)_--theme(--color-muted/20%)] min-h-screen flex-1 [scrollbar-width:thin] overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
