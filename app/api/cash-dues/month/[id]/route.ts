import { NextRequest, NextResponse } from "next/server";

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO_DATA } = process.env;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Month id is required" }, { status: 400 });
        }

        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO_DATA) {
            return NextResponse.json({ error: "Github env missing" }, { status: 500 });
        }

        const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/cash-due/${id}.json`;

        const res = await fetch(githubUrl, {
            cache: "no-store",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("GitHub error:", text);
            return NextResponse.json({ error: "File not found" }, { status: res.status });
        }

        const file = await res.json();

        if (!file?.content) {
            console.error("Invalid GitHub response:", file);
            return NextResponse.json({ error: "Invalid GitHub content" }, { status: 500 });
        }

        // 🔥 DECODE BASE64
        const decoded = Buffer.from(file.content, "base64").toString("utf-8");

        const json = JSON.parse(decoded);

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
