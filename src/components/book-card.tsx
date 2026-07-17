"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteBook, updateBook } from "@/server/book";
import { formatDate } from "@/utils/formatters";
import { Book } from "@prisma/client";
import { BookOpen, Calendar, ChevronRight, Edit2, Play, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function BookCard({ book }: { book: Book }) {
    const { createdAt, id, name } = book;

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editName, setEditName] = useState(book.name);
    const [isLoading, setIsLoading] = useState(false);

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editName.trim() || editName === name) return;

        setIsLoading(true);
        try {
            await updateBook(id, { name: editName });
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error("Failed to update book:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSubmit = async () => {
        setIsLoading(true);
        try {
            await deleteBook(id);
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error("Failed to delete book:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="border-border bg-card hover:border-foreground/20 group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 transition-all">
                <div className="flex items-center gap-4">
                    <div className="border-primary/20 bg-primary/5 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl border">
                        <BookOpen className="size-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                        <h3 className="line-clamp-2 text-base leading-snug font-bold">{name}</h3>
                        <p className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                            <Calendar className="size-3" />
                            Added {formatDate(createdAt, true)}
                        </p>
                    </div>

                    <Link href={`books/${id}`} className="group">
                        <span className="relative flex size-6 overflow-hidden">
                            <ChevronRight className="absolute inset-0 transition-all duration-300 ease-in-out group-hover:translate-x-2 group-hover:opacity-75" />
                            <ChevronRight className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-50" />
                        </span>
                    </Link>
                </div>

                <div className="flex items-center">
                    <div className="relative flex w-24 items-center justify-start overflow-hidden">
                        <div className="border-border bg-foreground/2 text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-0 sm:translate-x-0 sm:opacity-100 sm:group-hover:translate-x-16">
                            <Settings className="animate-spin-slow size-4" />
                        </div>

                        <div className="absolute left-0 flex gap-1.5 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 sm:-translate-x-16 sm:opacity-0">
                            <Button size={"icon-sm"} title="Edit Book" variant={"outline"} onClick={() => setIsEditDialogOpen(true)}>
                                <Edit2 className="size-3.5" />
                            </Button>
                            <Button size={"icon-sm"} title="Delete Book" variant={"destructive"} onClick={() => setIsDeleteDialogOpen(true)}>
                                <Trash2 className="size-3.5" />
                            </Button>
                        </div>
                    </div>

                    <Link
                        href={`/?bookId=${id}`}
                        className="inline-flex flex-1 items-center justify-end gap-3 text-xs font-semibold tracking-wide text-emerald-500 transition-colors hover:text-emerald-400"
                    >
                        <span className="relative flex h-4 w-5 overflow-hidden">
                            <Play className="absolute inset-0 size-4 fill-emerald-500 stroke-none transition-all duration-300 ease-in-out group-hover:translate-x-1.5 group-hover:opacity-85" />
                            <Play className="absolute inset-0 size-4 -translate-x-full fill-emerald-500 stroke-none opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-50" />
                        </span>

                        <span>Start Reading</span>
                    </Link>
                </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-106.25">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Edit Book Details</DialogTitle>
                            <DialogDescription className="text-xs">Update the name of your catalog entry. Click save when you&apos;re done.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Book Name" required disabled={isLoading} />
                        </div>
                        <DialogFooter>
                            <Button className="text-xs" type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button className="text-xs" type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <span className="text-foreground font-semibold">&ldquo;{name}&rdquo;</span> from your library. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSubmit} disabled={isLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isLoading ? "Deleting..." : "Delete Book"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
