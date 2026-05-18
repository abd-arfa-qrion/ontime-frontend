export type CurrentPlan = {
  id: number;
  name: string;
  desc: string;
  status: string;
  expDate: Date;
  kuota: number;
};

export const CurrentPlanDefault = {
  id: 0,
  name: "",
  desc: "",
  status: "",
  expDate: new Date(),
  kuota: 0,
};

export type Plan = {
  id: number;
  name: string;
  category: string;
  price: number;
  kuota: number;
  serviceId: number;
};

export const PlanDefault = {
  id: 0,
  name: "",
  category: "",
  price: 0,
  kuota: 0,
  serviceId: 0,
};
