"use client";
import { Button } from "@/components/ui/button";
import ConfirmDialog, { ConfirmDialogHandles } from "@/components/ui/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/libs/utils";
import { IDayGroup, IUserForm } from "@/types";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const DAY_BG_MAP: Record<string, string> = {
    Senin: "bg-blue-300",
    Selasa: "bg-green-300",
    Rabu: "bg-yellow-300",
    Kamis: "bg-purple-300",
    Jumat: "bg-pink-300",
    Sabtu: "bg-orange-300",
    Minggu: "bg-red-300",
};

export default function ManualGroup({ listMember, onClose }: { listMember: IUserForm[]; onClose: () => void }) {
    const router = useRouter();
    const [isLoading, setLoading] = useState<boolean>(false);
    // const [selectedDays, setSelectedDays] = useState<string[]>([]);
    // const [groups, setGroups] = useState<IDayGroup[]>([]);

    const [userDayMap, setUserDayMap] = useState<Record<string, string>>({});
    const groups: IDayGroup[] = DAYS.map((day) => ({
        day,
        members: listMember.filter((m) => userDayMap[m.nis] === day),
    })).filter((g) => g.members.length > 0);

    const confirmSaveRef = useRef<ConfirmDialogHandles>(null);
    return (
        <>
            <div className="grid grid-cols-2 gap-4 bg-black/50 py-2 px-4">
                {DAYS.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className={cn("w-4 h-4 rounded-md", DAY_BG_MAP[d])}></span>
                        <p className="text-xs font-medium">{d}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-1 mt-5">
                {listMember.map((user, iu) => (
                    <div
                        key={iu}
                        className={cn("flex items-center gap-1 py-1 px-4 transition-colors", userDayMap[user.nis] ? DAY_BG_MAP[userDayMap[user.nis]] : "")}
                    >
                        <p className="flex-1 line-clamp-1 font-medium">{user.name}</p>
                        <Select
                            value={userDayMap[user.nis] ?? ""}
                            onValueChange={(day) =>
                                setUserDayMap((prev) => ({
                                    ...prev,
                                    [user.nis]: day,
                                }))
                            }
                        >
                            <SelectTrigger className="w-32 h-7">
                                <SelectValue placeholder="Pilih Hari" />
                            </SelectTrigger>

                            <SelectContent>
                                {DAYS.map((day) => (
                                    <SelectItem key={day} value={day}>
                                        {day}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-6">
                {groups.length > 0 && (
                    <Button onClick={() => confirmSaveRef.current?.open()} loading={isLoading}>
                        <Icon icon="Save" /> Simpan Kelompok Baru
                    </Button>
                )}
            </div>
            <ConfirmDialog
                ref={confirmSaveRef}
                title="Apakah anda yakin?"
                description="Menyimpan kelompok piket terbaru"
                textCancel="Cek kembali"
                textSubmit="Ya, Simpan"
                onConfirm={async () => {
                    setLoading(true);
                    try {
                        const res = await fetch("/api/duty-info", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(groups),
                        });

                        const result = await res.json();

                        if (!res.ok) {
                            console.error("Save failed:", result);
                            toast("Gagal menyimpan data", { autoClose: 6000 });
                            return;
                        }

                        console.log("Saved:", result);
                        toast("Data berhasil disimpan", { autoClose: 6000 });
                        router.refresh();
                        onClose();
                    } catch (err) {
                        console.error("Network error:", err);
                        toast("Terjadi kesalahan", { autoClose: 6000 });
                    } finally {
                        setLoading(false);
                    }
                }}
            />
        </>
    );
}
