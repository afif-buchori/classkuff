import { IDataClassInfo, IUserForm } from "@/types";
import MemberPageClient from "./partials/client-page";
import HeaderHero from "@/components/header";
import { cookies } from "next/headers";
import BackButton from "@/components/back-button";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export default async function MemberPage() {
    const resDataClass = await fetch(baseUrl + "/api/class-info", {
        cache: "no-store",
    });
    const dataClassInfo: IDataClassInfo = await resDataClass.json();

    const resDataMember = await fetch(baseUrl + "/api/data-member", {
        cache: "no-store",
    });
    const dataMember: IUserForm[] = await resDataMember.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    return (
        <>
            <HeaderHero description="Data Anggota Kelas" className="flex-col-reverse" />
            <BackButton />
            <MemberPageClient dataTitles={dataClassInfo.titles ?? []} listMember={dataMember} isAdmin={!!token} />
        </>
    );
}
