import { NextResponse } from "next/server";

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO_DATA } = process.env;

const BASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/cash-due/`;

export async function POST(req: Request) {
    try {
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO_DATA) {
            return NextResponse.json({ error: "Github env missing" }, { status: 500 });
        }

        const body = await req.json();
        const filePath = `${body.fileName}.json`;

        const headers = {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
        };

        // 1️⃣ Get old file
        const getRes = await fetch(BASE_URL + filePath, {
            headers,
            cache: "no-store",
        });

        if (!getRes.ok) {
            return NextResponse.json({ error: "Failed get file" }, { status: getRes.status });
        }

        const file = await getRes.json();

        const fileContent = {
            updateAt: new Date().toISOString(),
            data: body.data,
        };

        const content = Buffer.from(JSON.stringify(fileContent, null, 2)).toString("base64");

        // 2️⃣ Update file
        const putRes = await fetch(BASE_URL + filePath, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                message: "Update Data Cash Dues",
                content,
                sha: file.sha,
            }),
        });

        if (!putRes.ok) {
            return NextResponse.json({ error: "Failed Update Data Cash Dues" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
