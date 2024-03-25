"use client";
import React, { useEffect, useState } from "react";
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






const Setpassword = ({ params }: { params: { cid: string, lineid: string } }) => {

    const pathUrl: any = process.env.pathUrl;
    const Patient: any = usePatientStore((state: any) => state.patient);

    const [isDisble, setIsDisble] = useState(false);
    const [lineId, setLineId] = useState("");
    const [profile, setProfile] = useState<any>({});
    const router = useRouter();
    const [patient, setPatient] = useState<any>([]);


    const SignUpSchema = z.object({

        password: z.string().min(1, { message: "กรุณาใส่รหัสผ่านปัจจุบัน" }),
        npassword: z.string().min(1, { message: "กรุณาใส่รหัสผ่านใหม่" }),
        cpassword: z.string().min(1, { message: "กรุณายืนยันรหัสผ่าน" }),
    });



    type SignUpSchemaType = z.infer<typeof SignUpSchema>;

    const SignUphForm = useForm<SignUpSchemaType>({
        resolver: zodResolver(SignUpSchema),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SignUpSchemaType>
            ({ resolver: zodResolver(SignUpSchema) });


    const backPage = () => {
        router.replace('./')
    };


    const onSubmit = async (data: SignUpSchemaType) => {
        // setIsDisble(true);
        console.log("data", data)

        console.log("patient", patient)
        if (data.password === patient.passcode)
            if (data.npassword == data.cpassword) {
                const res = await axios.put(`${pathUrl}/health/hygge_citizen/updatepasscode`, { cid: params.cid, passcode: data.npassword })

                Swal.fire({
                    title: "เปลี่ยนรหัสผ่านสำเร็จ",
                    icon: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "ตกลง",
                })
                reset();
            }
            else {
                Swal.fire({
                    text: "กรุุณายืนยันรหัสผ่านให้ตรงกัน",
                    icon: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "ตกลง",
                })
                reset();
            } else {
            Swal.fire({
                text: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
                icon: "error",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง",
            })
            reset();
        }
    };

    useEffect(() => {

        const getPatient = async () => {
            const res: any = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: params.cid }).then((v: any) =>
                setPatient(v.data.message[0]));
        }
        getPatient();


    }, [])


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

                        <FormProvider {...SignUphForm}>
                            <form
                                id="frmLogin"
                                className="space-y-8"
                                // onSubmit={form.handleSubmit(onSubmit)}
                                onSubmit={handleSubmit(onSubmit)}
                            >

                                <div className="grid w-full items-center gap-4">

                                    {/* รหัสผ่านปัจจุบัน */}
                                    <FormField

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
                                                                {...register("password")}
                                                            />
                                                        </FormControl>
                                                        {errors.password && (
                                                            <p className="text-xs italic text-red-500 mt-2">
                                                                {errors.password?.message}
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>
                                            </FormItem>
                                        )}

                                    />

                                    {/* รหัสผ่านใหม่ */}
                                    <FormField
                                        control={SignUphForm.control}
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
                                                                {...register("npassword")}

                                                            />
                                                        </FormControl>
                                                        {errors.npassword && (
                                                            <p className="text-xs italic text-red-500 mt-2">
                                                                {errors.npassword?.message}
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>
                                            </FormItem>
                                        )}

                                    />

                                    {/* ยืนยันรหัสผ่านใหม่ */}
                                    <FormField
                                        // control={form.control}
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
                                                                {...register("cpassword")}
                                                            />
                                                        </FormControl>
                                                        {errors.cpassword && (
                                                            <p className="text-xs italic text-red-500 mt-2">
                                                                {errors.cpassword?.message}
                                                            </p>
                                                        )}
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
