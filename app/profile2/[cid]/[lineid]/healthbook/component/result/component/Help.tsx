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
import { useFirstTimeStore } from "../../healthbookStorage";
import { useState } from "react";

interface Props {

}



export default function Component_help({ }: Props) {

    const { FirstTimeStore, setFirstTimeStore, removeFirstTimeStore } = useFirstTimeStore();
    const [openDialog, setOpenDialog] = useState<boolean>(FirstTimeStore? FirstTimeStore : false);

    return (
        <Dialog open={openDialog} onOpenChange={(update) => { setOpenDialog(update); setFirstTimeStore(false); }}>
        <DialogTrigger asChild>
                {FirstTimeStore ? "" :
                    <Button className="flex items-center justify-center p-0 w-[30px] h-[30px] text-gray-400 bg-transparent hover:bg-transparent hover:text-gray-500 ">
                        <HelpCircle size={25} />
                    </Button>
                }

            </DialogTrigger>
            <DialogContent className="" >

                <DialogHeader className="pt-5">
                    <DialogTitle className="text-3xl">การบันทึกสุขภาพ</DialogTitle>
                </DialogHeader>

                <Card className="py-4">
                    <CardContent className="px-2 ">
                        <div className="text-center text-2xl py-5 ">
                            เลือกดูข้อมูลที่บันทึก
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center justify-center rounded-full w-[44px] h-[44px] bg-[#39CC88]">
                                <Image src={"/hygge_healthbook/icon_weight.svg"} priority alt="Image" width={22.19} height={26.69} className="flex flex-row text-center " />
                            </div>
                            <div className="flex items-center justify-center rounded-full w-[44px] h-[44px] bg-[#4A5A67]">
                                <Image src={"/hygge_healthbook/icon_height.svg"} priority alt="Image" width={10} height={23.25} className="flex flex-row text-center " />
                            </div>
                            <div className="flex items-center justify-center rounded-full w-[44px] h-[44px] bg-[#4A5A67]">
                                <Image src={"/hygge_healthbook/icon_pressure.svg"} priority alt="Image" width={27.67} height={29.34} className="flex flex-row text-center pt-1" />
                            </div>
                            <div className="flex items-center justify-center rounded-full w-[44px] h-[44px] bg-[#4A5A67]">
                                <Image src={"/hygge_healthbook/icon_pulse.svg"} priority alt="Image" width={28.9} height={28.9} className="flex flex-row text-center pt-1" />
                            </div>
                            <div className="flex items-center justify-center rounded-full w-[44px] h-[44px] bg-[#4A5A67]">
                                <Image src={"/hygge_healthbook/icon_bloodsugar.svg"} priority alt="Image" width={23} height={32} className="flex flex-row text-center pl-1" />
                            </div>
                            <div className="flex items-center justify-center rounded-full w-[44px] h-[44px] bg-[#4A5A67]">
                                <Image src={"/hygge_healthbook/icon_bmi.svg"} priority alt="Image" width={30} height={34} className="flex flex-row text-center" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4 px-4">
                    <div className="flex items-center justify-center p-0 w-[40px] h-[40px] rounded-md bg-[#49DABD] hover:bg-[#9fdfd2] shadow-lg">
                        <Image src={"/hygge_healthbook/icon_add.svg"} priority alt="Image" width={30} height={30} className="flex flex-row item-center justify-self-center" />
                    </div>
                    <div className="text-xl">เพิ่มข้อมูล/บันทึกข้อมูล</div>
                </div>

                <div className="flex items-center gap-4 px-4">
                    <div className="flex items-center justify-center p-0 w-[40px] h-[40px] rounded-md bg-[#F98F86] hover:bg-[#fac0bb] shadow-lg">
                        <Image src={"/hygge_healthbook/icon_edit.svg"} priority alt="Image" width={30} height={30} className="flex flex-row item-center justify-self-center" />
                    </div>
                    <div className="text-xl">แก้ไขข้อมูล</div>
                </div>

                <div className="flex items-center gap-4 px-4">
                    <div className="flex items-center justify-center p-0 w-[40px] h-[40px] rounded-md bg-[#39CC88] hover:bg-[#9ce4c2] shadow-lg">
                        <Image src={"/hygge_healthbook/icon_detail.svg"} priority alt="Image" width={30} height={30} className="flex flex-row item-center justify-self-center" />
                    </div>
                    <div className="text-xl">ดูรายละเอียด</div>
                </div>





                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog >
    );
}