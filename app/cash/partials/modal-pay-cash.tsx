import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Modal from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/libs/utils";
import { IUserCash, IUserForm } from "@/types";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ModalProps {
    monthSelected: string;
    listMember: IUserForm[];
    isOpen: boolean;
    onClose: () => void;
    tableCashDues: IUserCash[];
    onSuccess: () => void;
}
export default function ModalPayCash({ isOpen, onClose, monthSelected, listMember, tableCashDues, onSuccess }: ModalProps) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [idPaySelected, setIdPaySelected] = useState<string>("");
    const [payments, setPayments] = useState(["", "", "", ""]);

    useEffect(() => {
        if (!isOpen) return;
        const wait = setTimeout(() => {
            setIdPaySelected("");
            setPayments(["", "", "", ""]);
        }, 0);
        return () => clearTimeout(wait);
    }, [isOpen]);

    return (
        <Modal
            open={isOpen}
            onOpenChange={() => {
                if (!isLoading) onClose();
            }}
            title="Bayar iuran kas"
            description="pilih anggota yang membayar..."
        >
            <div className="flex flex-col">
                <Select
                    value={idPaySelected}
                    onValueChange={(val) => {
                        setIdPaySelected(val);
                        const found = tableCashDues.find((t) => t.idUser === val)?.cashInfo;
                        setPayments(found && found.length > 0 ? found : ["", "", "", ""]);
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih anggota..." />
                    </SelectTrigger>

                    <SelectContent>
                        {listMember.map((mmbr, idx) => (
                            <SelectItem key={idx} value={mmbr.nis}>
                                {mmbr.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex gap-2 mt-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <p key={idx} className="flex-1 font-semibold opacity-50 text-center">
                            M {idx + 1}
                        </p>
                    ))}
                </div>
                <div className="flex justify-evenly gap-2">
                    {Array.from({ length: 4 }).map((_, ix) => {
                        const paid = payments[ix] !== "";

                        return (
                            <div key={ix} className={cn("flex-1 flex justify-center", !idPaySelected ? "opacity-30" : "")}>
                                <button
                                    onClick={() =>
                                        setPayments((prev) => {
                                            const old = [...prev];
                                            old[ix] = old[ix] === "" ? dayjs().toISOString() : "";
                                            return old;
                                        })
                                    }
                                    disabled={!idPaySelected}
                                >
                                    <Icon icon={paid ? "SquareCheckBig" : "Square"} className={cn("w-10 h-10", paid ? "fill-primary" : "fill-slate-200")} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-4 border-t pt-4 border-primary">
                <Button variant={"destructive"} disabled={isLoading} onClick={onClose}>
                    Batal
                </Button>
                <Button
                    loading={isLoading}
                    onClick={async () => {
                        const newData: IUserCash[] = tableCashDues.some((t) => t.idUser === idPaySelected)
                            ? tableCashDues.map((t) =>
                                  t.idUser === idPaySelected
                                      ? { ...t, cashInfo: payments } // overwrite
                                      : t
                              )
                            : [
                                  ...tableCashDues,
                                  {
                                      idUser: idPaySelected,
                                      cashInfo: payments,
                                  },
                              ];

                        setLoading(true);
                        try {
                            const res = await fetch("/api/cash-dues", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ fileName: monthSelected, data: newData }),
                            });

                            const result = await res.json();

                            if (!res.ok) {
                                console.error("Save failed:", result);
                                toast("Gagal update iuran", { autoClose: 6000 });
                                return;
                            }

                            console.log("Saved:", result);
                            toast("Iuran berhasil ditambahkan", { autoClose: 6000 });
                            onSuccess();
                        } catch (err) {
                            console.error("Network error:", err);
                            toast("Terjadi kesalahan", { autoClose: 6000 });
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    Simpan
                </Button>
            </div>
        </Modal>
    );
}
