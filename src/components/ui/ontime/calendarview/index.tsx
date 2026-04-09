import { JadwalAkademik } from "@/type/Jadwalakademik.type";
import { Grid, Paper, Typography, Box } from "@mui/material";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
type Props = {
  data: JadwalAkademik[];
};
const colors = [
  "#FFE0E0", // merah soft
  "#FFF3CD", // kuning soft
  "#E0F7FA", // cyan soft
  "#E3F2FD", // biru soft
  "#E8F5E9", // hijau soft
  "#F3E5F5", // ungu soft
  "#FFF8E1", // amber soft
];
const CalendarView = (prop: Props) => {
  const { data } = prop;

  const groupedData = days.reduce((acc: any, day) => {
    acc[day] = data.filter((item) => item.hari === day);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2,
      }}
    >
      {days.map((day) => (
        <Paper
          key={day}
          sx={{
            p: 1.5,
            minHeight: 200,
            borderColor: "var(--secondary-color)",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <Typography
            fontWeight={600}
            fontSize={14}
            mb={1}
            sx={{
              background: "#defbf8",
              color: "var(--primary-color)",
              px: 2,
              mx: -2,
              py: 0.5,
            }}
          >
            {day}
          </Typography>

          <Box display="flex" flexDirection="column" gap={0.5}>
            {groupedData[day]?.length ? (
              groupedData[day].map((item: any, index: number) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: colors[index % colors.length],
                    fontSize: 11,
                    boxShadow: 1,
                  }}
                >
                  <Typography fontSize={11} fontWeight={500}>
                    {item.mapel_name}
                  </Typography>
                  <Typography fontSize={10} fontWeight={400}>
                    Guru:
                  </Typography>
                  <Typography fontSize={10} color="gray">
                    {item.guru_name}
                  </Typography>
                  <Typography fontSize={10} color="gray">
                    {item.start_time?.substring(0, 5)} -{" "}
                    {item.end_time?.substring(0, 5)} Wib
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography fontSize={10} color="gray">
                -
              </Typography>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default CalendarView;
