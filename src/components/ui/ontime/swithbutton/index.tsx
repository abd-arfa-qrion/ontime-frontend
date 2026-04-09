import Switch from "@mui/material/Switch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";

type Props = {
  switchBtn: string;
  setSwitchBtn: React.Dispatch<React.SetStateAction<string>>;
};

export default function CustomizedSwitches(prop: Props) {
  const { switchBtn, setSwitchBtn } = prop;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchBtn(event.target.checked ? "list" : "calendar");
    console.log("switch button: ", switchBtn);
  };

  return (
    <Switch
      checked={switchBtn === "list" ? true : false}
      onChange={handleChange}
      icon={
        <CalendarMonthIcon
          sx={{
            color: "#fff",
            fontSize: 18,
            backgroundColor: "var(--secondary-color)",
            borderRadius: "50%",
            padding: "4px",
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      }
      checkedIcon={
        <ViewListIcon
          sx={{
            color: "#fff",
            fontSize: 18,
            backgroundColor: "#62cd6b",
            borderRadius: "50%",
            padding: "4px",
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      }
    />
  );
}
