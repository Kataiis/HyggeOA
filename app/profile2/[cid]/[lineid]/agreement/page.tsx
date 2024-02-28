"use client"
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import hygge_logo from '@/public/hygge_logo.png'
import pix from '@/public/pix.png'
import { useRouter } from "next/navigation";
import backpage from '@/public/back.png'
// import { usePatientStore } from "../store";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import axios from "axios";


function Agreement({ params }: { params: { cid: string, lineid: string } }) {
    const router = useRouter();
    const pathUrl: any = process.env.pathUrl;
    // const Patient: any = usePatientStore((state: any) => state.patient);
    const back = () => {
        router.back()
    };
    const [isSubscribed, setIsSubscribed] = useState(false);

    const updatedata = async () => {
        setIsSubscribed(false);
        

        const mytimestamp: any = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const res: any = await axios.post(pathUrl + "/health/hiereq/checkin", {
            cid: params.cid,
        });
        if (res.data.ok) {
            if (res.data.message <= 1) {
                Swal.fire({
                    html:
                    '<div><img src="/health-report.gif" />'+
                    '<p style="font-size: 16px; margin-top: 10px">กำลังดึงข้อมูลจากโรงพยาบาล</p>' +
                    '<p style="font-size: 18px; margin-top: 10px">กรุณารอประมาณ 30 วินาที</p>' +
                    '</div>',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                });
                // const text = "REQUEST|" + params.favhos1 + "|" + params.cid + "|" + mytimestamp
                // console.log("text", text)
                // //ไม่เคยมีการ request วันนี้

                // const sentmqtt = await axios.post(`https://hyggemedicalservice.com/apirbh/connectmqtt/hyggeoa`, { messagemqtt: text })

                const timer = setTimeout(() => {
                    // ทำ sweetaler แจ้งเตือน ว่าทำสำเร็จแล้ว
                    Swal.fire({
                        title: "อัพเดทข้อมูลสำเร็จ",
                        icon: "success",
                        allowOutsideClick: false,
                        showConfirmButton: false,
                        timer: 1000
                    }).then(() => {
                        router.replace('/profile')
                    });

                }, 30000);
                return () => clearTimeout(timer);
            } else {
                console.log("have  log in hie_request");
                Swal.close();
                // Swal.fire({
                //     title: "ข้อมูลเป็นปัจจุบันแล้ว",
                //     icon: "success",
                //     allowOutsideClick: false,
                //     showConfirmButton: false,
                //     timer: 2000
                // });
                router.replace('/profile')
            }
        }
    };

    const handleChange = (e: any) => {
        if (e.target.checked) {
            console.log('✅ Checkbox is checked');

        } else {
            console.log('⛔️ Checkbox is NOT checked');
        }
        setIsSubscribed(current => !current);
    };




    return (

        <div>

            <div className='flex justify-center mt-12'>
                <Image
                    priority
                    src={hygge_logo}
                    alt="hygge_logo"
                    width={140}
                    height={140}

                />

            </div>
            <div className="-mt-12 p-10 text-center">
                <p className=" text-md mt-10 font-semibold ">ข้อตกลงให้ความยินยอม</p>
                <p className=''>เพื่อเปิดเผยข้อมูลด้านสุขภาพของบุคคลทางอิเล็กทรอนิกส์</p>
                <p className=' mt-2 font-semibold'> ข้าพเจ้า {params.cid} {params.lineid}
                {/* {params?.pname + params?.fname + " " + params?.lname} */}
                </p>
                <p className=''>เลขประจำตัวประชาชน</p>
                <p className='font-semibold'>{params?.cid}</p>

            </div>
            <div className="-mt-20 p-10 ">
                <p className='mt-2 '>1. ยินยอมให้สถานพยาบาลเปิดเผยข้อมูล /ส่งต่อข้อมูลทางอิเล็กทรอนิกส์ เพื่อประโยชน์ต่อการรักษาพยาบาลแก่ตัวข้าพเจ้าเอง และเจ้าหน้าที่ผู้ประกอบวิชาชีพด้านสาธารณสุขที่ได้รับอนุญาตในการรักษาพยาบาล</p>
                <p className='mt-2 '>2. ยินยอมแลกเปลี่ยนข้อมูลระหว่างสถานพยาบาลโดยสามารถนำข้อมูลระดับบุคคลไปใช้ประโยชน์ในการบริการดูแลสุขภาพ</p>
                <p className='mt-2'>3. ข้าพเจ้าสามารถยกเลิกความยินยอมได้ แต่ไม่มีผลลบล้างความยินยอม และผลแห่งความยินยอมซึ่งได้กระทำไปแล้วก่อนหน้านั้น</p>

            </div>

            <div className="text-center">
                <input
                    type="checkbox"
                    onChange={handleChange}
                    id="subscribe"
                    name="subscribe"
                />
                <span className="ml-5">ข้าพเจ้าให้การยอมรับข้อตกลง</span>



                <br />
                <Button disabled={!isSubscribed}
                    className="bg-[#00AE91] text-[#ffffff] border border-[#ffffff] 
                    text-xl h-[58px] w-[178px] rounded-lg shadow-md shadow-gray-500/100  hover:bg-[#eaefe8] disabled:bg-gray-500 disabled:text-[#ffffff]
                      hover:text-[#00AE91] hover:text-xl mt-5"
                    type="submit"
                    onClick={() => updatedata()}> ตกลง </Button>



            </div>
            <br />

        </div>

    )
}

export default Agreement