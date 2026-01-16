import HeaderHero from "@/components/header";
import NavMenu from "@/components/nav-menu";
import { IDataClassInfo } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Organization from "./partials/organization";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export default async function AdminPage() {
    const cookieStore = await cookies();

    const token = cookieStore.get("token");
    console.log(token);

    if (!token) {
        redirect("/auth");
    }

    const resDataClass = await fetch(baseUrl + "/api/class-info", {
        cache: "no-store",
    });
    const dataClassJson: IDataClassInfo = await resDataClass.json();

    return (
        <>
            <HeaderHero className="flex-col-reverse" description="admin" />
            <NavMenu />
            <Organization classInfo={dataClassJson} />
        </>
    );
}
