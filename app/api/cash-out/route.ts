import { NextResponse } from "next/server";

const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO_DATA } = process.env;

const BASE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO_DATA}/contents/cash-due/index.json`;

export async function POST(req: Request) {
    try {
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO_DATA) {
            return NextResponse.json({ error: "Missing env config" }, { status: 500 });
        }

        const body = await req.json();
        const { month, date, amount, note } = body;

        if (!month || !date || !amount) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        /* =========================
           1. GET index.json
        ========================= */

        const getRes = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
            cache: "no-store",
        });

        if (!getRes.ok) {
            const err = await getRes.json();
            return NextResponse.json(err, { status: getRes.status });
        }

        const file = await getRes.json();
        const sha = file.sha;

        const content = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));

        /* =========================
           2. Normalize cashOut
        ========================= */

        if (!Array.isArray(content.cashOut)) {
            content.cashOut = [];
        }

        let monthEntry = content.cashOut.find((c: any) => c.month === month);

        if (!monthEntry) {
            monthEntry = {
                month,
                items: [],
            };
            content.cashOut.push(monthEntry);
        }

        monthEntry.items.push({
            date,
            amount: Number(amount),
            note,
        });

        content.updatedAt = new Date().toISOString();

        /* =========================
           3. UPDATE index.json
        ========================= */

        const updateRes = await fetch(BASE_URL, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Add cash out ${month}`,
                content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
                sha,
            }),
        });

        if (!updateRes.ok) {
            const err = await updateRes.json();
            return NextResponse.json(err, { status: updateRes.status });
        }

        const result = await updateRes.json();

        return NextResponse.json({
            success: true,
            data: {
                month,
                date,
                amount,
                note,
            },
            commit: result.commit?.sha,
        });
    } catch (error) {
        console.error("Cash out API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
