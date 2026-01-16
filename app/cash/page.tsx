import { IUserForm } from "@/types";
import HeaderHero from "@/components/header";
import CashTable from "./partials/cash-table";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export default async function CashPage() {
    const resDataMember = await fetch(baseUrl + "/api/data-member", {
        cache: "no-store",
    });
    const dataMember: IUserForm[] = await resDataMember.json();

    return (
        <>
            <HeaderHero description="Uang Kas Kelas" className="flex-col-reverse" />
            <CashTable listMember={dataMember} />
        </>
    );
}
