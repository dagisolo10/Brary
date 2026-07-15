"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Fingerprint, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseClient } from "@/lib/supabase/client";
import { getUser } from "@/server/user";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

const signUpSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().optional(),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function AuthScreen({ defaultTab }: { defaultTab: "sign-in" | "sign-up" }) {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">(defaultTab);

    const [authError, setAuthError] = useState<string | null>(null);

    const supabase = createSupabaseClient();

    const signInForm = useForm<SignInFormValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });
    const signUpForm = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema), defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" } });

    const handleOAuth = async (provider: "google" | "apple") => {
        setAuthError(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) setAuthError(error.message);
    };

    const onSignInSubmit = async (values: SignInFormValues) => {
        setAuthError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        });

        if (error) {
            setAuthError(error.message);
        } else {
            router.push("/");
            await getUser();
            resetState();
        }
    };

    const onSignUpSubmit = async (values: SignUpFormValues) => {
        setAuthError(null);
        const fullName = `${values.firstName} ${values.lastName}`.trim();

        const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: { name: fullName, first_name: values.firstName, last_name: values.lastName },
            },
        });

        if (error) {
            setAuthError(error.message);
        } else {
            router.push("/");
            await getUser();
            resetState();
        }
    };

    const resetState = () => {
        setAuthError(null);
        signInForm.reset();
        signUpForm.reset();
    };

    const handleTabChange = (val: string) => {
        setActiveTab(val as "sign-in" | "sign-up");
        resetState();
    };

    return (
        <div className="py-4">
            <Tabs
                defaultValue={defaultTab}
                value={activeTab}
                onValueChange={handleTabChange}
                className="border-foreground/5 bg-foreground/3 shadow-background/60 mx-auto w-full max-w-110 scrollbar-none overflow-y-scroll rounded-xl border p-6 shadow-2xl backdrop-blur-xl"
            >
                <CardHeader className="space-y-4 pb-4">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                        <div className="border-foreground/10 bg-foreground/2 flex size-10 items-center justify-center rounded-full border">
                            <Fingerprint className="text-primary size-5" />
                        </div>
                        <CardTitle className="mt-1 text-xl font-semibold tracking-tight">Welcome back</CardTitle>
                        <CardDescription className="text-muted-foreground text-xs">Access your account dashboard or get started today.</CardDescription>
                    </div>

                    <TabsList className="bg-foreground/4 grid w-full grid-cols-2">
                        <TabsTrigger value="sign-in" className="text-xs">
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger value="sign-up" className="text-xs">
                            Create Account
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>

                <CardContent className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" type="button" className="text-xs" onClick={() => handleOAuth("google")}>
                            <svg viewBox="0 0 128 128" className="text-foreground size-4 fill-current">
                                <path d="M44.59 4.21a63.28 63.28 0 004.33 120.9 67.6 67.6 0 0032.36.35 57.13 57.13 0 0025.9-13.46 57.44 57.44 0 0016-26.26 74.33 74.33 0 001.61-33.58H65.27v24.69h34.47a29.72 29.72 0 01-12.66 19.52 36.16 36.16 0 01-13.93 5.5 41.29 41.29 0 01-15.1 0A37.16 37.16 0 0144 95.74a39.3 39.3 0 01-14.5-19.42 38.31 38.31 0 010-24.63 39.25 39.25 0 019.18-14.91A37.17 37.17 0 0176.13 27a34.28 34.28 0 0113.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0087.2 4.59a64 64 0 00-42.61-.38z"></path>
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" type="button" className="text-xs" onClick={() => handleOAuth("apple")}>
                            <svg className="text-foreground size-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.06 1.005 1.45 2.185 3.068 3.76 3.007 1.514-.06 2.09-.974 3.916-.974 1.815 0 2.342.974 3.923.94 1.615-.027 2.65-1.468 3.633-2.9 1.135-1.657 1.6-3.257 1.623-3.34-.035-.015-3.118-1.196-3.15-4.78-.027-2.99 2.454-4.428 2.568-4.5-.14-.208-2.584-2.872-6.104-3.13-.918-.08-2.456.44-3.355.44zm1.184-2.288c.804-.984 1.346-2.35 1.198-3.715-1.168.047-2.582.784-3.418 1.764-.748.86-1.402 2.247-1.226 3.593 1.3.1 2.642-.66 3.446-1.642z" />
                            </svg>
                            Apple
                        </Button>
                    </div>

                    <div className="relative flex items-center py-2">
                        <div className="border-foreground/10 grow border-t"></div>
                        <span className="mx-3 shrink text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">Or continue with</span>
                        <div className="border-foreground/10 grow border-t"></div>
                    </div>

                    {authError && <p className="text-destructive text-center text-xs font-semibold">{authError}</p>}

                    <TabsContent value="sign-in" className="m-0 space-y-4">
                        <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-6">
                            <Field>
                                <Label htmlFor="signin-email">Email address</Label>
                                <Input id="signin-email" type="email" placeholder="name@example.com" {...signInForm.register("email")} />
                                {signInForm.formState.errors.email && <p className="text-destructive text-[11px]">{signInForm.formState.errors.email.message}</p>}
                            </Field>

                            <Field>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="signin-password">Password</Label>
                                    <Link href="#" className="text-primary hover:text-primary/80 text-[11px] font-semibold transition-colors duration-300">
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <Input id="signin-password" placeholder="••••••••" type={showPassword ? "text" : "password"} className="pr-10" {...signInForm.register("password")} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="hover:text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {signInForm.formState.errors.password && <p className="text-destructive text-[11px]">{signInForm.formState.errors.password.message}</p>}
                            </Field>

                            <Button type="submit" disabled={signInForm.formState.isSubmitting} className="shadow-foreground/10 w-full text-xs shadow-lg">
                                {signInForm.formState.isSubmitting && <Loader2 className="mr-2 size-3.5 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </TabsContent>

                    {/* SIGN UP VIEW */}
                    <TabsContent value="sign-up" className="m-0 space-y-4">
                        <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                            <FieldGroup className="grid grid-cols-2 gap-3">
                                <Field>
                                    <Label htmlFor="signup-first-name">First name</Label>
                                    <Input
                                        id="signup-first-name"
                                        type="text"
                                        placeholder="Jane"
                                        className="focus-visible:ring-primary border-foreground/10 bg-background/20 placeholder-zinc-500"
                                        {...signUpForm.register("firstName")}
                                    />
                                    {signUpForm.formState.errors.firstName && <p className="text-destructive text-[11px]">{signUpForm.formState.errors.firstName.message}</p>}
                                </Field>

                                <Field>
                                    <Label htmlFor="signup-last-name">Last name</Label>
                                    <Input
                                        id="signup-last-name"
                                        type="text"
                                        placeholder="Doe"
                                        className="focus-visible:ring-primary border-foreground/10 bg-background/20 placeholder-zinc-500"
                                        {...signUpForm.register("lastName")}
                                    />
                                    {signUpForm.formState.errors.lastName && <p className="text-destructive text-[11px]">{signUpForm.formState.errors.lastName.message}</p>}
                                </Field>
                            </FieldGroup>

                            <Field>
                                <Label htmlFor="signup-email">Email address</Label>
                                <Input id="signup-email" type="email" placeholder="name@example.com" {...signUpForm.register("email")} />
                                {signUpForm.formState.errors.email && <p className="text-destructive text-[11px]">{signUpForm.formState.errors.email.message}</p>}
                            </Field>

                            <Field>
                                <Label htmlFor="signup-password">Create password</Label>
                                <div className="relative">
                                    <Input id="signup-password" placeholder="Minimum 6 characters" type={showPassword ? "text" : "password"} className="pr-10" {...signUpForm.register("password")} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="hover:text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500 transition"
                                    >
                                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                                {signUpForm.formState.errors.password && <p className="text-destructive text-[11px]">{signUpForm.formState.errors.password.message}</p>}
                            </Field>

                            <Field>
                                <Label htmlFor="signup-confirm-password">Confirm password</Label>
                                <Input id="signup-confirm-password" placeholder="••••••••" type={showPassword ? "text" : "password"} {...signUpForm.register("confirmPassword")} />
                                {signUpForm.formState.errors.confirmPassword && <p className="text-destructive text-[11px]">{signUpForm.formState.errors.confirmPassword.message}</p>}
                            </Field>

                            <Button type="submit" disabled={signUpForm.formState.isSubmitting} className="shadow-foreground/10 w-full text-xs shadow-lg">
                                {signUpForm.formState.isSubmitting && <Loader2 className="mr-2 size-3.5 animate-spin" />}
                                Register
                            </Button>
                        </form>
                    </TabsContent>
                </CardContent>

                <CardFooter className="justify-center pt-2">
                    <p className="text-muted-foreground px-4 text-center text-[11px] leading-relaxed">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-foreground hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-foreground hover:underline">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </CardFooter>
            </Tabs>
        </div>
    );
}
