"use client";
import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import ConfirmDialog, { ConfirmDialogHandles } from "@/components/ui/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import Modal from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/libs/utils";
import { IUserCash, IUserForm } from "@/types";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ModalPayCash from "./modal-pay-cash";

const initialMonth = "Januari 2025";
const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function getDefaultMonth(months: string[]): string {
    const currentMonth = dayjs().format("MMMM YYYY");

    if (months.includes(currentMonth)) {
        return currentMonth;
    }

    return months[months.length - 1] ?? "";
}

export default function CashTable({ listMember }: { listMember: IUserForm[] }) {
    const [nextMonth, setNextMonth] = useState<string>(initialMonth);
    const [isAddingMonth, setIsAddingMonth] = useState<boolean>(false);
    const [listMonth, setListMonth] = useState<string[]>([]);
    const [monthSelected, setMonthSelected] = useState(() => getDefaultMonth(listMonth));
    const [tableCash, setTableCash] = useState<IUserCash[]>(() =>
        listMember.map((m) => ({
            idUser: m.nis,
            cashInfo: [],
        }))
    );

    const fetchListMonth = async () => {
        const res = await fetch("/api/cash-dues/month", { cache: "no-store" });
        const data = await res.json();
        setListMonth(data.months);
        setMonthSelected(getDefaultMonth(data.months));
        if (data.months.length > 0) setNextMonth(getNextMonth(data.months[data.months.length - 1]));
    };
    useEffect(() => {
        fetchListMonth();
    }, []);

    const fetchDetailMonth = async () => {
        const res = await fetch(`/api/cash-dues/month/${monthSelected}?t=${Date.now()}`, { cache: "no-store" });
        const data = await res.json();
        setTableCash(
            listMember.map((m) => ({ idUser: m.nis, cashInfo: (data.data as IUserCash[]).find((du) => du.idUser === m.nis)?.cashInfo ?? ["", "", "", ""] }))
        );
    };
    useEffect(() => {
        if (!monthSelected) return;
        fetchDetailMonth();
    }, [monthSelected]);

    const confirmNewMonthRef = useRef<ConfirmDialogHandles>(null);
    const [isOpenPay, setOpenPay] = useState<boolean>(false);

    return (
        <>
            <BackButton>
                <Button variant={"secondary"} onClick={() => setOpenPay(true)} disabled={isAddingMonth} className="ml-auto mr-4">
                    Bayar <Icon icon="HandCoins" />
                </Button>
            </BackButton>
            <div className="px-4 mb-4 flex gap-2">
                <Button onClick={() => confirmNewMonthRef.current?.open()} loading={isAddingMonth}>
                    Tambah Bulan
                </Button>
                {listMonth.length > 0 && (
                    <Select value={monthSelected} onValueChange={(val) => setMonthSelected(val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Bulan" />
                        </SelectTrigger>

                        <SelectContent>
                            {listMonth.map((month, idx) => (
                                <SelectItem key={idx} value={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
            {listMonth.length > 0 && (
                <div className="flex flex-col">
                    <div className="bg-primary/20 p-2 flex items-center gap-2 opacity-50 font-semibold">
                        <p className="flex-1 line-clamp-1 text-sm">Nama</p>
                        <div className="flex gap-1 w-full max-w-[108px]">
                            <p className="flex-1 text-xs text-center">M1</p>
                            <p className="flex-1 text-xs text-center">M2</p>
                            <p className="flex-1 text-xs text-center">M3</p>
                            <p className="flex-1 text-xs text-center">M4</p>
                        </div>
                    </div>
                    {tableCash.map((item, idx) => {
                        const dataUser = listMember.find((m) => m.nis === item.idUser);
                        return (
                            <div key={idx} className="border-t border-secondary p-2 flex items-center gap-2">
                                <div className="flex-1 flex flex-col">
                                    <p className="text-xs opacity-50">{dataUser?.nis}</p>
                                    <p className="line-clamp-1">{dataUser?.name}</p>
                                </div>
                                <div className="flex gap-1">
                                    {item.cashInfo.map((p, ix) => {
                                        const paid = p !== "";

                                        return (
                                            <div key={ix}>
                                                <Icon
                                                    icon={paid ? "SquareCheckBig" : "Square"}
                                                    className={cn("w-6 h-6", paid ? "fill-primary" : "fill-slate-200")}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ModalPayCash
                monthSelected={monthSelected}
                isOpen={isOpenPay}
                onClose={() => {
                    setOpenPay(false);
                }}
                listMember={listMember}
                tableCashDues={tableCash}
                onSuccess={() => {
                    fetchDetailMonth();
                    setOpenPay(false);
                }}
            />

            <ConfirmDialog
                ref={confirmNewMonthRef}
                title="Apakah anda yakin?"
                description={`Menambahkan bulan ${nextMonth}`}
                textCancel="Batal"
                textSubmit="Ya, Tambah"
                onConfirm={async () => {
                    setIsAddingMonth(true);
                    try {
                        const res = await fetch("/api/cash-dues/month", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ filename: nextMonth.replaceAll(" ", "-") }),
                        });

                        const result = await res.json();

                        if (!res.ok) {
                            console.error("Save failed:", result);
                            toast("Gagal tambah bulan", { autoClose: 6000 });
                            return;
                        }

                        console.log("Saved:", result);
                        toast("Bulan berhasil ditambahkan", { autoClose: 6000 });
                        fetchListMonth();
                        setNextMonth((prev) => getNextMonth(prev));
                    } catch (err) {
                        console.error("Network error:", err);
                        toast("Terjadi kesalahan", { autoClose: 6000 });
                    } finally {
                        setIsAddingMonth(false);
                    }
                }}
            />
        </>
    );
}

function getNextMonth(value: string): string {
    const [monthName, yearStr] = value.split("-");
    const year = Number(yearStr);

    const monthIndex = MONTHS_ID.indexOf(monthName);
    if (monthIndex === -1) throw new Error("Format bulan tidak valid");

    let nextMonthIndex = monthIndex + 1;
    let nextYear = year;

    if (nextMonthIndex === 12) {
        nextMonthIndex = 0;
        nextYear += 1;
    }

    return `${MONTHS_ID[nextMonthIndex]} ${nextYear}`;
}
