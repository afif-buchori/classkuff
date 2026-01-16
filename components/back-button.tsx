"use client";

import { cn } from "@/libs/utils";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { useRouter } from "next/navigation";

export default function BackButton({ routeBack, className = "", children }: { routeBack?: string; className?: string; children?: React.ReactNode }) {
    const router = useRouter();

    return (
        <div className={cn("flex items-center gap-4 mb-2", className)}>
            <Button variant={"ghost"} onClick={() => router.push(routeBack ?? "/")} className="opacity-70">
                <Icon icon="ChevronLeft" />
                Back
            </Button>
            {children}
        </div>
    );
}
