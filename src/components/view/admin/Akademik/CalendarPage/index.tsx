import { useState } from "react";

type EventType = "libur" | "ujian" | "kegiatan";

interface CalendarEvent {
  date: string;
  title: string;
  type: EventType;
}

const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function AcademicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const openAddEvent = (day: number) => {
    const date = `${year}-${month + 1}-${day}`;
    setSelectedDate(date);
    setShowModal(true);
  };

  const addEvent = (title: string, type: EventType) => {
    if (!selectedDate) return;

    setEvents([...events, { date: selectedDate, title, type }]);
    setShowModal(false);
  };

  const getEventColor = (type: EventType) => {
    switch (type) {
      case "libur":
        return "bg-red-500";
      case "ujian":
        return "bg-yellow-500";
      case "kegiatan":
        return "bg-blue-500";
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
      <div className="grid grid-cols-7 text-center font-semibold text-gray-500 mb-2">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* CALENDAR */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, i) => {
          const dateStr = `${year}-${month + 1}-${date}`;
          const dayEvents = events.filter((e) => e.date === dateStr);

          return (
            <div
              key={i}
              onClick={() => date && openAddEvent(date)}
              className="h-28 border rounded-xl p-2 hover:bg-gray-50 cursor-pointer flex flex-col"
            >
              {date && <span className="text-sm font-semibold">{date}</span>}

              <div className="flex flex-col gap-1 mt-1">
                {dayEvents.map((e, idx) => (
                  <div
                    key={idx}
                    className={`text-xs text-white px-1 rounded ${getEventColor(
                      e.type,
                    )}`}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <AddEventModal onClose={() => setShowModal(false)} onSave={addEvent} />
      )}
    </div>
  );
}

function AddEventModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (title: string, type: EventType) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("kegiatan");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[350px]">
        <h3 className="font-semibold mb-4">Tambah Event</h3>

        <input
          placeholder="Nama kegiatan"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value as EventType)}
          className="border w-full p-2 rounded mb-4"
        >
          <option value="kegiatan">Kegiatan</option>
          <option value="ujian">Ujian</option>
          <option value="libur">Libur</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">
            Batal
          </button>

          <button
            onClick={() => onSave(title, type)}
            className="px-3 py-2 bg-blue-600 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
