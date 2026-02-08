"use client";

import BackButton from "@/components/back-button";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ModalAddCashout from "./modal-add-cashout";

/* =======================TYPES======================= */

interface TotalPaid {
    month: string;
    total: number;
}

export interface CashOutItem {
    // id: string;
    date: string;
    amount: number;
    // category?: string;
    note: string;
}

interface CashOutByMonth {
    month: string;
    items: CashOutItem[];
}

export interface ICashFlowData {
    files: string[];
    initialCash: number;
    priceCashDue: number;
    totalPaid: TotalPaid[];
    cashOut: CashOutByMonth[];
}

/* =======================HELPERS======================= */

const formatRupiah = (n: number) => n.toLocaleString("id-ID", { minimumFractionDigits: 0 });

const getCashOutTotal = (items: CashOutItem[] = []) => items.reduce((sum, i) => sum + i.amount, 0);

/* =======================COMPONENT======================= */

export default function CashFlowFull({ totalMember, data, isAdmin = false }: { totalMember: number; data: ICashFlowData; isAdmin: boolean }) {
    const monthlyReport = data.totalPaid.reduce<
        {
            qty: number;
            month: string;
            income: number;
            expense: number;
            expenseItems: CashOutItem[];
            balance: number;
        }[]
    >((acc, paid, idx) => {
        const income = paid.total * data.priceCashDue;

        const cashOutMonth = data.cashOut.find((c) => c.month === paid.month);

        const expenseItems = cashOutMonth?.items ?? [];
        const expense = getCashOutTotal(expenseItems);

        const prevBalance = idx === 0 ? data.initialCash : acc[idx - 1].balance;

        const balance = prevBalance + income - expense;

        acc.push({
            qty: paid.total,
            month: paid.month,
            income,
            expense,
            expenseItems,
            balance,
        });

        return acc;
    }, []);

    const finalBalance = monthlyReport.at(-1)?.balance ?? data.initialCash;

    const [isOpen, setOpen] = useState<boolean>(false);

    return (
        <>
            <BackButton className="pr-4 mb-5">
                {isAdmin && (
                    <Button variant={"secondary"} onClick={() => setOpen(true)} className="ml-auto">
                        Tambah Pengeluaran
                    </Button>
                )}
            </BackButton>
            <div className="flex flex-col gap-4">
                {/* Kas Awal */}
                <div className="px-4 flex gap-2 font-semibold">
                    <p>Kas Awal</p>
                    <p className="ml-auto">{formatRupiah(data.initialCash)}</p>
                </div>

                {/* Per Bulan */}
                {monthlyReport.map((item, idx) => (
                    <div key={idx} className="border-t flex flex-col">
                        <p className="font-semibold py-1 px-4 bg-secondary/50 mb-1">{item.month}</p>

                        {/* Pemasukan */}
                        <div className="px-4 flex gap-2 mb-1">
                            <div className="flex-1 flex flex-col">
                                <p>Pemasukan</p>
                                <p className="text-sm leading-3.5 italic opacity-50">
                                    Terkumpul {item.qty} dari total {totalMember * 4}
                                </p>
                            </div>
                            <p className="text-end text-green-700">+ {formatRupiah(item.income)}</p>
                        </div>

                        {/* Pengeluaran total */}
                        <div className="px-4 flex">
                            <p>Pengeluaran</p>
                            <p className="ml-auto">{item.expenseItems.length === 0 ? "0" : ""}</p>
                            {/* <p className="ml-auto text-red-700">- {formatRupiah(item.expense)}</p> */}
                        </div>

                        {/* Detail Cash Out */}
                        {item.expenseItems.length > 0 && (
                            <div className="ml-4 mt-1 flex flex-col text-sm border-l border-primary pl-2 pr-4">
                                {item.expenseItems.map((co, ic) => (
                                    <div key={ic} className="flex gap-2 opacity-80">
                                        <p className="italic">
                                            {co.date} {item.month.slice(0, 3)}
                                        </p>
                                        <p className="flex-1 leading-4 mt-0.5">{co.note ?? "Pengeluaran"}</p>
                                        <p className="ml-auto text-red-700 whitespace-nowrap">- {formatRupiah(co.amount)}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Saldo */}
                        <div className="flex flex-col px-2">
                            <div className="px-2 flex font-semibold border-t pt-1 mt-2">
                                <p>Saldo</p>
                                <p className="ml-auto">{formatRupiah(item.balance)}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Saldo Akhir */}
                <div className="px-4 flex gap-2 font-bold border-t pt-3 mt-2">
                    <p>Saldo Akhir</p>
                    <p className="ml-auto">{formatRupiah(finalBalance)}</p>
                </div>
            </div>
            <ModalAddCashout isOpen={isOpen} onClose={() => setOpen(false)} listMonth={data.files} />
        </>
    );
}
