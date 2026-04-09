const NamaBulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
export default NamaBulan;

export const getBulan = (bulan: number) => NamaBulan[bulan];
