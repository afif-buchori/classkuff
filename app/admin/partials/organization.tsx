"use client";

import { Button } from "@/components/ui/button";
import ConfirmDialog, { ConfirmDialogHandles } from "@/components/ui/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uuidv4 } from "@/libs/utils";
import { IDataClassInfo } from "@/types";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface OrganizationProps {
    classInfo: IDataClassInfo;
}

export default function Organization({ classInfo }: OrganizationProps) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [form, setForm] = useState<IDataClassInfo>({
        name: classInfo.name ?? "",
        titles: classInfo.titles ?? [],
    });

    const confirmDeleteRef = useRef<ConfirmDialogHandles>(null);
    const confirmSaveRef = useRef<ConfirmDialogHandles>(null);

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    confirmSaveRef.current?.open();
                }}
                className="flex flex-col gap-4 px-4"
            >
                <div className="flex justify-end">
                    {isEdit ? (
                        <Button
                            variant={"destructive"}
                            disabled={isLoading}
                            onClick={() => {
                                const dataDB = JSON.stringify(classInfo);
                                const dataForm = JSON.stringify(form);
                                if (dataDB !== dataForm) return confirmDeleteRef.current?.open();
                                setEdit(false);
                                setForm(classInfo);
                            }}
                        >
                            <Icon icon="X" strokeWidth={2} />
                            Cancel
                        </Button>
                    ) : (
                        <Button variant={"success"} onClick={() => setEdit(true)}>
                            <Icon icon="PencilLine" strokeWidth={2} />
                            Edit
                        </Button>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <Label>Nama kelas</Label>
                    <Input
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEdit}
                        placeholder="Nama kelas..."
                        className="disabled:text-foreground disabled:font-semibold"
                    />
                </div>
                {form.titles.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between pr-1">
                            <Label>Nama jabatan - {idx + 1}</Label>
                            {isEdit && (
                                <button
                                    disabled={isLoading}
                                    onClick={() => setForm((prev) => ({ ...prev, titles: prev.titles.filter((t) => t.id != item.id) }))}
                                    className="text-destructive"
                                >
                                    <Icon icon="Trash2" strokeWidth={2} />
                                </button>
                            )}
                        </div>
                        <Input
                            value={item.title}
                            onChange={(e) =>
                                setForm((prev) => {
                                    const prevData = form.titles;
                                    prevData[idx].title = e.target.value;
                                    return { ...prev, titles: prevData };
                                })
                            }
                            disabled={!isEdit}
                            placeholder="Nama jabatan..."
                            className="disabled:text-foreground disabled:font-semibold"
                        />
                    </div>
                ))}
                {isEdit && (
                    <>
                        <Button
                            type="button"
                            variant={"success"}
                            disabled={isLoading}
                            onClick={() => setForm((prev) => ({ ...prev, titles: [...prev.titles, { id: uuidv4(), title: "" }] }))}
                            className="mt-6"
                        >
                            <Icon icon="Plus" />
                            Tambah Jabatan
                        </Button>
                        <Button loading={isLoading} className="mt-8">
                            <Icon icon="Save" />
                            Simpan
                        </Button>
                    </>
                )}
            </form>

            <ConfirmDialog
                ref={confirmDeleteRef}
                title="Apakah anda yakin?"
                description="Data yang sudah anda edit akan di reset"
                textCancel="Cek kembali"
                textSubmit="Ya"
                onConfirm={() => {
                    setEdit(false);
                    setForm(classInfo);
                }}
            />

            <ConfirmDialog
                ref={confirmSaveRef}
                title="Apakah anda yakin?"
                description="Menyimpan semua data organisasi kelas"
                textCancel="Cek kembali"
                textSubmit="Ya, Simpan"
                onConfirm={async () => {
                    setLoading(true);
                    try {
                        const res = await fetch("/api/class-info", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(form),
                        });

                        const result = await res.json();

                        if (!res.ok) {
                            console.error("Save failed:", result);
                            toast("Gagal menyimpan data", { autoClose: 6000 });
                            return;
                        }

                        console.log("Saved:", result);
                        toast("Data berhasil disimpan", { autoClose: 6000 });
                        setEdit(false);
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
