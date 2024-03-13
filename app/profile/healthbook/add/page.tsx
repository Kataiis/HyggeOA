'use client';

import Image from "next/image";
import { format, parse } from "date-fns"
import { ChevronLeft } from 'lucide-react';
import { Input } from "@/components/ui/inputv2";
import { Calendar } from "@/components/ui/calendarv2"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/buttonv2"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

import { th } from "date-fns/locale";
import { CardFooter } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useHealthStore } from "@/app/store";
import axios from "axios";
import AlertFail from "../component/AlertFail";


const FormSchema = z.object({
    create_date: z.date(),
    weight: z.string().optional().default(''),
    height: z.string().optional().default(''),

    sbp: z.string().optional().default(''),
    dbp: z.string().optional().default(''),
    pulse: z.string().optional().default(''),

    sbp_night: z.string().optional().default(''),
    dbp_night: z.string().optional().default(''),
    pulse_night: z.string().optional().default(''),

    glucose_morning: z.string().optional().default(''),
    glucose_afternoon: z.string().optional().default(''),
    glucose_evening: z.string().optional().default(''),
    glucose_night: z.string().optional().default(''),
}).refine((data: { sbp?: string; dbp?: string; pulse?: string }) => {
    const { sbp, dbp, pulse } = data;
    return !(sbp !== '' && dbp === '' && pulse === '')
        && !(sbp === '' && dbp !== '' && pulse === '')
        && !(sbp === '' && dbp === '' && pulse !== '')
        && !(sbp !== '' && dbp !== '' && pulse === '')
        && !(sbp === '' && dbp !== '' && pulse !== '')
        && !(sbp !== '' && dbp === '' && pulse !== '');
}, {
    message: "test1",
    path: ["sbp", "dbp", "pulse"]
}).refine((data: { sbp_night?: string; dbp_night?: string; pulse_night?: string }) => {
    const { sbp_night, dbp_night, pulse_night } = data;
    return !(sbp_night !== '' && dbp_night === '' && pulse_night === '')
        && !(sbp_night === '' && dbp_night !== '' && pulse_night === '')
        && !(sbp_night === '' && dbp_night === '' && pulse_night !== '')
        && !(sbp_night !== '' && dbp_night !== '' && pulse_night === '')
        && !(sbp_night === '' && dbp_night !== '' && pulse_night !== '')
        && !(sbp_night !== '' && dbp_night === '' && pulse_night !== '');
}, {
    message: "test2",
    path: ["sbp_night", "dbp_night", "pulse_night"]
});

interface OpenAlertProps {
    open: boolean;
    type: string;
}

interface HealthProps {
    bmi: any;
    cid: any;
    create_date: any;
    dbp: any;
    dbp_night: any;
    glucose_afternoon: any;
    glucose_evening: any;
    glucose_morning: any;
    glucose_night: any;
    height: any;
    id: any;
    pulse: any;
    pulse_night: any;
    sbp: any;
    sbp_night: any;
    weight: any;
}

const baseURL = process.env.APIKey;


