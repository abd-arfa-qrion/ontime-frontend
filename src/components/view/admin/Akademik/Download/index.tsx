import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Kaldik } from "@/type/Kaldik.type";

type EventMapValue = {
  code: string;
  label: string;
};

const formatDateKey = (year: number, month: number, day: number) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "");

  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
};

const buildAcademicMonths = (ta: string) => {
  const startYear = Number(ta.split("/")[0]);

  return [
    { year: startYear, month: 7, name: "JULI" },
    { year: startYear, month: 8, name: "AGUSTUS" },
    { year: startYear, month: 9, name: "SEPTEMBER" },
    { year: startYear, month: 10, name: "OKTOBER" },
    { year: startYear, month: 11, name: "NOVEMBER" },
    { year: startYear, month: 12, name: "DESEMBER" },

    { year: startYear + 1, month: 1, name: "JANUARI" },
    { year: startYear + 1, month: 2, name: "FEBRUARI" },
    { year: startYear + 1, month: 3, name: "MARET" },
    { year: startYear + 1, month: 4, name: "APRIL" },
    { year: startYear + 1, month: 5, name: "MEI" },
    { year: startYear + 1, month: 6, name: "JUNI" },
  ];
};

const buildEventMap = (data: Kaldik[]): Record<string, EventMapValue> => {
  const map: Record<string, EventMapValue> = {};

  data.forEach((item) => {
    const start = new Date(item.tgl_awal);
    const end = new Date(item.tgl_akhir);

    let current = new Date(start);

    while (current <= end) {
      const key = formatDateKey(
        current.getFullYear(),
        current.getMonth() + 1,
        current.getDate(),
      );

      map[key] = {
        code: item.code,
        label: item.label,
      };

      current.setDate(current.getDate() + 1);
    }
  });

  console.log("EVENT MAP:", map);

  return map;
};

export const DownloadKaldik = async (
  data: Kaldik[],
  onProgress?: (value: number) => void,
) => {
  if (!data.length) return;

  try {
    onProgress?.(10);

    const ta = data[0].ta;

    const months = buildAcademicMonths(ta);

    const eventMap = buildEventMap(data);

    const codeMap: Record<
      string,
      {
        code: string;
        keterangan: string;
        label: string;
      }
    > = {};

    data.forEach((item) => {
      codeMap[item.code] = {
        code: item.code,
        keterangan: item.keterangan,
        label: item.label,
      };
    });

    const codeDescriptions = Object.values(codeMap);

    console.log("TOTAL LEGEND:", codeDescriptions.length);
    console.log("LEGEND DATA:", codeDescriptions);

    const rows: any[] = [];

    const colorMap: Record<string, string> = {};

    months.forEach((item, rowIndex) => {
      const row: any[] = [];

      let heb = 0;

      row.push(rowIndex + 1);
      row.push(item.name);
      row.push(item.year);

      const totalDays = new Date(item.year, item.month, 0).getDate();

      for (let day = 1; day <= 31; day++) {
        if (day > totalDays) {
          row.push("");
          continue;
        }

        const key = formatDateKey(item.year, item.month, day);
        const event = eventMap[key];

        if (event) {
          row.push(event.code);

          colorMap[`${rowIndex}-${day}`] = event.label;
        } else {
          row.push("HEB");
          heb++;
        }
      }

      row.push(heb);

      rows.push(row);
    });

    onProgress?.(40);

    const pdf = new jsPDF({
      orientation: "landscape",
      format: "a3",
    });

    // Bagian Judul dokument
    const titleY = 20; // vertikal
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");

    pdf.text(`KALENDER AKADEMIK TAHUN AJARAN ${ta}`, pageWidth / 2, titleY, {
      align: "center",
    });
    // END Bagian Judul dokument

    // Auto Table Bagian Isi Dokument
    autoTable(pdf, {
      startY: 28,

      head: [
        [
          "No",
          "Bulan",
          "Tahun",
          ...Array.from({ length: 31 }, (_, i) => String(i + 1)),
          "HEB",
        ],
      ],

      body: rows,

      styles: {
        fontSize: 5,
        halign: "center",
        valign: "middle",
        lineWidth: 0.1, // border tipis
        lineColor: [180, 180, 180], // abu-abu halus
      },

      columnStyles: {
        0: { cellWidth: 6 },
        1: { cellWidth: 18 },
        2: { cellWidth: 10 },
      },

      didParseCell: (hookData) => {
        if (hookData.section !== "body") return;

        const row = hookData.row.index;
        const col = hookData.column.index;

        if (col >= 3 && col <= 33) {
          const day = col - 2;

          const color = colorMap[`${row}-${day}`];

          if (color) {
            hookData.cell.styles.fillColor = hexToRgb(color);
            hookData.cell.styles.textColor = [255, 255, 255];
          }
        }
      },
    });
    // END Auto Table Bagian Isi Dokument

    // Bagian Keterangan
    const finalY = (pdf as any).lastAutoTable.finalY + 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");

    pdf.text("KETERANGAN :", 14, finalY);

    pdf.setFont("helvetica", "normal");

    const startY = finalY + 8;

    const rowPerColumn = 15;

    const columnWidth = 120;

    codeDescriptions.forEach((item, index) => {
      const column = Math.floor(index / rowPerColumn);

      const row = index % rowPerColumn;

      console.log({
        index,
        code: item.code,
        column,
        row,
      });

      const x = 14 + column * columnWidth;

      const y = startY + row * 6;

      const rgb = hexToRgb(item.label);

      pdf.setFillColor(rgb[0], rgb[1], rgb[2]);

      pdf.rect(x, y - 3, 4, 4, "F");

      pdf.text(`${item.code} : ${item.keterangan}`, x + 8, y);
    });
    // END bagian keterangan

    onProgress?.(90);

    pdf.save(`KALDIK-${ta}.pdf`);

    onProgress?.(100);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
