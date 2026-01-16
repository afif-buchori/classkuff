import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { IDataClassInfo } from "@/types";

export async function GET() {
    const cookieStore = await cookies();

    const cached = cookieStore.get("class-name");
    if (cached) {
        return NextResponse.json({ name: cached.value });
    }

    const res = await fetch(`https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO_DATA}/main/class-info.json`, {
        cache: "no-store",
    });

    const json = await res.json();

    cookieStore.set("class-name", json.name, {
        path: "/",
        maxAge: 60 * 60 * 6,
    });

    return NextResponse.json({ name: json.name, titles: json.titles });
}

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO_DATA } = process.env;
const BASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/class-info.json`;

export async function POST(req: Request) {
    const headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
    };
    try {
        const data: IDataClassInfo[] = await req.json();

        if (!GITHUB_OWNER || !GITHUB_REPO_DATA) {
            return NextResponse.json({ error: "Github env missing" }, { status: 500 });
        }

        // 1️⃣ Ambil SHA lama
        const getRes = await fetch(BASE_URL, {
            headers,
            cache: "no-store",
        });
        console.log(getRes);

        if (!getRes.ok) {
            return NextResponse.json({ error: "Failed get file" }, { status: 500 });
        }

        const file = await getRes.json();

        // 2️⃣ Encode data baru
        const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

        // 3️⃣ Overwrite file
        const putRes = await fetch(BASE_URL, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                message: "Overwrite classInfo",
                content,
                sha: file.sha,
            }),
        });

        if (!putRes.ok) {
            return NextResponse.json({ error: "Failed overwrite classInfo" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            total: data.length,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
