export type Semester = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  statusId: string;
  institutionId: number;
  yayasanId: number;
  academicYearId: number;
};

export const SemesterDefault = {
  id: 0,
  name: "",
  startDate: new Date(),
  endDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  statusId: "",
  institutionId: 0,
  yayasanId: 0,
  academicYearId: 0,
};
