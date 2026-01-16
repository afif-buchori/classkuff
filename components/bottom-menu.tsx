import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icon } from "./ui/icon";
import Link from "next/link";

export default function BottomMenu() {
    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-16 bg-white flex justify-evenly items-center gap-4 px-4 pt-2 pb-5 z-30 shadow-[0_-6px_16px_rgba(0,0,0,0.11)]">
            <Link href={"/"} className="flex flex-col items-center">
                <Icon icon="HandCoins" strokeWidth={2.5} className="w-5 h-5" />
                <p className="text-xs font-medium">Uang Kas Kelas</p>
            </Link>
            <Popover>
                <PopoverTrigger asChild>
                    <button className="flex flex-col items-center">
                        <Icon icon="Menu" strokeWidth={2.5} className="w-8 h-8" />
                        {/* <p className="text-xs font-medium">Menu</p> */}
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-50">
                    <h4 className="font-semibold">Informasi</h4>
                    <p className="text-muted-foreground">Ini popover reusable</p>
                </PopoverContent>
            </Popover>
            <Link href={"/member"} className="flex flex-col items-center">
                <Icon icon="ListOrdered" strokeWidth={2.5} className="w-5 h-5" />
                <p className="text-xs font-medium">Data Anggota</p>
            </Link>
        </div>
    );
}
