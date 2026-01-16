"use client";

import BackButton from "@/components/back-button";
import { IDayGroup, IUserForm } from "@/types";
import GenerateGroup from "./generate-group";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useState } from "react";

interface DutyClientPageprops {
    dataMember: IUserForm[];
    dataDutyGroup: IDayGroup[];
    isAdmin: boolean;
}
export default function DutyClientPage({ dataMember, dataDutyGroup, isAdmin = false }: DutyClientPageprops) {
    const [isCreate, setIsCreate] = useState<boolean>(false);

    return (
        <>
            <BackButton className="pr-4">
                {isCreate && (
                    <Button variant={"destructive"} onClick={() => setIsCreate(false)} className="ml-auto">
                        <Icon icon="X" /> Batal
                    </Button>
                )}
            </BackButton>
            {isCreate ? (
                <GenerateGroup listMember={dataMember} onClose={() => setIsCreate(false)} />
            ) : (
                <>
                    <div className="flex flex-col gap-4 px-4 mb-6">
                        {dataDutyGroup.map((grp) => (
                            <div key={grp.day} className="">
                                <p className="text-sm font-semibold border-b border-t border-secondary opacity-70 px-1 mb-1">{grp.day}</p>
                                {grp.members.map((m) => (
                                    <p key={m.nis} className="font-medium line-clamp-1 px-1">
                                        {m.name}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                    {isAdmin && (
                        <div className="flex justify-center">
                            <Button variant={"success"} onClick={() => setIsCreate(true)}>
                                Buat Jadwal
                            </Button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
