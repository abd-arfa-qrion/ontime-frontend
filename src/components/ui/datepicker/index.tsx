import React, { useState } from "react";
import styles from "./Datepicker.module.scss";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Propstype = {
  tglParam?: string;
  name: string;
  label?: string;
  className?: string;
};
const DatePicker = (props: Propstype) => {
  const { tglParam, name, label, className } = props;
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    tglParam ? new Date(tglParam) : null
  );

  // console.log(startDate)
  return (
    <div className={className}>
      <ReactDatePicker
        showIcon
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        className={styles.datepicker}
        placeholderText={label}
        dateFormat={"dd/MM/yyyy"}
        name={name}
      />
    </div>
  );
};

export default DatePicker;
