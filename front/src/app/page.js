"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSchedule } from "./api/getSchedule";

const scheduleData = {
  "Понедельник": [{
      "group": 123,
      "firstClass": 123,
      "firstRoom": 123,
      "secondClass": 123,
      "secondRoom":123,
  }],
  "Вторник": ["123", "123"],
  "Среда": ["123", "123"],
  "Четверг": ["123", "123"],
  "Пятница": ["123", "123"],
};

export default function Home() {
  const [scheduleData1, setScheduleData1] = useState([]);
  const [error, setError] = useState(null);
  const [group, setGroup] = useState("");
  const router = useRouter();

  if (!localStorage.getItem("group")) {
    router.push('/sign-in');
  }

  const group_effect = localStorage.getItem("group");

  async function showSchedule(group) {
    try {
      const response = await getSchedule(group);
      if (response?.data.schedule) {
        // Convert the schedule object to an array of time slots
        const scheduleArray = Object.entries(response.data.schedule).map(([timeSlot, details]) => ({
          timeSlot,
          details,
        }));
        setScheduleData1(scheduleArray);
      } else {
        console.error("DONT HAVE A RESPONSE");
        setError("invalid");
      }
    } catch (err) {
      console.error(err);
      setError("failed");
    }
  }

  useEffect(() => {
    setGroup(localStorage.getItem('group'));
    showSchedule(group_effect);
  }, []);

  const [currentDay, setCurrentDay] = useState("Понедельник");
  const daysOfWeek = Object.keys(scheduleData);

  const handleDayChange = (day) => {
    setCurrentDay(day);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-4">Шейко Егор <span className="text-red-500">{group}</span></h2>
      <h1 className="text-3xl font-bold text-center mb-4">Расписание занятий</h1>
      <div className="flex justify-center mb-6 space-x-2">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            className={`px-4 py-2 border rounded ${
              currentDay === day
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
            onClick={() => handleDayChange(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <table className="min-w-full border-collapse border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            {["1 пара", "2 пара", "3 пара", "4 пара", "5 пара"].map((timeSlot) => (
              <th key={timeSlot} className="border border-gray-300 px-4 py-2 font-semibold">{timeSlot}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {["1 пара", "2 пара", "3 пара", "4 пара", "5 пара"].map((timeSlot) => (
              <td key={timeSlot} className="border border-gray-300 bg-white px-4 py-2">
                {scheduleData1.find((entry) => entry.timeSlot === timeSlot)?.details || "Нет пары"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
