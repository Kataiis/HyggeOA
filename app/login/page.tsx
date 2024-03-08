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
import { userStore } from "../store";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from 'next/image'
import hygge_logo from '@/public/hygge_logo.png'

import liff from "@line/liff"
import { usePatientStore } from "../store";
import dayjs from "dayjs";



const Login = () => {
    const [isDisble, setIsDisble] = useState(false);

    const [lineId, setLineId] = useState("");
    const [profile, setProfile] = useState<any>({});
    const pathUrl: any = process.env.pathUrl;
    const router = useRouter();
    const updatePatient: any = usePatientStore((state: any) => state.updatePatient);

    const LoginFormSchema = z.object({
        username: z.string({ required_error: "กรุณาใส่ เลขประจำตัวประชาชน" }),
        password: z.string({ required_error: "กรุณาใส่ Password" }),
    });

    type LoginFormValues = z.infer<typeof LoginFormSchema>;

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });


    const updatedata = async (Patient: any, lineid: any) => {
        // hygge oa  insert request
        const dataIns = {
            req_cid: Patient.cid,
            favhos1: Patient.favhos1,
            line_id: lineid,
        };



        console.log("dataIns", dataIns)

        const resIns: any = await axios.post(pathUrl + "/health/hiereq/store_hyggeoa", dataIns);
        console.log("resIns", resIns.data)

        if (resIns.data.ok) {
            console.log("insert hie_request success");
            console.log("Patient.cid",Patient.cid);
            console.log("lineid",lineid);

            const log = await axios.post(`${pathUrl}/health/phrviewlog/ins`, { cid: Patient.cid, line_id: lineid })
            
            console.log("log", log)
            router.replace("/agreement")

        }

    };

    const onSubmit = async (data: LoginFormValues) => {
        setIsDisble(true);
        // ข้อมูลที่ส่งไปให้ API

        const profile = await liff.getProfile()
        console.log(profile);
        setProfile(profile)
        setLineId(profile?.userId);

        console.warn(lineId);

        console.log("dataSend : ", profile);


        // // ดึงข้อมูลจาก API
        console.log("cid : ", data.username);
        console.log("password : ", data.password);
        const res = await axios.post(`${pathUrl}/health/hygge_citizen/checkbycitizen`, { cid: data.username, passcode: data.password })

        // check token

        console.log("res login : ", res.data);
        if (res.data.ok) {
            console.log("message : ", res.data.message);
            console.log("message.length : ", res.data.message.length);

            if (res.data.message.length > 0) {

                const dataSend = {
                    cid: res.data.message[0].cid,
                    token_line: `${profile.userId}`
                }

                //update token
                const resUpdate: any = await axios.put(`${pathUrl}/health/hygge_citizen/updatetoken`, dataSend)
                console.log("resUpdate", resUpdate.data)
                console.log("dataSend", dataSend)
                if (resUpdate.data.ok) {
                    if (resUpdate.data.message === 1) {
                        const res2 = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: dataSend })
                        updatePatient(res2.data.message[0])
                        updatedata(res2.data.message[0], `${profile.userId}`)

                    } else {
                        throw new Error(res.data.error);
                    }
                } else {
                    throw new Error(res.data.error);
                }
            } else {
                // ไม่มีข้อมูลใน DB

                Swal.fire({
                    title: "เข้าสู่ระบบไม่สำเร็จ",
                    icon: "error",
                    html: "เลขประจำตัวประชาชน หรือ รหัสผ่าน ไม่ถูกต้อง<br>" + "กรุณาลองอีกครั้ง",
                    showCloseButton: true,
                    showConfirmButton: false,
                }).then(() => {
                    form.reset();
                    setIsDisble(false);
                });
            }
        } else {
            throw new Error(res.data.error);
        }
    };

    return (
        <div className="mb-5"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#00AE91",

            }}
        >
            <span style={{ fontSize: "9em", marginRight: "10px" }}>
                <Image
                    priority
                    src={hygge_logo}
                    alt="logo"
                    width={145}
                />
            </span>
            <p className="mt-5 text-3xl text-[#ffffff]">ดิจิทัล เซอร์วิส</p>

            <br></br>

            <Card className=" rounded-2xl ">
                <br></br>

                <CardContent className="mt-6">
                    <FormProvider {...form}>
                        <form
                            id="frmLogin"
                            className="space-y-8"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >

                            <div className="grid w-full items-center gap-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex flex-col space-y-1.5 mb-5 ">
                                                <FormControl>
                                                    <Input
                                                        inputMode="numeric"
                                                        className="text-center text-lg"
                                                        id="username"
                                                        placeholder="เลขประจำตัวประชาชน"
                                                        maxLength={13}
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex flex-col space-y-1.5 mb-5">
                                                <FormControl>
                                                    <Input
                                                        inputMode="numeric"
                                                        className="text-center text-lg"
                                                        id="password"
                                                        type="password"
                                                        placeholder="รหัสผ่าน"
                                                        maxLength={6}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    variant="outline"
                                    className="bg-[#47799A] text-grey drop-shadow-md text-md hover:bg-[#eaefe8] hover:text-grey hover:text-lg text-[#ffffff] h-[45px] w-[250px]"
                                    disabled={isDisble}

                                >
                                    ล็อกอิน
                                </Button>
                            </div>
                        </form>

                    </FormProvider>
                </CardContent>
                <div className="flex justify-center mb-5">
                    <Button
                        type="submit"
                        variant="outline"
                        className="bg-[#53AE85] text-grey drop-shadow-md text-md hover:bg-[#eaefe8] hover:text-grey hover:text-lg text-[#ffffff] h-[45px] w-[250px]"
                        disabled={isDisble}
                        onClick={() => router.replace('/comingsoon')}


                    >
                        ลืม password
                    </Button>
                </div>
            </Card>
            <div className="mt-10">
                <Button
                    type="submit"
                    variant="outline"
                    className="bg-[#00AE91] text-white drop-shadow-lg text-md  hover:bg-[#eaefe8] hover:text-grey hover:text-lg  "
                    onClick={() => router.replace('/register')}

                >
                    วิธีการลงทะเบียน ขอรหัสผ่าน
                </Button>
            </div></div>
    );
};
export default Login;
