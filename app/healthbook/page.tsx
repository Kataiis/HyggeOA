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
import Component_help from "./component/result/component/Help";
import Component_summary from "./component/summary/component_summary";
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from "react";
import axios from "axios"
import { useFirstTimeStore } from "./component/healthbookStorage";
import { usePatientStore } from "../store";

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


export default function Home() {
  const [isLoading, setIsloading] = useState<boolean>(true);
  const router = useRouter()
  const [data, setData] = useState<HealthProps[]>([]);
  const [activeTab, setActiveTab] = useState("summary");
  const { FirstTimeStore, setFirstTimeStore, removeFirstTimeStore } = useFirstTimeStore();
  const Patient: any = usePatientStore((state: any) => state.patient);


  const FetchData = async () => {
    const datahealth = await axios.get(`${baseURL}/bookinghealth/${Patient?.cid}/cid`);
    if (datahealth.data.ok) {
      setData(datahealth.data.rows)
      // console.log("datahealth", datahealth.data.rows)

    } else {
      throw new Error(datahealth.data.error);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      await setIsloading(true);
      await FetchData();
      await setIsloading(true);
    }
    fetchdata()
  }, []);

  const sortedDataDESC  = useMemo(() => {
    let result = data;
    result = [...data].sort((a, b) => {
      return b.create_date.localeCompare(a.create_date);
    });
    return result;
  }, [data]);

  const sortedDataASC  = useMemo(() => {
    let result = data;
    result = [...data].sort((a, b) => {
      return a.create_date.localeCompare(b.create_date);
    });

    return result;
  }, [data]);

  return (
    <div className='bg-white h-screen flex flex-col'>
      <div className="fixed w-full">
        <div className="h-[69px] bg-[#2D95A1] flex items-center justify-between p-2 text-white font-medium">
          <div onClick={() => setActiveTab("summary")} className="pr-4"><ChevronLeft size={40} /></div>
          <div className='text-xl'>สมุดสุขภาพ</div>
          <div className="w-[40px]">
          </div>
        </div>

        {activeTab === "summary" ? "" :
          <div className="h-[60px] flex items-center justify-center relative text-xl text-center p-2 pt-4 text-[#2C97A3] bg-white font-bold">
            <div>{`${Patient?.pname } ${Patient?.fname } ${Patient?.lname}`}</div>
            <div className="absolute top-3 right-3"><Component_help /></div>
          </div>
        }

      </div>

      <Tabs defaultValue={activeTab} value={activeTab} className={`w-full`}>
        <TabsList className={`grid grid-cols-6 w-full h-[55px] p-0 m-0 bg-white justify-center items-center z-10 ${activeTab === "summary" ? "fixed mt-[61px]" : "fixed mt-[124px]"}`}>
          <TabsTrigger onClick={() => setActiveTab("weight")} value="weight">
            <Image src={"/hygge_healthbook/icon_weight.svg"} priority alt="Image" width={22.19} height={26.69} className="flex flex-row text-center " />
          </TabsTrigger>
          <TabsTrigger onClick={() => setActiveTab("height")} value="height">
            <Image src={"/hygge_healthbook/icon_height.svg"} priority alt="Image" width={10} height={23.25} className="flex flex-row text-center " />
          </TabsTrigger>
          <TabsTrigger onClick={() => setActiveTab("pressure")} value="pressure">
            <Image src={"/hygge_healthbook/icon_pressure.svg"} priority alt="Image" width={27.67} height={29.34} className="flex flex-row text-center pt-1" />
          </TabsTrigger>
          <TabsTrigger onClick={() => setActiveTab("pulse")} value="pulse">
            <Image src={"/hygge_healthbook/icon_pulse.svg"} priority alt="Image" width={28.9} height={28.9} className="flex flex-row text-center pt-1" />
          </TabsTrigger>
          <TabsTrigger onClick={() => setActiveTab("bloodsugar")} value="bloodsugar">
            <Image src={"/hygge_healthbook/icon_bloodsugar.svg"} priority alt="Image" width={23} height={32} className="flex flex-row text-center pl-1" />
          </TabsTrigger>
          <TabsTrigger onClick={() => setActiveTab("bmi")} value="bmi">
            <Image src={"/hygge_healthbook/icon_bmi.svg"} priority alt="Image" width={30} height={34} className="flex flex-row text-center" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="weight">
          <Component_result title={"น้ำหนัก"} description={""} type={"weight"} data={sortedDataDESC} cid={Patient?.cid} />
        </TabsContent>
        <TabsContent value="height">
          <Component_result title={"ส่วนสูง"} description={""} type={"height"} data={sortedDataDESC} cid={Patient?.cid}/>
        </TabsContent>
        <TabsContent value="pressure">
          <Component_result title={"ความดันโลหิต (บน/ล่าง)"} description={""} type={"pressure"} data={sortedDataDESC} cid={Patient?.cid}/>
        </TabsContent>
        <TabsContent value="pulse">
          <Component_result title={"อัตราการเต้นของหัวใจ"} description={""} type={"pulse"} data={sortedDataDESC} cid={Patient?.cid}/>
        </TabsContent>
        <TabsContent value="bloodsugar">
          <Component_result title={"ค่าน้ำตาลในเลือด"} description={"(แสดงค่าบันทึก ก่อนอาหารเช้า)"} type={"bloodsugar"} data={sortedDataDESC} cid={Patient?.cid}/>
        </TabsContent>
        <TabsContent value="bmi">
          <Component_result title={"ดัชนีมวลกาย"} description={""} type={"bmi"} data={sortedDataDESC} cid={Patient?.cid}/>
        </TabsContent>
        <TabsContent value="summary">
          {FirstTimeStore ? <div className="absolute top-3 right-3"><Component_help /></div> : ""}
          <Component_summary data={sortedDataASC} fname={Patient?.fname}/>
        </TabsContent>
      </Tabs>


    </div >
  );
}