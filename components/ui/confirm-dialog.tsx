"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";

export interface ConfirmDialogHandles {
    open: () => void;
    close: () => void;
}

interface ConfirmDialogProps {
    title?: string;
    description?: string;
    textCancel?: string;
    textSubmit?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

const ConfirmDialog = React.forwardRef<ConfirmDialogHandles, ConfirmDialogProps>(
    ({ title = "Are you sure?", description = "This action cannot be undone.", textCancel = "Cancel", textSubmit = "Confirm", onConfirm, onCancel }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);

        // expose methods
        React.useImperativeHandle(ref, () => ({
            open: () => setIsOpen(true),
            close: () => setIsOpen(false),
        }));

        return (
            <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel?.()}>
                <AnimatePresence>
                    {isOpen && (
                        <Dialog.Portal forceMount>
                            {/* Backdrop */}
                            <Dialog.Overlay asChild forceMount>
                                <motion.div
                                    className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            </Dialog.Overlay>

                            {/* Content */}
                            <Dialog.Content asChild forceMount>
                                <motion.div
                                    className="fixed top-1/2 left-1/2 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg"
                                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
                                    <Dialog.Description className="text-sm text-gray-500 mt-1">{description}</Dialog.Description>

                                    <div className="mt-6 flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                onCancel?.();
                                                setIsOpen(false);
                                            }}
                                        >
                                            {textCancel}
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                onConfirm?.();
                                                setIsOpen(false);
                                            }}
                                        >
                                            {textSubmit}
                                        </Button>
                                    </div>
                                </motion.div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    )}
                </AnimatePresence>
            </Dialog.Root>
        );
    }
);

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;
