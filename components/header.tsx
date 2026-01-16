import { cookies } from "next/headers";
import { Icon } from "./ui/icon";
import { cn } from "@/libs/utils";

export default async function HeaderHero({ className = "", description }: { className?: string; description?: string }) {
    const cookieStore = await cookies();
    const name = cookieStore.get("class-name")?.value ?? "Class";
    const token = cookieStore.get("token");

    return (
        <div className={cn("my-4 px-4 flex flex-col justify-center items-center", className)}>
            <div className="flex justify-center items-center gap-4">
                {token && (
                    <form action="/api/logout" method="POST" className="text-destructive">
                        <button className="grid place-content-center">
                            <Icon icon="LogOut" strokeWidth={3} />
                        </button>
                    </form>
                )}
                <h1 className="font-bold text-2xl text-center">{name}</h1>
            </div>
            {description && <p className="text-center italic opacity-70 text-sm">{description}</p>}
        </div>
    );
}
