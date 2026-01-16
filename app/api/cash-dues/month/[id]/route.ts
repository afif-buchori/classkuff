import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Month id is required" }, { status: 400 });
        }

        if (!process.env.GITHUB_OWNER || !process.env.GITHUB_REPO_DATA) {
            return NextResponse.json({ error: "Github env missing" }, { status: 500 });
        }

        const githubUrl = `https://raw.githubusercontent.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO_DATA}/main/cash-due/${id}.json`;

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
