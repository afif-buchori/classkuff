import HeaderHero from "@/components/header";
import NavMenu from "@/components/nav-menu";
import { IDataClassInfo, IUserForm } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export default async function Home() {
    const resDataClass = await fetch(baseUrl + "/api/class-info", {
        cache: "no-store",
    });
    const dataClassJson: IDataClassInfo = await resDataClass.json();
    // console.log(dataClassJson);

    const resDataMember = await fetch(baseUrl + "/api/data-member", {
        cache: "no-store",
    });
    const dataMember: IUserForm[] = await resDataMember.json();
    console.log(dataMember);

    function getInitials(name: string): string {
        if (!name) return "";
        const words = name.trim().split(/\s+/).filter(Boolean);
        const initials = words.map((word) => word[0].toUpperCase());
        if (initials.length === 1) return initials[0];
        return initials.slice(0, 3).join("");
    }

    return (
        <>
            <HeaderHero />
            <NavMenu />
            <div className="p-4 grid grid-cols-2 gap-2">
                {dataClassJson.titles.map((item, idx) => {
                    const userInOrg = dataMember.find((u) => u.title === item.title);
                    return (
                        <div key={idx} className="flex flex-col items-center capitalize">
                            <div className="w-20 h-20 rounded-full flex overflow-hidden bg-secondary">
                                <p className="m-auto text-2xl font-black opacity-50">{getInitials(userInOrg?.name ?? "-")}</p>
                            </div>
                            <p className="mt-2 font-medium text-center">{userInOrg?.name ?? "-"}</p>
                            <p className="text-sm text-center italic opacity-70">{userInOrg?.title ?? item.title}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
