import { cn } from "@/libs/utils";
import * as lucideIcons from "lucide-react";
import { type LucideProps } from "lucide-react";
export const { icons } = lucideIcons;

interface IconProps extends Omit<LucideProps, "ref"> {
    icon: keyof typeof icons;
}

export function Icon({ icon, className, ...props }: IconProps) {
    const LucideIcon = typeof icon === "string" ? icons[icon] : icon;

    if (!LucideIcon) return null;

    return <LucideIcon className={cn("h-4 w-4", className)} {...props} />;
}
