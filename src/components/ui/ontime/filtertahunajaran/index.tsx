import taSmesterServices from "@/pages/api/services/tasmester";
import { useTahunAjaranStore } from "@/store/tahunAjaranStore";
import { TaFilter } from "@/type/Tahunajaran.type";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type Proptype = {
  filterTA: string;
  setFilterTA: React.Dispatch<React.SetStateAction<string>>;
};
const FilterTahunAjaran = (prop: Proptype) => {
  const { filterTA, setFilterTA } = prop;

  const [selectedOption, setSelectedOption] = useState("");
  const [taDataFilter, setTaDataFilter] = useState<TaFilter[]>([]);

  const session: any = useSession();
  // const ta = useTahunAjaranStore((state) => state.activeTahunAjaran);

  const getTahunAjaran = async () => {
    const data = {
      inst: session.data?.user?.instansiId,
    };
    try {
      const res = await taSmesterServices.getDataTAFilter(
        data,
        session.data?.accessToken,
      );
      if (res.status !== 200) {
        console.log(res);
      } else {
        setTaDataFilter(res.data.data);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      console.log(taDataFilter);
    }
  };

  useEffect(() => {
    if (!session?.data?.accessToken) return;
    const loadData = async () => {
      await getTahunAjaran(); // tunggu selesai du
    };

    if (session.status === "authenticated") {
      loadData();
    }
  }, [session.status]);

  useEffect(() => {
    if (taDataFilter.length === 0) return;
    const { ta } = getTahunAjaranWithSemester();
    const found = taDataFilter.find((item) => item.name.includes(ta));
    // console.log("ini id ta saat ini: ", found?.id);
    if (found) {
      setSelectedOption(found.id.toString());
    }
  }, [taDataFilter]);
  const handleChange = (event: SelectChangeEvent<string>) => {
    const taId = taDataFilter.find(
      (item) => item.id === Number(event.target.value),
    );
    setSelectedOption(event.target.value);
    setFilterTA(taId?.name || "");
  };
  return (
    <FormControl
      sx={{
        minWidth: 180,

        backgroundColor: "#fff",
        borderRadius: "10px",

        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          backgroundColor: "#fff",
        },

        "& .MuiSelect-icon": {
          color: "gray",
        },

        "& .MuiSelect-iconOpen": {
          transform: "rotate(0deg)",
          color: "var(--primary-color)",
        },
      }}
      size="small"
    >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedOption}
        onChange={handleChange}
        IconComponent={CalendarMonthRounded}
        MenuProps={{
          disableScrollLock: true,
        }}
      >
        {taDataFilter.map((dtFilter) => (
          <MenuItem key={dtFilter.id} value={dtFilter.id}>
            {dtFilter.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterTahunAjaran;
