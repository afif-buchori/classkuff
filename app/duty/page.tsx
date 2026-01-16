import { IDayGroup, IUserForm } from "@/types";
import HeaderHero from "@/components/header";
import DutyClientPage from "./partials/client-page";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export default async function DutyPage() {
    const resDataMember = await fetch(baseUrl + "/api/data-member", {
        cache: "no-store",
    });
    const dataMember: IUserForm[] = await resDataMember.json();

    const resDutyInfo = await fetch(baseUrl + "/api/duty-info", {
        cache: "no-store",
    });
    const dutyInfo: IDayGroup[] = await resDutyInfo.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    console.log(dutyInfo);

    return (
        <>
            <HeaderHero description="Jadwal Piket Kelas" className="flex-col-reverse" />
            <DutyClientPage dataMember={dataMember} dataDutyGroup={dutyInfo} isAdmin={!!token} />
        </>
    );
}
