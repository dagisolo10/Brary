"use client";
import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export type AuthContextType = {
    isLoading: boolean;
    isSignedIn: boolean;
    token: string | null;
    claims?: User | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("Wrap the app with AuthProvider.");
    return context;
}
