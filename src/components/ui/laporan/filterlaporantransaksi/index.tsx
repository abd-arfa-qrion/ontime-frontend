import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import styles from "./BagFilter.module.scss";
import ReactDatePicker from "react-datepicker";

const options = [
  { value: "0", label: "All Transaksi" },
  { value: "sukses", label: "Transaksi Sukses" },
  { value: "gagal", label: "Transaksi Gagal" },
];

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
  getAllTransaksi: (e: { selected: string; dataDate: any }) => void;
  isLoading: string;
  setIsLoading: Dispatch<SetStateAction<string>>;
};
const FilterLaporanTransaksi = (prop: Proptypes) => {
  const { setToaster, getAllTransaksi, isLoading, setIsLoading } = prop;
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading("searchLapBayar");
    e.preventDefault();
    if (dateRange[0] !== null && dateRange[1] !== null) {
      const sDate = new Date(dateRange[0]);
      const eDate = new Date(dateRange[1]);

      // Set jam awal dan akhir
      sDate.setHours(0, 0, 0, 0); // 00:00:00.000
      eDate.setHours(23, 59, 59, 999); // 23:59:59.999

      const millisStartDate = sDate.getTime();
      const millisEndDate = eDate.getTime();

      const dataDate = {
        startDate: millisStartDate,
        endDate: millisEndDate,
      };

      if (selectedOption) {
        getAllTransaksi({ selected: selectedOption, dataDate: dataDate });
      } else {
        setError(true);
        setHelperText("Please select an option");
        setIsLoading("");
      }
    } else {
      setError(true);
      setHelperText("Please select a date range");
      setIsLoading("");
    }
  };
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };
  const CustomInput = ({ value, onClick, placeholderText }: any) => (
    <input
      className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full"
      onClick={onClick}
      value={value}
      autoComplete="off" // Disable browser auto-complete
      placeholder={placeholderText}
      required
      readOnly // Optional, to prevent manual input if needed
    />
  );
  const handleTglLaporan = (update: any) => {
    setDateRange(update);
  };
  return (
    <div className={styles.bagfilter}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Pilih...</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedOption}
          label="Options"
          onChange={handleChange}
          className={styles.bagfilter__select}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {selectedOption !== "" && (
          <div className="mt-3 flex flex-col gap-1 rounded-md p-1">
            <p>Pilih Tanggal Laporan:</p>
            <ReactDatePicker
              className="w-full mt-3 flex"
              customInput={<CustomInput placeholderText="Tanggal Laporan" />}
              showIcon
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={handleTglLaporan} // Update state saat user memilih range
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dateFormat="dd/MM/yyyy"
              name="tglLaporan"
              maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
            />
          </div>
        )}
      </FormControl>
      <form onSubmit={handleSearch} className={styles.bagfilter__form}>
        {selectedOption === "search" && (
          <TextField
            className={styles.bagfilter__search}
            id="outlined-basic"
            label="Kelas"
            variant="outlined"
            name="search"
            error={error}
            helperText={helperText}
          />
        )}

        <Button
          className={styles.bagfilter__btn}
          variant="contained"
          color="success"
          type="submit"
          disabled={isLoading === "searchLapBayar"}
        >
          {isLoading === "searchLapBayar" ? (
            <div className="box-loader items-center">
              <div className="loader" />
              <p>mendownload...</p>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <i className="bx bxs-file-export text-lg"></i>Download
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default FilterLaporanTransaksi;
