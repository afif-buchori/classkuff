"use client";

import { Button } from "@/components/ui/button";
import ConfirmDialog, { ConfirmDialogHandles } from "@/components/ui/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/libs/utils";
import { IDayGroup, IUserForm } from "@/types";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function GenerateGroup({ listMember, onClose }: { listMember: IUserForm[]; onClose: () => void }) {
    const router = useRouter();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [groups, setGroups] = useState<IDayGroup[]>([]);

    function toggleDay(day: string) {
        setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
    }

    function generateDayGroups(members: IUserForm[], days: string[]): IDayGroup[] {
        if (days.length === 0) return [];

        const groups: IDayGroup[] = days.map((day) => ({
            day,
            members: [],
        }));

        members.forEach((member, index) => {
            groups[index % days.length].members.push(member);
        });

        return groups;
    }

    function handleGenerate() {
        if (selectedDays.length === 0) return;
        setLoading(true);
        setTimeout(() => {
            // random DI EVENT (AMAN)
            const shuffled = [...listMember].sort(() => Math.random() - 0.5);
            setGroups(generateDayGroups(shuffled, selectedDays));
            setLoading(false);
        }, 2000);
    }

    const confirmSaveRef = useRef<ConfirmDialogHandles>(null);

    return (
        <>
            {/* PILIH HARI */}
            <div className="grid grid-cols-3 gap-1 px-4">
                {DAYS.map((day) => (
                    <Button
                        key={day}
                        variant={selectedDays.includes(day) ? "default" : "outline"}
                        onClick={() => toggleDay(day)}
                        className={selectedDays.includes(day) ? "opacity-100" : "opacity-70"}
                    >
                        <Icon
                            icon="Check"
                            strokeWidth={3}
                            className={cn("transition-all duration-300", selectedDays.includes(day) ? "opacity-100" : "opacity-0")}
                        />
                        {day}
                    </Button>
                ))}
            </div>

            {/* HASIL */}
            <div className="grid grid-cols-2 gap-2 mt-5 px-4">
                {groups.map((grp) => (
                    <div key={grp.day} className="">
                        <p className="text-xs font-semibold border-b border-t border-secondary opacity-70 px-1 mb-1">{grp.day}</p>
                        {grp.members.map((m) => (
                            <p key={m.nis} className="text-sm font-medium line-clamp-1 px-1">
                                {m.name}
                            </p>
                        ))}
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-6 px-4 mt-4">
                <Button variant={"secondary"} onClick={handleGenerate} loading={isLoading} disabled={selectedDays.length === 0}>
                    <Icon icon="Shuffle" /> Buat Grup
                </Button>
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
