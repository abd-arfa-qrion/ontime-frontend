// utils/tahunAjaran.ts

export type Semester = "GANJIL" | "GENAP";

export function getTahunAjaranWithSemester(date: Date = new Date()): {
  ta: string;
  semester: Semester;
} {
  const month = date.getMonth() + 1; // 1 - 12
  const year = date.getFullYear();

  let startYear: number;
  let endYear: number;
  let semester: Semester;

  if (month >= 7) {
    // Juli - Desember => GANJIL
    startYear = year;
    endYear = year + 1;
    semester = "GANJIL";
  } else {
    // Januari - Juni => GENAP
    startYear = year - 1;
    endYear = year;
    semester = "GENAP";
  }

  return {
    ta: `${startYear}/${endYear}`,
    semester,
  };
}
