import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userName, pin } = await req.json();

    // Contoh hardcode user/admin
    if (userName === "kuff" && pin === "665544") {
        const response = NextResponse.json({
            status: 200,
            error: false,
            message: "Login berhasil",
            data: "kuff",
        });
        // Set cookie token (disimpan 1 jam)
        response.cookies.set("token", "admin-secret", {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60,
        });
        return response;
    }

    return NextResponse.json(
        {
            status: 500,
            error: true,
            message: "User name atau password salah",
            data: null,
        },
        { status: 500 }
    );
}
