import HeaderHero from "@/components/header";
import NavMenu from "@/components/nav-menu";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Form from "./partials/form";

export default async function AuthPage() {
    const cookieStore = await cookies();

    const token = cookieStore.get("token");
    console.log(token);

    if (token) {
        redirect("/admin");
    }

    return (
        <>
            <HeaderHero />
            <NavMenu />
            <Form />
        </>
    );
}
