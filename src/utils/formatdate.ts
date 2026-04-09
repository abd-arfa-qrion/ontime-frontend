export const millisToDate = (value: number) => {
  // Konversi nilai ke string
  const date = new Date(value);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const millisToDateTime = (value: number) => {
  // Konversi nilai ke string
  const date = new Date(value);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatDateUS = (date: string) => {
  // Konversi tanggal DD/MM/YYYY menjadi MM/DD/YYYY
  const [day, month, year] = date.split("/"); // Pisahkan menjadi array [DD, MM, YYYY]

  // Menggabungkan tanggal dengan format MM/DD/YYYY dan waktu
  const formattedStartDate = `${month}/${day}/${year}`;
  return formattedStartDate;
};

export const formatTimestamp = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
export const formatCreatedAt = (dateValue: string | Date) => {
  const d = new Date(dateValue);

  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
