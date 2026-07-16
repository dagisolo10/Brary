"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createBook } from "@/server/book";
import { Plus } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";

export function NewBookDialog() {
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);

    const [error, submitAction, isPending] = useActionState(async () => {
        try {
            await createBook({ name });
            setName("");
            setOpen(false);
            toast.success(`Book "${name}" created`);
            return null;
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to create book";
            toast.error(msg);
            return msg;
        }
    }, null);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="text-xs font-semibold shadow-xl shadow-white/15" />}>
                <Plus className="size-4" /> Add New Book
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new book</DialogTitle>
                </DialogHeader>

                <form action={submitAction} className="space-y-4">
                    <div className="space-y-2">
                        <Input placeholder="Book name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                        {error && <p className="text-destructive text-sm">{error}</p>}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!name.trim() || isPending}>
                            {isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
