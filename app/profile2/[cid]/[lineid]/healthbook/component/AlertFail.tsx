'use client';

import { Button } from "@/components/ui/buttonv2";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialogv2"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { HelpCircle } from 'lucide-react';
import { X } from 'lucide-react';
import { Check } from 'lucide-react';
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/inputv2";
import { useRouter } from 'next/navigation'

interface Props {
    isOpen: boolean;
    setIsOpenAlert: any;
    isStatus: boolean;
    title: string;
    message: string;
    cid:any;
    lineid:any;
}



export default function AlertStatus({ isOpen, setIsOpenAlert, isStatus, title, message, cid, lineid }: Props) {

    const [openDialog, setOpenDialog] = useState<boolean>(isOpen);
    const router = useRouter()

    useEffect(() => {

        setOpenDialog(isOpen);
    }, [isOpen]);
    return (

        <>
            {openDialog && (
                <Dialog onOpenChange={(update) => { setOpenDialog(update); setIsOpenAlert(update); }}>
                    <DialogTrigger asChild />
                    <DialogContent className="">
                        <DialogHeader className="pt-5">
                            <DialogTitle className={`text-3xl flex flex-col gap-8 items-center justify-center ${isStatus ? 'text-[#24b06c]' : 'text-[#ff5353]'}`} >

                                <div className="flex items-center justify-center outline outline-8 rounded-full h-28 w-28 ">
                                    {isStatus ?
                                        <div><Check size={70} /></div>
                                        : <div><X size={70} /></div>
                                    }
                                </div>
                                <div>{title}</div>

                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex items-center justify-center text-xl text-balance text-center">
                            {message}
                        </div>
                        <DialogFooter className={``}>
                            {isStatus ?
                                <Button className={`mx-7 rounded-3xl border-0 outline-0 bg-[#24b06c] hover:bg-[#85e0b4]`}
                                    onClick={() => {
                                        setOpenDialog(false);
                                        router.push(`../healthbook`);
                                    }
                                    }>
                                    ตกลง
                                </Button>
                                : <Button className={`mx-7 rounded-3xl outline-none bg-[#ff5353] hover:bg-[#bb6c6c]`}
                                    onClick={() => { setOpenDialog(false), setIsOpenAlert(false) }}>
                                    ลองอีกครั้ง
                                </Button>
                            }

                        </DialogFooter>
                    </DialogContent>
                </Dialog >
            )
            }
        </>



    );
}