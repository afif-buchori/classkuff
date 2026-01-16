import { NextResponse } from "next/server";
import { IUserForm } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    const githubUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO_DATA}/main/data-member.json`;
    try {
        const res = await fetch(githubUrl, {
            cache: "no-store",
            headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "File not found" }, { status: res.status });
        }

        const json = await res.json();

        return NextResponse.json(json, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        });
    } catch (error) {
        console.error("GET cash dues error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO_DATA } = process.env;
const BASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/data-member.json`;

export async function POST(req: Request) {
    const headers = {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
    };
    try {
        const data: IUserForm[] = await req.json();

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: "Payload must be array" }, { status: 400 });
        }

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
                message: "Overwrite dataMember",
                content,
                sha: file.sha,
            }),
        });

        if (!putRes.ok) {
            return NextResponse.json({ error: "Failed overwrite dataMember" }, { status: 500 });
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
