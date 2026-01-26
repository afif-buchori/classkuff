import { IUserForm } from "@/types";
import HeaderHero from "@/components/header";
import { cookies } from "next/headers";
import BackButton from "@/components/back-button";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export default async function CashFlowPage() {
    const resDataMember = await fetch(baseUrl + "/api/data-member", {
        cache: "no-store",
    });
    const dataMember: IUserForm[] = await resDataMember.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    return (
        <>
            <HeaderHero description="Catatan Uang Kas Kelas" className="flex-col-reverse" />
            <BackButton />
            <p className="italic opacity-50 text-center px-4 mt-8">
                Halaman ini masih dalam tahap pengembangan ya. Kami sedang menyiapkan fitur-fitur terbaik agar nantinya bisa digunakan dengan nyaman. Terima
                kasih sudah bersabar dan ditunggu update selanjutnya!
            </p>
            {/* <CashTable listMember={dataMember} isAdmin={!!token} /> */}
        </>
    );
}