export default function Home({ params }: { params: { cid: string, lineid: string } }) {
    const { HealthStore, setHealthStore, removeHealthStore } = useHealthStore();
    const [date, setDate] = useState<Date | undefined>()
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState<OpenAlertProps>({ open: false, type: '' });
    const [id, setId] = useState(HealthStore?.id);


    const router = useRouter()


    const handleGoBack = () => {
        router.push(`../healthbook`);
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const CheckData = async (date: string) => {
        await axios.post(`${baseURL}/bookinghealth/getdatacondition`, {
            cid: HealthStore?.cid,
            create_date: date,
        }).then((response) => {
            console.log("CheckData", response.data)

            if (response.data.ok) {
                if (response.data.message == undefined) {
                    console.log("response.data.message == undefined");
                    form.setValue('weight', `${HealthStore?.weight == 0 ? '' : HealthStore?.weight}`);
                    form.setValue('height', `${HealthStore?.height == 0 ? '' : HealthStore?.height}`);

                    form.setValue('sbp', '');
                    form.setValue('dbp', '');
                    form.setValue('pulse', '');

                    form.setValue('sbp_night', '');
                    form.setValue('dbp_night', '');
                    form.setValue('pulse_night', '');

                    form.setValue('glucose_morning', '');
                    form.setValue('glucose_afternoon', '');
                    form.setValue('glucose_evening', '');
                    form.setValue('glucose_night', '');

                } else {

                    console.log("response.data.message !== undefined");

                    console.log("bmi", response.data.message.bmi)
                    console.log("cid", HealthStore?.cid)
                    console.log("create_date", response.data.message.create_date)
                    console.log("dbp", response.data.message.dbp)
                    console.log("dbp_night", response.data.message.dbp_night)
                    console.log("glucose_afternoon", response.data.message.glucose_afternoon)
                    console.log("glucose_evening", response.data.message.glucose_evening)
                    console.log("glucose_morning", response.data.message.glucose_morning)
                    console.log("glucose_night", response.data.message.glucose_night)
                    console.log("height", response.data.message.height)
                    console.log("id", response.data.message.id)
                    console.log("pulse", response.data.message.pulse)
                    console.log("pulse_night", response.data.message.pulse_night)
                    console.log("sbp", response.data.message.sbp)
                    console.log("sbp_night", response.data.message.sbp_night)
                    console.log("weight", response.data.message.weight)



                    form.setValue('weight', response.data.message.weight == 0 ? '' : `${response.data.message.weight}`);
                    form.setValue('height', response.data.message.height == 0 ? '' : `${response.data.message.height}`);

                    form.setValue('sbp', response.data.message.sbp == 0 ? '' : `${response.data.message.sbp}`);
                    form.setValue('dbp', response.data.message.dbp == 0 ? '' : `${response.data.message.dbp}`);
                    form.setValue('pulse', response.data.message.pulse == 0 ? '' : `${response.data.message.pulse}`);

                    form.setValue('sbp_night', response.data.message.sbp_night == 0 ? '' : `${response.data.message.sbp_night}`);
                    form.setValue('dbp_night', response.data.message.dbp_night == 0 ? '' : `${response.data.message.dbp_night}`);
                    form.setValue('pulse_night', response.data.message.pulse_night == 0 ? '' : `${response.data.message.pulse_night}`);

                    form.setValue('glucose_morning', response.data.message.glucose_morning == 0 ? '' : `${response.data.message.glucose_morning}`);
                    form.setValue('glucose_afternoon', response.data.message.glucose_afternoon == 0 ? '' : `${response.data.message.glucose_afternoon}`);
                    form.setValue('glucose_evening', response.data.message.glucose_evening == 0 ? '' : `${response.data.message.glucose_evening}`);
                    form.setValue('glucose_night', response.data.message.glucose_night == 0 ? '' : `${response.data.message.glucose_night}`);

                    setId(response.data.message.id);



                }
            }
        }).then(() => (
            console.log("setId", id)

        ));



    };

    useEffect(() => {

        setDate(new Date(HealthStore?.create_date))

    }, []);


    useEffect(() => {
        if (date !== undefined) {
            CheckData(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
        }
    }, [date]);



    const onSubmit = async (data: z.infer<typeof FormSchema>) => {

        console.log("data onSubmit", data);
        console.log("data cid", HealthStore?.cid);

        const response = await axios.post(`${baseURL}/bookinghealth/getdatacondition`, {
            cid: HealthStore?.cid,
            create_date: `${data.create_date.getFullYear()}-${data.create_date.getMonth() + 1}-${data.create_date.getDate()}`,
        });

        if (response.data.ok) {
            console.log("response", response.data);
            if (response.data.message !== undefined) {
                // console.log("update")
                // console.log("id", id)
                // console.log("bmi", Number(data.weight) / ((Number(data.height) / 100) * (Number(data.height) / 100)))

                await axios.put(`${baseURL}/bookinghealth/${id}`, {
                    cid: HealthStore?.cid,
                    create_date: `${data.create_date.getFullYear()}-${data.create_date.getMonth() + 1}-${data.create_date.getDate()}`,
                    weight: Number(data.weight),
                    height: Number(data.height),
                    sbp: data.sbp == "" ? 0 : Number(data.sbp),
                    sbp_night: data.sbp_night == "" ? 0 : Number(data.sbp_night),
                    dbp: data.dbp == "" ? 0 : Number(data.dbp),
                    dbp_night: data.dbp_night == "" ? 0 : Number(data.dbp_night),
                    pulse: data.pulse == "" ? 0 : Number(data.pulse),
                    pulse_night: data.pulse_night == "" ? 0 : Number(data.pulse_night),
                    glucose_afternoon: data.glucose_afternoon == "" ? 0 : Number(data.glucose_afternoon),
                    glucose_evening: data.glucose_evening == "" ? 0 : Number(data.glucose_evening),
                    glucose_morning: data.glucose_morning == "" ? 0 : Number(data.glucose_morning),
                    glucose_night: data.glucose_night == "" ? 0 : Number(data.glucose_night),
                    bmi: Number(data.weight) / ((Number(data.height) / 100) * (Number(data.height) / 100)),
                }).then((response) => {
                    setIsOpenAlert({ open: true, type: 'update' })
                    console.log("update")
                    console.log("bmi", Number(data.weight) / ((Number(data.height) / 100) * (Number(data.height) / 100)))

                })

            } else {
                // console.log("insert")
                await axios.post(`${baseURL}/bookinghealth`, {
                    cid: HealthStore?.cid,
                    create_date: `${data.create_date.getFullYear()}-${data.create_date.getMonth() + 1}-${data.create_date.getDate()}`,
                    weight: Number(data.weight),
                    height: Number(data.height),
                    sbp: data.sbp == "" ? 0 : Number(data.sbp),
                    sbp_night: data.sbp_night == "" ? 0 : Number(data.sbp_night),
                    dbp: data.dbp == "" ? 0 : Number(data.dbp),
                    dbp_night: data.dbp_night == "" ? 0 : Number(data.dbp_night),
                    pulse: data.pulse == "" ? 0 : Number(data.pulse),
                    pulse_night: data.pulse_night == "" ? 0 : Number(data.pulse_night),
                    glucose_afternoon: data.glucose_afternoon == "" ? 0 : Number(data.glucose_afternoon),
                    glucose_evening: data.glucose_evening == "" ? 0 : Number(data.glucose_evening),
                    glucose_morning: data.glucose_morning == "" ? 0 : Number(data.glucose_morning),
                    glucose_night: data.glucose_night == "" ? 0 : Number(data.glucose_night),
                    bmi: Number(data.weight) / ((Number(data.height) / 100) * (Number(data.height) / 100)),
                }).then((response) => {
                    setIsOpenAlert({ open: true, type: 'insert' })
                    console.log("insert")
                    console.log("bmi", Number(data.weight) / ((Number(data.height) / 100) * (Number(data.height) / 100)))


                })
            }


        }

    }

    return (
        <div className='bg-white h-screen flex flex-col gap-4'>

            {isOpenAlert.type == 'insert' ?
                <AlertFail isOpen={isOpenAlert.open} setIsOpenAlert={setIsOpenAlert} isStatus={true} title={`เพิ่มข้อมูลสำเร็จ`} message={`เพิ่มข้อมูลวันที่ ${date ? format(date, "P", { locale: th }) : ""} สำเร็จแล้ว`} cid={params.cid} lineid={params.lineid} />
                : <div>
                    {isOpenAlert.type == 'update' ?
                        <AlertFail isOpen={isOpenAlert.open} setIsOpenAlert={setIsOpenAlert} isStatus={true} title={`อัพเดทข้อมูลสำเร็จ`} message={`อัพเดทข้อมูลวันที่ ${date ? format(date, "P", { locale: th }) : ""} สำเร็จแล้ว`} cid={params.cid} lineid={params.lineid} />
                        : <AlertFail isOpen={isOpenAlert.open} setIsOpenAlert={setIsOpenAlert} isStatus={false} title={`ดำเนินไม่การสำเร็จ`} message={`การเพิ่มข้อมูลผิดพลาด\nกรุณาตรวจสอบใหม่อีกครั้ง`} cid={params.cid} lineid={params.lineid} />
                    }
                </div>
            }

            <div className="fixed w-full z-50">
                <div className="h-[69px] bg-[#2D95A1] flex items-center justify-between p-2 text-white font-medium" >
                    <div onClick={handleGoBack} className="pr-4"><ChevronLeft size={40} /></div>
                    <div className='text-2xl'>สมุดสุขภาพ</div>
                    <div className="w-[40px]">
                    </div>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* -------------------------------------------- วัน-เดือน-ปี -------------------------------------------- */}
                    <div className="grid grid-cols-5 gap-2 items-center justify-center text-xl mt-[89px] px-10 mb-4">
                        <div className="flex items-center h-8 col-span-2 ">วัน-เดือน-ปี</div>
                        <div className="flex items-center h-8 justify-center">
                            <FormField
                                control={form.control}
                                defaultValue={new Date(HealthStore?.create_date)}
                                name="create_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button className="flex items-center justify-center p-0 w-[32px] h-[32px] bg-[#6BB1E1] hover:bg-[#b7e2fc] shadow-lg" >
                                                        <CalendarIcon />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    locale={th}
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(e) => {
                                                        field.onChange(e);
                                                        setDate(e);
                                                        setCalendarOpen(false);
                                                        if (e !== undefined) {
                                                            CheckData(`${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`)
                                                        }
                                                    }}
                                                    disabled={(date) => date > new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>
                        <div className="flex items-center h-8 justify-center col-span-2 ">
                            {date ? <div>{format(date, "P", { locale: th })}</div> : ""}
                        </div>

                        <div className="flex items-center h-8 col-span-3">{`น้ำหนัก`}</div>
                        <div className="grid grid-cols-3 gap-2 items-center h-8 justify-center col-span-2 ">
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    defaultValue={`${HealthStore?.weight == 0 ? '' : HealthStore?.weight}`}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input   {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>kg</div>
                        </div>

                        <div className="flex items-center h-8 col-span-3">{`ส่วนสูง`}</div>
                        <div className="grid grid-cols-3 gap-2 items-center h-8 justify-center col-span-2 ">
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="height"
                                    defaultValue={`${HealthStore?.height == 0 ? '' : HealthStore?.height}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div>cm</div>
                        </div>
                    </div>

                    {/* -------------------------------------------- ความดันโลหิต -------------------------------------------- */}
                    <div className="bg-[#F5F5F5] grid grid-cols-7 gap-2 items-center justify-center text-base px-10 py-4 mb-4">
                        <div className="flex items-cente justify-end col-span-7 text-xl">ความดันโลหิต</div>



                        {/* ---------------------------------------------- MORNING ----------------------------------------------*/}

                        <div className="flex items-cente justify-start col-span-7 gap-4">
                            <Image src={"/hygge_healthbook/icon_morning.svg"} priority alt="Image" width={35} height={35} className="flex flex-row text-center pl-2" />
                            {`เช้า (หลังตื่นนอน)`}
                        </div>

                        <div className="flex items-center h-8 justify-end">บน</div>
                        <div className="flex items-center h-8 col-span-2 ">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.sbp == 0 ? '' : HealthStore?.sbp}`}
                                name="sbp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div></div>
                        <div className="flex items-center h-8 justify-end">ล่าง</div>
                        <div className="flex items-center h-8 justify-center col-span-2 ">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.dbp == 0 ? '' : HealthStore?.dbp}`}
                                name="dbp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-end h-8 col-span-5">อัตราการเต้นหัวใจ</div>
                        <div className="flex items-center h-8 justify-center col-span-2">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.pulse == 0 ? '' : HealthStore?.pulse}`}
                                name="pulse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="col-span-7 flex justify-center ">
                            {(form.formState.errors.sbp || form.formState.errors.dbp || form.formState.errors.pulse) && (
                                <FormMessage>ERROR MORNING</FormMessage>
                            )}
                        </div>


                        {/* ---------------------------------------------- NIGHT ----------------------------------------------*/}

                        <div className="flex items-cente justify-start col-span-7 gap-4 mt-2">
                            <Image src={"/hygge_healthbook/icon_night.svg"} priority alt="Image" width={35} height={35} className="flex flex-row text-center pl-2" />
                            {`ก่อนนอน`}
                        </div>

                        <div className="flex items-center h-8 justify-end">บน</div>
                        <div className="flex items-center h-8 col-span-2 ">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.sbp_night == 0 ? '' : HealthStore?.sbp_night}`}
                                name="sbp_night"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div></div>
                        <div className="flex items-center h-8 justify-end">ล่าง</div>
                        <div className="flex items-center h-8 justify-center col-span-2 ">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.dbp_night == 0 ? '' : HealthStore?.dbp_night}`}
                                name="dbp_night"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-end h-8 col-span-5">อัตราการเต้นหัวใจ</div>
                        <div className="flex items-center h-8 justify-center col-span-2">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.pulse_night == 0 ? '' : HealthStore?.pulse_night}`}
                                name="pulse_night"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="col-span-7 flex justify-center ">
                            {(form.formState.errors.sbp_night || form.formState.errors.dbp_night || form.formState.errors.pulse_night) && (
                                <FormMessage>ERROR NIGHT</FormMessage>
                            )}
                        </div>
                    </div>

                    {/* -------------------------------------------- ค่าน้ำตาลในเลือด -------------------------------------------- */}
                    <div className="bg-[#F5F5F5] grid grid-cols-5 gap-2 items-center justify-center text-xl px-10 py-6">
                        <div className="flex items-center justify-end col-span-5 text-xl">ค่าน้ำตาลในเลือด</div>

                        <div className="flex items-center h-8 justify-end col-span-3 text-base">
                            ก่อนอาหาร เช้า
                            <Image src={"/hygge_healthbook/icon_morning.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="py-[5px] pl-2 w-auto h-full" />
                        </div>
                        <div className="flex items-center h-8 justify-center col-span-2 ">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.glucose_morning == 0 ? '' : HealthStore?.glucose_morning}`}
                                name="glucose_morning"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center h-8 justify-end col-span-3 text-base">
                            ก่อนอาหาร กลางวัน
                            <Image src={"/hygge_healthbook/icon_day.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="py-[3px] pl-2 w-auto h-full" />
                        </div>
                        <div className="flex items-center h-8 justify-center col-span-2 ">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.glucose_afternoon == 0 ? '' : HealthStore?.glucose_afternoon}`}
                                name="glucose_afternoon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center h-8 justify-end col-span-3 text-base">
                            ก่อนอาหาร เย็น
                            <Image src={"/hygge_healthbook/icon_evening.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="py-[5px] pl-2 w-auto h-full" />
                        </div>
                        <div className="flex items-center h-8 justify-center col-span-2 ">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.glucose_evening == 0 ? '' : HealthStore?.glucose_evening}`}
                                name="glucose_evening"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center h-8 justify-end col-span-3 text-base">
                            ก่อนนอน
                            <Image src={"/hygge_healthbook/icon_night.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="py-[5px] pl-2 w-auto h-full" />
                        </div>
                        <div className="flex items-center h-8 justify-center col-span-2 ">
                            <FormField
                                control={form.control}
                                defaultValue={`${HealthStore?.glucose_night == 0 ? '' : HealthStore?.glucose_night}`}
                                name="glucose_night"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center my-4">
                        <Button type="submit" className="bg-[#39CC88] hover:bg-[#8eebbf] px-10 py-6 text-2xl rounded-none shadow-lg"> ตกลง </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
}