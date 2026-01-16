"use client";
import FormMember from "@/app/member/partials/form";
import { Button } from "@/components/ui/button";
import ConfirmDialog, { ConfirmDialogHandles } from "@/components/ui/confirm-dialog";
import { Icon } from "@/components/ui/icon";
import { IDataOrganization, IUserForm } from "@/types";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function MemberPageClient({ dataTitles, listMember, isAdmin }: { dataTitles: IDataOrganization[]; listMember: IUserForm[]; isAdmin: boolean }) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isNew, setNew] = useState<boolean>(false);
    const [dataMember, setDataMember] = useState<IUserForm[]>(listMember ?? []);
    const [idSelected, setIdSelected] = useState<string>("");
    const [isOpenForm, setOpenForm] = useState<boolean>(false);
    const toggleOpenForm = () => setOpenForm(!isOpenForm);

    const confirmDeleteRef = useRef<ConfirmDialogHandles>(null);
    const confirmSaveRef = useRef<ConfirmDialogHandles>(null);

    return (
        <>
            {!isOpenForm ? (
                <div className="flex flex-col">
                    {dataMember.map((item, idx) => (
                        <div key={idx} className="border-t flex flex-col px-4 py-1 relative">
                            <p>
                                <span className="italic opacity-50 font-medium">{item.gender} </span>
                                {item.nis}
                            </p>
                            <p>{item.name}</p>
                            {isAdmin && (
                                <div className="flex gap-4 absolute top-2 right-4">
                                    <button
                                        onClick={() => {
                                            setIdSelected(item.nis);
                                            confirmDeleteRef.current?.open();
                                        }}
                                    >
                                        <Icon icon="Trash2" strokeWidth={3} className="text-destructive" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIdSelected(item.nis);
                                            setOpenForm(true);
                                        }}
                                    >
                                        <Icon icon="PencilLine" strokeWidth={3} className="text-info" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <FormMember
                    isOpen={isOpenForm}
                    listMember={dataMember}
                    dataTitles={dataTitles}
                    dataEdit={dataMember.find((d) => d.nis === idSelected) ?? null}
                    onSave={(data) => {
                        setDataMember((prev) =>
                            prev.some((item) => item.nis === data.nis) ? prev.map((item) => (item.nis === data.nis ? data : item)) : [...prev, data]
                        );
                        toggleOpenForm();
                        setNew(true);
                    }}
                    onClose={() => {
                        setIdSelected("");
                        toggleOpenForm();
                    }}
                />
            )}

            {isAdmin && !isOpenForm && (
                <div className="flex flex-col gap-4 mt-8 px-4">
                    <Button variant={"success"} disabled={isLoading} onClick={toggleOpenForm}>
                        <Icon icon="Plus" /> Tambah Anggota Baru
                    </Button>
                    {isNew && (
                        <Button loading={isLoading} onClick={() => confirmSaveRef.current?.open()} className="flex-1">
                            <Icon icon="Save" /> Simpan Data Anggota
                        </Button>
                    )}
                </div>
            )}

            <ConfirmDialog
                ref={confirmDeleteRef}
                title="Apakah anda yakin?"
                description={`Data anggota nis: ${idSelected} akan terhapus.`}
                textCancel="Cek kembali"
                textSubmit="Ya, Hapus"
                onConfirm={() => {
                    setDataMember((prev) => prev.filter((d) => d.nis !== idSelected));
                    setIdSelected("");
                    setNew(true);
                }}
            />

            <ConfirmDialog
                ref={confirmSaveRef}
                title="Apakah anda yakin?"
                description="Menyimpan semua data anggota kelas"
                textCancel="Cek kembali"
                textSubmit="Ya, Simpan"
                onConfirm={async () => {
                    setLoading(true);
                    try {
                        const res = await fetch("/api/data-member", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(dataMember),
                        });

                        const result = await res.json();

                        if (!res.ok) {
                            console.error("Save failed:", result);
                            toast("Gagal menyimpan data", { autoClose: 6000 });
                            return;
                        }

                        console.log("Saved:", result);
                        toast("Data berhasil disimpan", { autoClose: 6000 });
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
