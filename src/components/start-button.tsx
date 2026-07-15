"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlayIcon, SquareIcon } from "lucide-react";

type StartButtonProps = { type: "start"; disabled: boolean; onClick: () => void } | { type: "stop"; disabled: boolean; onClick: () => void };

export function StartButton(props: StartButtonProps) {
    const isStop = props.type === "stop";

    return (
        <Button
            size="icon"
            onClick={props.onClick}
            disabled={props.disabled}
            className={cn(
                "size-20 rounded-full p-0 transition-all duration-300",
                props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105 active:scale-95",
                isStop && !props.disabled && "hover:bg-destructive",
            )}
        >
            {isStop ? <SquareIcon className="size-7" /> : <PlayIcon className="ml-0.5 size-8" />}
        </Button>
    );
}
