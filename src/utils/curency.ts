const convertIDR = (value: number | string) => {
  const numberValue = Number(value);

  if (isNaN(numberValue)) return "Rp 0"; // fallback kalau input tidak valid

  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(numberValue);
};

export { convertIDR };
