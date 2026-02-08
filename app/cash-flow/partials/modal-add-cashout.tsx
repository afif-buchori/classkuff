import Modal from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface ModalProps {
    listMonth: string[];
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalAddCashout({ isOpen, onClose, listMonth }: ModalProps) {
    const router = useRouter();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [form, setForm] = useState({
        month: listMonth[listMonth.length - 1],
        date: "",
        amount: "",
        note: "",
    });

    return (
        <Modal
            open={isOpen}
            onOpenChange={() => {
                if (!isLoading) onClose();
            }}
            title="Tambah Pengeluaran Kas"
            description="isi detail pengeluaran kas kelas..."
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <div className="w-28 sm:w-32">
                        <Select value={form.date} onValueChange={(val) => setForm((old) => ({ ...old, date: val }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tanggal..." />
                            </SelectTrigger>

                            <SelectContent>
                                {Array.from({ length: 31 }).map((_, idx) => (
                                    <SelectItem key={idx} value={(idx + 1).toString()}>
                                        {idx + 1}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <Select value={form.month} onValueChange={(val) => setForm((old) => ({ ...old, month: val }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Bulan..." />
                            </SelectTrigger>

                            <SelectContent>
                                {listMonth.map((mnth, idx) => (
                                    <SelectItem key={idx} value={mnth}>
                                        {mnth}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <Label>Nominal pengeluaran</Label>
                    <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={form.amount}
                        onChange={(e) => {
                            let val = e.target.value;
                            // hanya izinkan angka
                            if (!/^\d*$/.test(val)) return;
                            // hapus leading zero (kecuali kalau cuma "0")
                            if (val.length > 1) val = val.replace(/^0+/, "");
                            setForm((old) => ({ ...old, amount: val }));
                        }}
                        placeholder="cth: 1000.."
                    />
                </div>
                <div>
                    <Label>Keperluan / Catatan</Label>
                    <Textarea value={form.note} onChange={(e) => setForm((old) => ({ ...old, note: e.target.value }))} placeholder="digunakan untuk?..." />
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-4 border-t pt-4 border-primary">
                <Button variant={"destructive"} disabled={isLoading} onClick={onClose}>
                    Batal
                </Button>
                <Button
                    loading={isLoading}
                    disabled={!form.date || !form.month || !form.amount}
                    onClick={async () => {
                        setLoading(true);

                        try {
                            const res = await fetch("/api/cash-out", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    month: form.month,
                                    date: form.date,
                                    amount: Number(form.amount ?? 0),
                                    note: form.note,
                                }),
                            });

                            const result = await res.json();

                            if (!res.ok) {
                                console.error("Save failed:", result);
                                toast("Gagal update iuran", { autoClose: 6000 });
                                return;
                            }

                            console.log("Saved:", result);
                            toast("Iuran berhasil ditambahkan", { autoClose: 6000 });
                            onClose();
                            router.refresh();
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
