const formatCOA = (value: number) => {
    // Konversi nilai ke string
    const stringValue = value.toString();
  
    // Pisahkan digit dan tambahkan titik setiap angka
    const formattedValue = stringValue.split('').join('.');
  
    return formattedValue;
  };
  
  export { formatCOA };