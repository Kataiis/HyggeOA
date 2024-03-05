'use client';

import Image from "next/image";
import { ChevronLeft } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabsv2"
import Component_result from "./component/result/component_result";
import Component_help from "./component/Help";
import Component_summary from "./component/summary/component_summary";
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from "react";
import axios from "axios"
import { useFirstTimeStore } from "./component/healthbookStorage";

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
const pathUrl: any = process.env.pathUrl;


export default function Home({ params }: { params: { cid: string, lineid: string } }) {
  const [isLoading, setIsloading] = useState<boolean>(true);
  const router = useRouter()
  const [data, setData] = useState<HealthProps[]>([]);
  const [activeTab, setActiveTab] = useState("summary");
  const { FirstTimeStore, setFirstTimeStore, removeFirstTimeStore } = useFirstTimeStore();
  const [patient, setPatient] = useState<any>([]);



  const FetchData = async () => {
    const datahealth = await axios.get(`${baseURL}/bookinghealth/${params.cid}/cid`);

    if (datahealth.data.ok) {
      setData(datahealth.data.rows)

    } else {
      throw new Error(datahealth.data.error);
    }
  };

  const getPatient = async () => {
    const res: any = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: params.cid })
      .then((v: any) => setPatient(v.data.message[0]));
  }

  useEffect(() => {
    console.log(params.cid)
    const fetchdata = async () => {
      await setIsloading(true);
      await getPatient();
      await FetchData();
      await setIsloading(false);
    }
    fetchdata()

  }, []);


  const sortedDataDESC = useMemo(() => {
    let result = data;
    result = [...data].sort((a, b) => {
      return b.create_date.localeCompare(a.create_date);
    });
    // console.log("sortedData", JSON.stringify(result));
    // console.log("sortedData", result);

    return result;
  }, [data]);

  const sortedDataASC = useMemo(() => {
    let result = data;
    result = [...data].sort((a, b) => {
      return a.create_date.localeCompare(b.create_date);
    });

    return result;
  }, [data]);

  return (
    <div className='bg-white h-screen flex flex-col'>
      {isLoading ?
        <div>
          <div className="flex justify-center items-center w-full mt-20">

            <div className="animate-pulse flex space-x-4  justify-center items-center">
              <Image
                priority
                src={"/loading.png"}
                alt="loading"
                width={100}
                height={100} />

            </div>

          </div>
          <div className="flex justify-center mt-4 text-[#65B16D]">
            <p className="text-center font-semibold	">กำลังดึงข้อมูลจากโรงพยาบาล <br />กรุณารอประมาณ 30 วินาที</p>
          </div>
        </div>

        : <>
          <div className="fixed w-full">
            <div className="h-[69px] bg-[#2D95A1] flex items-center justify-between p-2 text-white font-medium">
              <div onClick={() => { setActiveTab("summary"); { activeTab == "summary" ? router.replace("../../" + params.cid + "/" + params.lineid) : "" }; }}
                className="pr-4"><ChevronLeft size={40} /></div>
              <div className='text-xl'>สมุดสุขภาพ</div>
              <div className="w-[40px]">
              </div>
            </div>

            {activeTab === "summary" ? "" :
              <div className="h-[60px] flex items-center justify-center relative text-xl text-center p-2 pt-4 text-[#2C97A3] bg-white font-bold">
                <div>{`${patient.pname} ${patient.fname} ${patient.lname}`}</div>
                <div className="absolute top-3 right-3"><Component_help /></div>
              </div>
            }

          </div>

          <Tabs defaultValue={activeTab} value={activeTab} className={`w-full rounded-none`}>
            <TabsList className={`grid grid-cols-6 w-full h-[60px] rounded-none p-0 m-0 bg-white justify-center items-center z-10 ${activeTab === "summary" ? "fixed mt-[69px]" : "fixed mt-[124px]"}`}>
              <TabsTrigger onClick={() => setActiveTab("weight")} value="weight">
                <Image src={"/hygge_healthbook/icon_weight.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="p-2 w-auto h-full" />
              </TabsTrigger>
              <TabsTrigger onClick={() => setActiveTab("height")} value="height">
                <Image src={"/hygge_healthbook/icon_height.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="p-1 w-auto h-full" />
              </TabsTrigger>
              <TabsTrigger onClick={() => setActiveTab("pressure")} value="pressure">
                <Image src={"/hygge_healthbook/icon_pressure.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="pt-3 p-2 w-full h-auto" />
              </TabsTrigger>
              <TabsTrigger onClick={() => setActiveTab("pulse")} value="pulse">
                <Image src={"/hygge_healthbook/icon_pulse.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="pt-2 p-1  w-full h-auto" />
              </TabsTrigger>
              <TabsTrigger onClick={() => setActiveTab("bloodsugar")} value="bloodsugar">
                <Image src={"/hygge_healthbook/icon_bloodsugar.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="pl-2 p-1 w-auto h-full" />
              </TabsTrigger>
              <TabsTrigger onClick={() => setActiveTab("bmi")} value="bmi">
                <Image src={"/hygge_healthbook/icon_bmi.svg"} priority alt="Image" width="0" height="0" sizes="100vw" className="p-2 w-full h-auto" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="weight">
              <Component_result title={"น้ำหนัก"} description={""} type={"weight"} data={sortedDataDESC} cid={patient.cid} lineid={params.lineid} />
            </TabsContent>
            <TabsContent value="height">
              <Component_result title={"ส่วนสูง"} description={""} type={"height"} data={sortedDataDESC} cid={patient.cid} lineid={params.lineid} />
            </TabsContent>
            <TabsContent value="pressure">
              <Component_result title={"ความดันโลหิต (บน/ล่าง)"} description={""} type={"pressure"} data={sortedDataDESC} cid={patient.cid} lineid={params.lineid} />
            </TabsContent>
            <TabsContent value="pulse">
              <Component_result title={"อัตราการเต้นของหัวใจ"} description={""} type={"pulse"} data={sortedDataDESC} cid={patient.cid} lineid={params.lineid} />
            </TabsContent>
            <TabsContent value="bloodsugar">
              <Component_result title={"ค่าน้ำตาลในเลือด"} description={"(แสดงค่าบันทึก ก่อนอาหารเช้า)"} type={"bloodsugar"} data={sortedDataDESC} cid={patient.cid} lineid={params.lineid} />
            </TabsContent>
            <TabsContent value="bmi">
              <Component_result title={"ดัชนีมวลกาย"} description={""} type={"bmi"} data={sortedDataDESC} cid={patient.cid} lineid={params.lineid} />
            </TabsContent>
            <TabsContent value="summary">
              {FirstTimeStore ? <div className="absolute top-3 right-3"><Component_help /></div> : ""}
              <Component_summary data={sortedDataASC} fname={patient.fname} />
            </TabsContent>
          </Tabs>
        </>
      }



    </div >
  );
}