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
import hygge from '@/public/hygge.png'

import liff from "@line/liff"
import { usePatientStore } from "../store";



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
                // checktoken
                // const token_line = res.data.message[0].token_line;
                // console.log("token_line",token_line)

                // if (token_line === !null) {
                //     const profile = await liff.getProfile()
                //     console.log(profile);
                //     setProfile(profile)
                //     setLineId(profile?.userId);

                //     console.warn(lineId);

                //     console.log("profile : ", profile);

                //     const dataSend = {
                //         cid: res.data.message.cid,
                //         token_line: `${profile.userId}`
                //     }


                //     const resUpdate: any = await axios.put(`${pathUrl}/health/hygge_citizen/updatetoken`, dataSend)
                //     console.log("resUpdate", resUpdate.data)
                //     console.log("dataSend", dataSend)
                //     if (resUpdate.data.ok) {
                //         if (resUpdate.data.message === 1) {
                //             router.push("/hospitalbook");
                //         } else {
                //             throw new Error(res.data.error);
                //         }
                //     } else {
                //         throw new Error(res.data.error);
                //     }
                // } else {
                //     Swal.fire({
                //         title: "ไม่มีสิทธ์เข้าใช้งาน",
                //         icon: "error",
                //         html: "กรุณาลงทะเบียน",
                //         showCloseButton: true,
                //         showConfirmButton: false,
                //     }).then(() => {
                //         form.reset();
                //         setIsDisble(false);
                //     });
                // }

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
                        router.replace("/agreement");
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

    // const Clickregister = () => {
    //     router.push("/register");
    //     // router.push("/agreement");


    // };
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
                    src={hygge}
                    alt="scan"
                    width={250}


                />


            </span>


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
                                    className="bg-[#47799A] text-grey drop-shadow-md text-md hover:bg-[#eaefe8] hover:text-grey hover:text-lg"
                                    disabled={isDisble}

                                >
                                    ล็อกอิน
                                </Button>
                            </div>
                        </form>

                    </FormProvider>
                </CardContent>

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
