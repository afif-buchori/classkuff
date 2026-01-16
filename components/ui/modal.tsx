"use client";

import { cn } from "@/libs/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children: ReactNode;
    width?: string; // contoh: max-w-md | max-w-xl
    className?: string;
}

export default function Modal({ open, onOpenChange, title, description, children, width = "max-w-md", className = "" }: ModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        {/* Overlay */}
                        <Dialog.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        </Dialog.Overlay>

                        {/* Content */}
                        <Dialog.Content asChild>
                            <motion.div
                                className={cn(
                                    "fixed z-50 left-1/2 top-1/2 w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl p-3 md:p-6",
                                    width,
                                    className
                                )}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                {/* Header */}
                                {(title || description) && (
                                    <div className="mb-4">
                                        {title && <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>}
                                        {description && <Dialog.Description className="text-sm text-gray-500">{description}</Dialog.Description>}
                                    </div>
                                )}

                                {/* Close Button */}
                                <Dialog.Close asChild>
                                    <button className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100">
                                        <X size={18} />
                                    </button>
                                </Dialog.Close>

                                {/* Content */}
                                <div>{children}</div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
