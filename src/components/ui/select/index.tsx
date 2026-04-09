import React, { useState } from "react";
import styles from "./Select.module.scss";

type Options = {
  label: string;
  value: string;
};
type Propstype = {
  label?: string;
  value?: number | string;
  name: string;
  required?: boolean;
  defaultValue?: string | number;
  className?: string;
  options: Options[];
  onChange?: (e: any) => void;
};
const Select = (props: Propstype) => {
  const {
    label,
    name,
    required,
    value,
    defaultValue,
    options,
    className,
    onChange,
  } = props;
  const [selectedRole, setSelectedRole] = useState(
    defaultValue ? defaultValue : "",
  );

  // Handler untuk mengubah nilai selectedRole saat select diganti

  const handleRoleChange = (e: any) => {
    setSelectedRole(e.target.value);

    if (onChange) {
      // onChange(event.target.value);
      onChange(e.target.value);
    }
  };

  return (
    <div className={className ? className : styles.container}>
      {label && (
        <label htmlFor={name} className={styles.container__label}>
          {label}
        </label>
      )}
      <div className={styles.container__selectWrapper}>
        <select
          name={name}
          id={name}
          className={styles.container__selectWrapper__select}
          required={props.required}
          value={selectedRole}
          onChange={handleRoleChange}
        >
          <option value="" disabled>
            Pilih {label}...
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
