import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";


export const usePatientStore = create((set: any) => ({
  patient: null,
  updatePatient: (value: any) => set({ patient: value })
}));

export const userStore = create<any>(
  devtools(
    persist(
      (set, get) => ({
        userData: null,
        updateUserData: (value: any) => set({ userData: value }),
      }),
      {
        name: "user",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);


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

interface HealthStore {
  HealthStore: HealthProps | undefined;
  setHealthStore: (newWardInfo: HealthProps | undefined) => void;
  removeHealthStore: () => void;
}

export const useHealthStore = create<HealthStore>((set) => ({
  HealthStore: undefined,
  setHealthStore: (newHealth) => set({ HealthStore: newHealth }),
  removeHealthStore: () => set({ HealthStore: undefined }),
}));


//----------------------------------------------------------- FIRSTTIME -----------------------------------------------------------//


interface FirstTimeStore {
  FirstTimeStore:  boolean;
  setFirstTimeStore: (newWardInfo: boolean) => void;
  removeFirstTimeStore: () => void;
}

export const useFirstTimeStore = create<FirstTimeStore>((set) => ({
  FirstTimeStore: true,
  setFirstTimeStore: (newHealth) => set({ FirstTimeStore: newHealth }),
  removeFirstTimeStore: () => set({ FirstTimeStore: undefined }),
}));




