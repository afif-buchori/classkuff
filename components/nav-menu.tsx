"use client";

import Link from "next/link";
import { Icon } from "./ui/icon";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NavMenu() {
    const router = useRouter();
    const [opacity, setOpacity] = useState<number>(0.7);
    useEffect(() => {
        if (opacity === 0.2) router.replace("admin");
    }, [opacity]);

    return (
        <div className="w-4/5 mx-auto my-5 border-2 border-primary rounded-2xl p-4 pt-6 grid grid-cols-4 text-center bg-white shadow-lg relative">
            <span
                onClick={() => setOpacity((prev) => Math.max(0, +(prev - 0.1).toFixed(1)))}
                style={{ color: `rgba(0, 0, 0, ${opacity})` }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white border-2 border-primary text-xs font-bold"
            >
                MENU
            </span>
            {/* <Link href={"/member"} className="flex flex-col items-center">
                <Icon icon="AlignVerticalJustifyCenter" strokeWidth={2.5} className="w-5 h-5" />
                <p className="mt-2 text-[10px] leading-3 font-medium">Sruktur Organisasi</p>
            </Link> */}
            <Link href={"/member"} className="flex flex-col items-center">
                <Icon icon="ListOrdered" strokeWidth={2.5} className="w-5 h-5" />
                <p className="mt-2 text-[10px] leading-3 font-medium">Data Anggota</p>
            </Link>
            <Link href={"/duty"} className="flex flex-col items-center">
                <Icon icon="CalendarDays" strokeWidth={2.5} className="w-5 h-5" />
                <p className="mt-2 text-[10px] leading-3 font-medium">Jadwal Piket</p>
            </Link>
            <Link href={"/cash"} className="flex flex-col items-center">
                <Icon icon="HandCoins" strokeWidth={2.5} className="w-5 h-5" />
                <p className="mt-2 text-[10px] leading-3 font-medium">Uang Kas Kelas</p>
            </Link>
            <Link href={"/cash-flow"} className="flex flex-col items-center">
                <Icon icon="Receipt" strokeWidth={2.5} className="w-5 h-5" />
                <p className="mt-2 text-[10px] leading-3 font-medium">Catatan Keuangan</p>
            </Link>
        </div>
    );
}
