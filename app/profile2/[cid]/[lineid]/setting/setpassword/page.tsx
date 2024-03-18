"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input"
import { FormProvider, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from 'next/image'
import hygge_logo from '@/public/hygge_logo.png'
import liff from "@line/liff"
import { usePatientStore } from "@/app/store"
import lockgreen from "@/public/lockgreen.png"

import lockgray from "@/public/lockgray.png"
import back from '@/public/back.png'
import Navbardigital from "@/app/profile/components/Navbardigital";


const Setpassword = () => {

    const pathUrl: any = process.env.pathUrl;
    const Patient: any = usePatientStore((state: any) => state.patient);

    const [isDisble, setIsDisble] = useState(false);

    const [lineId, setLineId] = useState("");
    const [profile, setProfile] = useState<any>({});
    const router = useRouter();

    const LoginFormSchema = z.object({
        password: z.string({ required_error: "กรุณาใส่ เลขประจำตัวประชาชน" }),
        npassword: z.string({ required_error: "กรุณาใส่ Password" }),
        cpassword: z.string({ required_error: "กรุณายืนยันรหัสผ่าน" }),
    });

    type LoginFormValues = z.infer<typeof LoginFormSchema>;

    const backPage = () => {
        router.replace('./')
    };



    // const updatedata = async (Patient: any, lineid: any) => {
    //     // hygge oa  insert request
    //     const dataIns = {
    //         req_cid: Patient.cid,
    //         favhos1: Patient.favhos1,
    //         line_id: lineid,
    //     };



    //     console.log("dataIns", dataIns)

    //     const resIns: any = await axios.post(pathUrl + "/health/hiereq/store_hyggeoa", dataIns);
    //     console.log("resIns", resIns.data)

    //     if (resIns.data.ok) {
    //         console.log("insert hie_request success");
    //         console.log("Patient.cid", Patient.cid);
    //         console.log("lineid", lineid);

    //         const log = await axios.post(`${pathUrl}/health/phrviewlog/ins`, { cid: Patient.cid, line_id: lineid })

    //         console.log("log", log)
    //         router.replace("/agreement")

    //     }

    // };

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            password: "",
            npassword: "",
            cpassword: "",
        },
    });
    // const onSubmit = async (data: LoginFormValues) => {

    //     setIsDisble(true);
    //     // ข้อมูลที่ส่งไปให้ API

    //     const profile = await liff.getProfile()
    //     console.log(profile);
    //     setProfile(profile)
    //     setLineId(profile?.userId);

    //     console.warn(lineId);

    //     console.log("dataSend : ", profile);


    //     // // ดึงข้อมูลจาก API
    //     console.log("cid : ", data.username);
    //     console.log("password : ", data.password);
    //     const res = await axios.post(`${pathUrl}/health/hygge_citizen/checkbycitizen`, { cid: data.username, passcode: data.password })

    //     // check token

    //     console.log("res login : ", res.data);
    //     if (res.data.ok) {
    //         console.log("message : ", res.data.message);
    //         console.log("message.length : ", res.data.message.length);

    //         if (res.data.message.length > 0) {

    //             const dataSend = {
    //                 cid: res.data.message[0].cid,
    //                 token_line: `${profile.userId}`
    //             }

    //             //update token
    //             const resUpdate: any = await axios.put(`${pathUrl}/health/hygge_citizen/updatetoken`, dataSend)
    //             console.log("resUpdate", resUpdate.data)
    //             console.log("dataSend", dataSend)
    //             if (resUpdate.data.ok) {
    //                 if (resUpdate.data.message === 1) {
    //                     const res2 = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: dataSend })
    //                     // updatePatient(res2.data.message[0])
    //                     // updatedata(res2.data.message[0], `${profile.userId}`)

    //                 } else {
    //                     throw new Error(res.data.error);
    //                 }
    //             } else {
    //                 throw new Error(res.data.error);
    //             }
    //         } else {
    //             // ไม่มีข้อมูลใน DB

    //             Swal.fire({
    //                 title: "เข้าสู่ระบบไม่สำเร็จ",
    //                 icon: "error",
    //                 html: "เลขประจำตัวประชาชน หรือ รหัสผ่าน ไม่ถูกต้อง<br>" + "กรุณาลองอีกครั้ง",
    //                 showCloseButton: true,
    //                 showConfirmButton: false,
    //             }).then(() => {
    //                 form.reset();
    //                 setIsDisble(false);
    //             });
    //         }
    //     } else {
    //         throw new Error(res.data.error);
    //     }
    // };

    return (
        <div>
           <div>
                    <Navbardigital />
                    <div className="absolute left-8 top-5 h-16 w-16 z-0 ">
                        <Image
                            priority
                            src={back}
                            alt="scan"
                            height={25}
                            onClick={backPage}
                        />
                    </div>
                </div>

            <div className="m-10">
                <div className="bg-red-500 text-[#ffffff] text-2xl flex justify-center mt-5 p-3 mb-5"> เปลี่ยนรหัสผ่าน</div>

                <Card >

                    <p className="text-2xl text-center mt-5">{Patient?.pname}{Patient?.fname} {Patient?.lname}</p>
                    <CardContent className="mt-6">

                        <FormProvider {...form}>
                            <form
                                id="frmLogin"
                                className="space-y-8"
                            // onSubmit={form.handleSubmit(onSubmit)}
                            >

                                <div className="grid w-full items-center gap-4">

                                    {/* รหัสผ่านปัจจุบัน */}
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-row">

                                                    <div className="w-11">
                                                        <label className="relative block">
                                                            <span className="sr-only">Password</span>
                                                            <span className="flex items-center">
                                                                <Image
                                                                    priority
                                                                    src={lockgray}
                                                                    alt="Password"
                                                                    height={40}
                                                                    width={40}
                                                                />
                                                                <svg className="h-10 w-10 fill-slate-300" viewBox="0 0 20 20"></svg>
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="grow w-14">
                                                        <FormControl className="border-gray-500	">
                                                            <Input
                                                                inputMode="numeric"
                                                                className="text-center text-lg"
                                                                id="password"
                                                                type="password"
                                                                placeholder="รหัสผ่านปัจจุบัน"
                                                                maxLength={6}
                                                                {...field}
                                                            />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </div>

                                                </div>
                                            </FormItem>
                                        )}

                                    />

                                    {/* รหัสผ่านใหม่ */}
                                    <FormField
                                        control={form.control}
                                        name="npassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-row">

                                                    <div className="w-11">
                                                        <label className="relative block">
                                                            <span className="sr-only">NewPassword</span>
                                                            <span className="flex items-center">
                                                                <Image
                                                                    priority
                                                                    src={lockgreen}
                                                                    alt="Password"
                                                                    height={40}
                                                                    width={40}
                                                                />
                                                                <svg className="h-10 w-10 fill-slate-300" viewBox="0 0 20 20"></svg>
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="grow w-14">
                                                        <FormControl className="border-green-500">
                                                            <Input
                                                                inputMode="numeric"
                                                                className="text-center text-lg"
                                                                id="npassword"
                                                                type="password"
                                                                placeholder="รหัสผ่านใหม่"
                                                                maxLength={6}
                                                                {...field}
                                                            />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </div>

                                                </div>
                                            </FormItem>
                                        )}

                                    />

                                    {/* ยืนยันรหัสผ่านใหม่ */}
                                    <FormField
                                        control={form.control}  
                                        name="cpassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-row">

                                                    <div className="w-11">
                                                        <label className="relative block">
                                                            <span className="sr-only">ConfirmPassword</span>
                                                            <span className="flex items-center">
                                                                <Image
                                                                    priority
                                                                    src={lockgreen}
                                                                    alt="Password"
                                                                    height={40}
                                                                    width={40}
                                                                />
                                                                <svg className="h-10 w-10 fill-slate-300" viewBox="0 0 20 20"></svg>
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="grow w-14">
                                                        <FormControl className="border-green-500">
                                                            <Input
                                                                inputMode="numeric"
                                                                className="text-center text-lg"
                                                                id="cpassword"
                                                                type="password"
                                                                placeholder="ยืนยันรหัสผ่าน"
                                                                maxLength={6}
                                                                {...field}
                                                            />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </div>

                                                </div>
                                            </FormItem>
                                        )}

                                    />
                                    <div className="flex justify-center">
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="bg-[#2150C9] text-grey drop-shadow-md text-xl  hover:bg-[#eaefe8] hover:text-grey hover:text-lg text-[#ffffff] h-[54px] w-[200px] "
                                            disabled={isDisble}

                                        >
                                            ยืนยัน
                                        </Button>
                                    </div>
                                </div>
                            </form>

                        </FormProvider>
                    </CardContent>



                </Card>

            </div>
        </div>
    );
};
export default Setpassword;
