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
const options = [
  { value: "0", label: "All Data" },
  { value: "search", label: "Custom" },
];

type Proptypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
  getAllPer: (e: { selected: string; search: string }) => void;
};
const BigFilter = (prop: Proptypes) => {
  const { setToaster, getAllPer } = prop;
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedOption) {
      if (selectedOption === "search") {
        const form = e.target as HTMLFormElement;
        const searchValue = form.search.value;
        if (searchValue !== "") {
          getAllPer({ selected: selectedOption, search: searchValue });
        } else {
          setError(true);
          setHelperText("Please enter a search term");
        }
      } else {
        getAllPer({ selected: selectedOption, search: "" });
      }
    }
  };
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
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
      </FormControl>
      <form onSubmit={handleSearch} className={styles.bagfilter__form}>
        {selectedOption === "search" && (
          <TextField
            className={styles.bagfilter__search}
            id="outlined-basic"
            label="Perusahaan"
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
        >
          <i className="bx bx-search"></i>Search
        </Button>
      </form>
    </div>
  );
};

export default BigFilter;
