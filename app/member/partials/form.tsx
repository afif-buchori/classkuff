"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IDataOrganization, IUserForm } from "@/types";
import React, { useEffect, useState } from "react";

interface FormMemberProps {
    isOpen: boolean;
    listMember: IUserForm[];
    dataTitles: IDataOrganization[];
    dataEdit: IUserForm | null;
    onSave: (data: IUserForm) => void;
    onClose: () => void;
}

export default function FormMember({ isOpen, listMember, dataTitles, dataEdit, onSave, onClose }: FormMemberProps) {
    const [form, setForm] = useState<IUserForm>({ nis: "", name: "", gender: "", title: "Anggota" });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!dataEdit) return;
        const timer = setTimeout(() => {
            setForm(dataEdit);
        }, 0);
        return () => clearTimeout(timer);
    }, [dataEdit]);

    return (
        isOpen && (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!form.nis) return setError("Nomor induk masih kosong !");
                    if (!form.name) return setError("Nama lengkap masih kosong !");
                    if (!form.gender) return setError("Jenis kelamin belum dipilih !");
                    if (!dataEdit) {
                        const isExist = listMember.some((item) => item.nis === form.nis);
                        if (isExist) return setError("Nomor induk sudah terdaftar");
                    }
                    setError(null);
                    onSave(form);
                    setForm({ nis: "", name: "", gender: "", title: "Anggota" });
                }}
                className="flex flex-col gap-4 px-4"
            >
                <div>
                    <Label>Nomor induk</Label>
                    <Input
                        value={form.nis}
                        onChange={(e) => setForm((prev) => ({ ...prev, nis: e.target.value }))}
                        placeholder="Nomor induk..."
                        disabled={!!dataEdit}
                        autoFocus
                    />
                </div>
                <div>
                    <Label>Nama Lengkap</Label>
                    <Input
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nama Lengkap..."
                        autoFocus={!!dataEdit}
                    />
                </div>
                <div>
                    <Label>Jabatan kelas</Label>
                    <Select value={form.title} onValueChange={(val) => setForm((prev) => ({ ...prev, title: val }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih gender" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="Anggota">Anggota</SelectItem>
                            {dataTitles.map((ttl) => (
                                <SelectItem key={ttl.id} value={ttl.title}>
                                    {ttl.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Jenis kelamin</Label>
                    <div className="flex">
                        <Button
                            type="button"
                            variant={form.gender === "L" ? "default" : "ghost"}
                            onClick={() => setForm((prev) => ({ ...prev, gender: "L" }))}
                            className="flex-1 rounded-r-none border"
                        >
                            Laki - laki
                            <Icon icon="Check" strokeWidth={3} className={form.gender === "L" ? "" : "opacity-0"} />
                        </Button>
                        <Button
                            type="button"
                            variant={form.gender === "P" ? "default" : "ghost"}
                            onClick={() => setForm((prev) => ({ ...prev, gender: "P" }))}
                            className="flex-1 rounded-l-none border"
                        >
                            Perempuan
                            <Icon icon="Check" strokeWidth={3} className={form.gender === "P" ? "" : "opacity-0"} />
                        </Button>
                    </div>
                </div>
                <p className="h-5 text-destructive italic text-center">{error}</p>
                <div className="flex gap-4 mt-5">
                    <Button
                        type="button"
                        variant={"destructive"}
                        onClick={() => {
                            setForm({ nis: "", name: "", gender: "", title: "Anggota" });
                            onClose();
                        }}
                    >
                        <Icon icon="X" /> Batal
                    </Button>
                    <Button className="flex-1">
                        <Icon icon="Save" /> Tambahkan
                    </Button>
                </div>
            </form>
        )
    );
}
