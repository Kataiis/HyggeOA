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
import { Loader2 } from 'lucide-react';

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

interface PatientProps {
  age_d: any;
  age_m: any;
  age_y: any;
  birthday: any;
  bloodgroup: any;
  cid: any;
  favhos1: any;
  fname: any;
  gender: any;
  lname: any;
  pname: any;
  pttype_name: any;
  token_line: any;
}

const baseURL = process.env.APIKey;
const pathUrl: any = process.env.pathUrl;


export default function Home({ params }: { params: { cid: string, lineid: string } }) {
  const [isLoading, setIsloading] = useState<boolean>(true);
  const router = useRouter()
  const [data, setData] = useState<HealthProps[]>([]);
  const [activeTab, setActiveTab] = useState("summary");
  const { FirstTimeStore, setFirstTimeStore, removeFirstTimeStore } = useFirstTimeStore();
  const [patient, setPatient] = useState<PatientProps>();
  const [lineid, setLineid] = useState<string>();



  const FetchData = async () => {
    const datahealth = await axios.get(`${baseURL}/bookinghealth/${patient?.cid}/cid`);


    if (datahealth.data.ok) {
      setData(datahealth.data.rows)

    } else {
      throw new Error(datahealth.data.error);
    }
  };

  const getPatient = async () => {
    const response = await axios.post(`${pathUrl}/health/hygge_citizen/bycid`, { cid: params.cid })
      // .then((response) => {
      //   setPatient(response.data.message[0]);
      //   setLineid(params.lineid)
      //   console.log(response.data.message[0])
      //   setPatient(response.data.message[0]);

      // });
      if (response.data.ok) {
        setPatient(response.data.message[0]);
          setLineid(params.lineid)

      } else {
        throw new Error(response.data.error);
      }

  }

  useEffect(() => {
    const fetchdata = async () => {
      await setIsloading(true);
      if(patient == undefined || params.cid != patient.cid){
        await getPatient();
      }
      if(patient != undefined){
        await FetchData();
      }
      await setIsloading(false);
      await console.log("patient", patient)

    }
    fetchdata()

  }, [patient]);


  const sortedDataDESC = useMemo(() => {
    let result = data;
    result = [...data].sort((a, b) => {
      return b.create_date.localeCompare(a.create_date);
    });
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
      <div className="fixed w-full">
        <div className="h-[69px] bg-[#2D95A1] flex items-center justify-between p-2 text-white font-medium">
          <div onClick={() => { setActiveTab("summary"); { activeTab == "summary" ? router.replace("../../" + patient?.cid + "/" + lineid) : "" }; }}
            className="pr-4"><ChevronLeft size={40} /></div>
          <div className='text-xl'>สมุดสุขภาพ</div>
          <div className="w-[40px]">
          </div>
        </div>

        {activeTab === "summary" ? "" :
          <div className="h-[60px] flex items-center justify-center relative text-xl text-center p-2 pt-4 text-[#2C97A3] bg-white font-bold">
            <div>{`${patient?.pname} ${patient?.fname} ${patient?.lname}`}</div>
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

        {isLoading ?
          <div className="flex flex-col justify-center items-center text-gray-400 pt-[72pt] animate-pulse" >
            <div className="animate-spin mt-20">
              <Loader2 size={75} />
            </div>
            <div className="text-3xl py-4 ">{`Loading...`}</div>
          </div>

          :
          <> <TabsContent value="weight">
            <Component_result title={"น้ำหนัก"} description={""} type={"weight"} data={sortedDataDESC} cid={patient?.cid} lineid={lineid} />
          </TabsContent>
            <TabsContent value="height">
              <Component_result title={"ส่วนสูง"} description={""} type={"height"} data={sortedDataDESC} cid={patient?.cid} lineid={lineid} />
            </TabsContent>
            <TabsContent value="pressure">
              <Component_result title={"ความดันโลหิต (บน/ล่าง)"} description={""} type={"pressure"} data={sortedDataDESC} cid={patient?.cid} lineid={lineid} />
            </TabsContent>
            <TabsContent value="pulse">
              <Component_result title={"อัตราการเต้นของหัวใจ"} description={""} type={"pulse"} data={sortedDataDESC} cid={patient?.cid} lineid={lineid} />
            </TabsContent>
            <TabsContent value="bloodsugar">
              <Component_result title={"ค่าน้ำตาลในเลือด"} description={"(แสดงค่าบันทึก ก่อนอาหารเช้า)"} type={"bloodsugar"} data={sortedDataDESC} cid={patient?.cid} lineid={lineid} />
            </TabsContent>
            <TabsContent value="bmi">
              <Component_result title={"ดัชนีมวลกาย"} description={""} type={"bmi"} data={sortedDataDESC} cid={patient?.cid} lineid={lineid} />
            </TabsContent>
            <TabsContent value="summary">
              {FirstTimeStore ? <div className="absolute top-3 right-3"><Component_help /></div> : ""}
              <Component_summary data={sortedDataASC} fname={patient?.fname} />
            </TabsContent>
          </>
        }




      </Tabs>



    </div >
  );
}