"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/server/user";
import { Loader2, Pencil } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function ProfileUpdateDialog({ currentName }: { currentName: string }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(currentName);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (name.trim() === currentName) {
            setOpen(false);
            return;
        }

        startTransition(async () => {
            try {
                const res = await updateUser(name);

                if ("error" in res) {
                    throw new Error(res.error);
                }

                toast.success("Profile Updated!");

                setOpen(false);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to save profile changes";
                toast.error(msg);
                setError(msg);
            }
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!isPending) {
                    setOpen(val);
                    if (!val) setError(null);
                }
            }}
        >
            <DialogTrigger render={<Button variant="outline" size="icon" />}>
                <Pencil className="size-3.5" />
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
                <form onSubmit={handleSave} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Update Profile Name</DialogTitle>
                        <DialogDescription className="text-xs">Change your account profile name. This changes how your identity is rendered throughout the app.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-2">
                        <Label htmlFor="profile-name" className="text-xs font-semibold">
                            Display Name
                        </Label>
                        <Input
                            id="profile-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isPending}
                            placeholder="Enter your name"
                            required
                            className="bg-background border-border"
                        />
                        {error && <p className="text-destructive mt-1 text-xs font-medium">{error}</p>}
                    </div>

                    <DialogFooter className="gap-4">
                        <Button size={"sm"} className="text-xs" type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button size={"sm"} className="text-xs" type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
