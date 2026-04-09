export type InstitutionArea = {
  id: number;
  institutionId: number;
  area: string;
  createdAt: Date;
  updatedAt: Date;
};

export const InstitutionAreaDefault = {
  id: 0,
  institutionId: 0,
  area: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};
