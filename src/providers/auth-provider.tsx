"use client";

import { AuthContext } from "@/contexts/auth-context";
import { createSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
    const supabase = createSupabaseClient();

    const [token, setToken] = useState<string | null>(null);
    const [claims, setClaims] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);

            const { data, error } = await supabase.auth.getSession();

            const session = data.session;

            if (error) {
                console.error("Error getting session:", error);
            }

            if (session) {
                setToken(session.access_token);
                setClaims(session.user);
            } else {
                setToken(null);
                setClaims(null);
            }
            setIsLoading(false);
        };

        initializeAuth();

        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", { event });

            if (session) {
                setToken(session.access_token);
                setClaims(session.user);
            } else {
                setToken(null);
                setClaims(null);
            }
        });

        return () => {
            data.subscription.unsubscribe();
        };
    }, [supabase.auth]);

    return <AuthContext.Provider value={{ token, claims, isLoading, isSignedIn: !!claims }}>{children}</AuthContext.Provider>;
}
