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
import { th } from "date-fns/locale";
import { format } from "date-fns";
import { useState } from "react";


interface Props {
  date: any;
  morning: any;
  afternoon: any;
  evening: any;
  night: any;
}



export default function DetailSugar({ date, morning, afternoon, evening, night }: Props) {


  return (

    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center p-0 w-[30px] h-[30px] bg-[#39CC88] hover:bg-[#9ce4c2] shadow-lg">
          <Image src={"/hygge_healthbook/icon_detail.svg"} priority alt="Image" width={20} height={20} className="flex flex-row item-center justify-self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent className="" >

        <DialogHeader className="pt-5">
          <DialogTitle className="text-2xl">ค่าน้ำตาลในเลือด</DialogTitle>
        </DialogHeader>

        <div className="text-xl text-center text-[#2C97A3] font-bold pb-3 pt-1">
          {format(date, "P", { locale: th })}
        </div>

        <Card>
          <CardContent className="grid grid-cols-5 gap-2 items-center justify-center p-3">
            <div className="flex items-center h-10 justify-end col-span-4 text-lg">
              ก่อนอาหาร เช้า
              <Image src={"/hygge_healthbook/icon_morning.svg"} priority alt="Image" width={35} height={35} className="flex flex-row text-center pl-2" />
            </div>
            <div className="flex items-center h-10 justify-center col-span-1 text-[#39CC88] font-bold">
              {morning}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid grid-cols-5 gap-2 items-center justify-center p-3">
            <div className="flex items-center h-10 justify-end col-span-4 text-lg">
              ก่อนอาหาร กลางวัน
              <Image src={"/hygge_healthbook/icon_day.svg"} priority alt="Image" width={35} height={35} className="flex flex-row text-center pl-2" />
            </div>
            <div className="flex items-center h-10 justify-center col-span-1 text-[#39CC88] font-bold">
              {afternoon}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid grid-cols-5 gap-2 items-center justify-center p-3">
            <div className="flex items-center h-10 justify-end col-span-4 text-lg">
              ก่อนอาหาร เย็น
              <Image src={"/hygge_healthbook/icon_evening.svg"} priority alt="Image" width={35} height={35} className="flex flex-row text-center pl-2" />
            </div>
            <div className="flex items-center h-10 justify-center col-span-1 text-[#39CC88] font-bold">
              {evening}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid grid-cols-5 gap-2 items-center justify-center p-3">
            <div className="flex items-center h-10 justify-end col-span-4 text-lg">
              ก่อนนอน
              <Image src={"/hygge_healthbook/icon_night.svg"} priority alt="Image" width={35} height={35} className="flex flex-row text-center pl-2" />
            </div>
            <div className="flex items-center h-10 justify-center col-span-1 text-[#39CC88] font-bold">
              {night}
            </div>
          </CardContent>
        </Card>


        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}