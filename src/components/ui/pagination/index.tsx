import React, { Dispatch, SetStateAction } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import styles from "./Pagination.module.scss";

type Proptype = {
  meta: {
    per_page: number;
    page: number;
    count_data: number;
    count_page: number;
  };
  setMeta: Dispatch<
    SetStateAction<{
      per_page: number;
      page: number;
      count_data: number;
      count_page: number;
    }>
  >;
};

const PaginationComponen = (props: Proptype) => {
  const { meta, setMeta } = props;

  const handleChangePage = (e: any, p: number) => {
    setMeta({ ...meta, page: p });
  };

  const handleChangePerpage = (e: any) => {
    const p = e.target.value;
    setMeta({ ...meta, per_page: p, page: 1 }); // Reset ke halaman 1 saat per_page berubah
  };

  return (
    <div className={styles.pagecomponent}>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Row</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={meta.per_page}
          onChange={handleChangePerpage}
          autoWidth
          label="Perpage"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
      <Pagination
        className={styles.pagecomponent__pagebutton}
        count={meta.count_page}
        variant="outlined"
        shape="rounded"
        page={meta.page} // Hubungkan pagination dengan state meta.page
        onChange={handleChangePage}
      />
    </div>
  );
};

export default PaginationComponen;
