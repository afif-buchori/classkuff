import { NextResponse } from "next/server";

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO_DATA } = process.env;

const BASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/cash-due/`;

export async function POST(req: Request) {
    try {
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO_DATA) {
            return NextResponse.json({ error: "Github env missing" }, { status: 500 });
        }

        const body = await req.json();
        const { fileName, data, total } = body;

        const filePath = `${fileName}.json`;

        const headers = {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
        };

        // ===============================
        // 1️⃣ UPDATE FILE BULANAN
        // ===============================
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
            data,
        };

        const content = Buffer.from(JSON.stringify(fileContent, null, 2)).toString("base64");

        const putRes = await fetch(BASE_URL + filePath, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                message: `Update Data Cash Dues ${fileName}`,
                content,
                sha: file.sha,
            }),
        });

        if (!putRes.ok) {
            return NextResponse.json({ error: "Failed Update Data Cash Dues" }, { status: 500 });
        }

        // ===============================
        // 2️⃣ UPDATE index.json (SAFE MODE)
        // ===============================
        const indexPath = "index.json";
        let indexSha: string | undefined;

        const getIndexRes = await fetch(BASE_URL + indexPath, { headers });

        if (!getIndexRes.ok) {
            return NextResponse.json({ error: "index.json not found" }, { status: 500 });
        }

        const indexFile = await getIndexRes.json();
        indexSha = indexFile.sha;

        const indexData = JSON.parse(Buffer.from(indexFile.content, "base64").toString("utf-8"));

        // VALIDASI fileName harus ada di files
        if (!indexData.files.includes(fileName)) {
            return NextResponse.json({ error: `Month ${fileName} not registered in index files` }, { status: 400 });
        }

        // CASE 1: totalPaid kosong → TAMBAHKAN
        if (indexData.totalPaid.length === 0) {
            indexData.totalPaid.push({
                month: fileName,
                total,
            });
        } else {
            // CASE 2: cari month
            const target = indexData.totalPaid.find((item: any) => item.month === fileName);

            if (target) {
                // UPDATE
                target.total = total;
            } else {
                // CASE 3: ERROR (tidak auto create)
                return NextResponse.json({ error: `Month ${fileName} not found in totalPaid` }, { status: 400 });
            }
        }

        indexData.updatedAt = new Date().toISOString();

        const indexContent = Buffer.from(JSON.stringify(indexData, null, 2)).toString("base64");

        await fetch(BASE_URL + indexPath, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                message: `Update index total ${fileName}`,
                content: indexContent,
                sha: indexSha,
            }),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
