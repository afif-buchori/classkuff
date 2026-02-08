import { NextResponse } from "next/server";

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO_DATA } = process.env;

export async function GET() {
    try {
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO_DATA) {
            throw new Error("GitHub env belum lengkap");
        }

        const indexPath = "cash-due/index.json";

        const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/${indexPath}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
            cache: "no-store",
        });

        // Jika index.json belum ada
        if (res.status === 404) {
            return NextResponse.json({
                months: [],
            });
        }

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: "Gagal mengambil index.json", detail: data }, { status: res.status });
        }

        const indexContent = JSON.parse(Buffer.from(data.content, "base64").toString());

        return NextResponse.json(indexContent);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

interface Body {
    filename: string; // contoh: januari-2025.json
}

export async function POST(req: Request) {
    try {
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO_DATA) {
            throw new Error("GitHub env belum lengkap");
        }

        const { filename }: Body = await req.json();

        if (!filename) {
            return NextResponse.json({ error: "filename wajib diisi" }, { status: 400 });
        }

        // 🔒 Sanitasi nama file
        const safeFilename = filename.replace(/[^a-zA-Z0-9-_.]/g, "-");
        const filePath = `cash-due/${safeFilename}.json`;
        const indexPath = `cash-due/index.json`;

        /* ===============================
       1️⃣ CREATE MAIN FILE
    =============================== */
        const fileContent = {
            createdAt: new Date().toISOString(),
            data: [],
        };

        const encodedFile = Buffer.from(JSON.stringify(fileContent, null, 2)).toString("base64");

        const createFileRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/${filePath}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
            body: JSON.stringify({
                message: `create ${safeFilename}`,
                content: encodedFile,
                branch: "main",
            }),
        });

        const createdFile = await createFileRes.json();
        if (!createFileRes.ok) {
            return NextResponse.json({ error: "Gagal membuat file", detail: createdFile }, { status: createFileRes.status });
        }

        /* ===============================
       2️⃣ GET index.json (jika ada)
    =============================== */
        let indexSha: string | undefined;
        let indexContent: {
            updatedAt: string;
            files: string[];
        } = {
            updatedAt: new Date().toISOString(),
            files: [],
        };

        const indexRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/${indexPath}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });

        if (indexRes.ok) {
            const indexData = await indexRes.json();
            indexSha = indexData.sha;
            indexContent = JSON.parse(Buffer.from(indexData.content, "base64").toString());
        }

        /* ===============================
       3️⃣ UPDATE index.json
    =============================== */
        if (!indexContent.files.includes(safeFilename)) {
            indexContent.files.push(safeFilename);
        }

        indexContent.updatedAt = new Date().toISOString();

        const encodedIndex = Buffer.from(JSON.stringify(indexContent, null, 2)).toString("base64");

        const updateIndexRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/${indexPath}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
            body: JSON.stringify({
                message: "update index.json",
                content: encodedIndex,
                sha: indexSha,
                branch: "main",
            }),
        });

        const updatedIndex = await updateIndexRes.json();
        if (!updateIndexRes.ok) {
            return NextResponse.json({ error: "Gagal update index.json", detail: updatedIndex }, { status: updateIndexRes.status });
        }

        return NextResponse.json({
            success: true,
            file: safeFilename,
            indexUpdated: true,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
