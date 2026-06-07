import { CalendarEvent, Kaldik } from "@/type/Kaldik.type";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Proptypes = {
  data: Kaldik[];
  setData: Dispatch<SetStateAction<Kaldik[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
};
const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];

export default function AcademicCalendar(prop: Proptypes) {
  const { data, setData, setToaster } = prop;
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [events, setEvents] = useState<CalendarEvent[]>([]);
  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // const [showModal, setShowModal] = useState(false);

  //helper cek tanggal
  const isDateInRange = (
    currentDate: Date,
    startDate: string,
    endDate: string,
  ) => {
    const current = new Date(currentDate);
    const start = new Date(startDate);
    const end = new Date(endDate);

    current.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return current >= start && current <= end;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const dates: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let i = 1; i <= totalDays; i++) dates.push(i);

  const monthName = currentDate.toLocaleString("id-ID", { month: "long" });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // const openAddEvent = (day: number) => {
  //   const date = `${year}-${month + 1}-${day}`;
  //   setSelectedDate(date);
  //   setShowModal(true);
  // };

  // const addEvent = (title: string, type: EventType) => {
  //   if (!selectedDate) return;

  //   setEvents([...events, { date: selectedDate, title, type }]);
  //   setShowModal(false);
  // };

  const getEventColor = (label: string) => {
    switch (label) {
      case "danger":
        return "bg-red-500";

      case "warning":
        return "bg-yellow-500";

      case "success":
        return "bg-green-500";

      case "info":
        return "bg-blue-500";

      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          ◀
        </button>

        <h2 className="text-xl font-bold capitalize">
          {monthName} {year}
        </h2>

        <button
          onClick={nextMonth}
          className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          ▶
        </button>
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 text-center font-semibold text-black mb-2">
        {days.map((d) => (
          <div
            className={`rounded-lg ${d === "Minggu" ? "text-[#950606] bg-red-100" : ""}`}
            key={d}
          >
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, i) => {
          let dayEvents: Kaldik[] = [];

          if (date) {
            const currentDay = new Date(year, month, date);

            dayEvents = data.filter((event) =>
              isDateInRange(
                currentDay,
                event.tgl_awal.toString(),
                event.tgl_akhir.toString(),
              ),
            );
          }

          let isSunday = false;

          if (date) {
            const currentDay = new Date(year, month, date);
            isSunday = currentDay.getDay() === 0;
          }

          return (
            <div
              key={i}
              // onClick={() => date && openAddEvent(date)}
              className={`h-28 rounded-xl p-2 hover:bg-gray-50 cursor-pointer flex flex-col ${isSunday ? "border-2 border-red-100" : "border"}`}
            >
              {date && (
                <span
                  className={`text-sm font-semibold ${
                    isSunday ? "text-red-600" : ""
                  }`}
                >
                  {date}
                </span>
              )}

              <div className="flex flex-col gap-1 mt-1">
                {dayEvents.map((e) => (
                  <div
                    key={e.id}
                    className="text-xs text-white px-1 rounded"
                    style={{
                      backgroundColor: e.label,
                    }}
                  >
                    {e.keterangan}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {/* {showModal && (
        <AddEventModal onClose={() => setShowModal(false)} onSave={addEvent} />
      )} */}
    </div>
  );
}

// function AddEventModal({
//   onClose,
//   onSave,
// }: {
//   onClose: () => void;
//   onSave: (title: string, type: EventType) => void;
// }) {
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState<EventType>("kegiatan");

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//       <div className="bg-white rounded-xl p-6 w-[350px]">
//         <h3 className="font-semibold mb-4">Tambah Event</h3>

//         <input
//           placeholder="Nama kegiatan"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="border w-full p-2 rounded mb-3"
//         />

//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value as EventType)}
//           className="border w-full p-2 rounded mb-4"
//         >
//           <option value="kegiatan">Kegiatan</option>
//           <option value="ujian">Ujian</option>
//           <option value="libur">Libur</option>
//         </select>

//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">
//             Batal
//           </button>

//           <button
//             onClick={() => onSave(title, type)}
//             className="px-3 py-2 bg-blue-600 text-white rounded"
//           >
//             Simpan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
