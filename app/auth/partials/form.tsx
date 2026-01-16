"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Form() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [pwd, setPwd] = useState("");
    const [labelPwd, setLabelPwd] = useState("Password");

    const [form, setForm] = useState({
        userName: "",
        pin: "",
    });

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
            }}
            className="p-4 flex flex-col gap-5"
        >
            <div>
                <label htmlFor="userName">User Name</label>
                <Input
                    id="userName"
                    name="userName"
                    value={form.userName}
                    onChange={(e) => setForm((old) => ({ ...old, userName: e.target.value }))}
                    placeholder="Ketik user name..."
                />
            </div>

            {form.userName.toLowerCase() === "kuff" ? (
                <div>
                    <label htmlFor="pin">PIN</label>
                    <Input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id="pin"
                        name="pin"
                        value={form.pin}
                        onChange={(e) => setForm((old) => ({ ...old, pin: e.target.value }))}
                        placeholder="pin..."
                    />
                </div>
            ) : (
                <div>
                    <label htmlFor="pwd">{labelPwd}</label>
                    <Input
                        id="pwd"
                        name="pwd"
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        placeholder={`Ketik ${labelPwd.toLowerCase()}...`}
                    />
                </div>
            )}

            <Button
                onClick={async () => {
                    setLoading(true);
                    if (pwd.toLowerCase() === "password") {
                        return setTimeout(() => {
                            setLabelPwd("Kata sandi");
                            setPwd("");
                            setLoading(false);
                        }, 1500);
                    }
                    if (pwd.toLowerCase() === "kata sandi" || pwd.toLowerCase() === "katasandi") {
                        return setTimeout(() => {
                            setLabelPwd("Password");
                            setPwd("");
                            setLoading(false);
                        }, 1500);
                    }
                    const res = await fetch("/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(form),
                    });

                    const data = await res.json();
                    console.log(data);

                    if (res.ok) {
                        // Login berhasil, redirect ke halaman admin
                        toast(data.message || "Login berhasil");
                        router.push("/admin");
                    } else {
                        toast.error(data.message || "Login gagal");
                    }
                }}
                type={form.userName === "kuff" ? "submit" : "button"}
                loading={loading}
                className="mt-8"
            >
                Login
            </Button>
        </form>
    );
}
