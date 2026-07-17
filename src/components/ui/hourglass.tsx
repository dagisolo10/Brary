"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface HourglassIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface HourglassIconProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
    isAnimating?: boolean; // Force the animation state externally
    infinite?: boolean; // Determine if the forced animation loops continuously
}

const HourglassIcon = forwardRef<HourglassIconHandle, HourglassIconProps>(({ onMouseEnter, onMouseLeave, className, size = 24, isAnimating = false, infinite = true, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
        isControlledRef.current = true;
        return {
            startAnimation: () => controls.start("animate"),
            stopAnimation: () => controls.start("normal"),
        };
    });

    useEffect(() => {
        if (isAnimating) {
            controls.start(infinite ? "infinite" : "animate");
        } else {
            controls.start("normal");
        }
    }, [isAnimating, infinite, controls]);

    const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (isAnimating) return;

            if (isControlledRef.current) {
                onMouseEnter?.(e);
            } else {
                controls.start("animate");
            }
        },
        [controls, isAnimating, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (isAnimating) return;

            if (isControlledRef.current) {
                onMouseLeave?.(e);
            } else {
                controls.start("normal");
            }
        },
        [controls, isAnimating, onMouseLeave],
    );

    return (
        <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
            <svg fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg">
                <motion.g
                    animate={controls}
                    style={{
                        transformOrigin: "12px 12px",
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 1,
                    }}
                    variants={{
                        normal: {
                            rotate: 0,
                            transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                            },
                        },
                        animate: {
                            rotate: 180,
                            transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                            },
                        },
                        infinite: {
                            rotate: [0, 180, 180, 360, 360],
                            transition: {
                                duration: 3,
                                ease: "easeInOut",
                                repeat: Infinity,
                                times: [0, 0.3, 0.5, 0.8, 1],
                            },
                        },
                    }}
                >
                    <path d="M5 22h14" />
                    <path d="M5 2h14" />
                    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                </motion.g>
            </svg>
        </div>
    );
});

HourglassIcon.displayName = "HourglassIcon";

export { HourglassIcon };
