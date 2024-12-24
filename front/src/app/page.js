"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSchedule } from "./api/getSchedule";

export default function Home() {
  const [scheduleData1, setScheduleData1] = useState([]);
  const [error, setError] = useState(null);
  const [group, setGroup] = useState("");
  const [currentDay, setCurrentDay] = useState("Понедельник");
  const router = useRouter();
  const [adminBtn, setAdminBtn] = useState(false);

  const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];

  useEffect(() => {
    const groupFromStorage = localStorage.getItem("group");
    if (!groupFromStorage) {
      router.push("/sign-in");
      return;
    }

    if(groupFromStorage === "admin"){
      setAdminBtn(true);
    };

    setGroup(groupFromStorage);
    showSchedule(groupFromStorage);
  }, []);

  async function showSchedule(group) {
    try {
      const response = await getSchedule(group);
      const schedule = response?.data?.schedule;

      if (schedule) {
        const procSchedule = schedule.map((daySchedule, index) => {
          const dayName = daysOfWeek[index];
          return {
            day: dayName,
            lessons: Object.entries(daySchedule).map(([key, value]) => ({
              lessonNumber: key,
              details: value,
            })),
          };
        });
        setScheduleData1(procSchedule);
      }
    } catch (err) {
      setError("failed");
    }
  }

  const handleDayChange = (day) => {
    setCurrentDay(day);
  };


  const currentDaySchedule =
    scheduleData1.find((day) => day.day === currentDay)?.lessons || [];

  return (
    <div>
      <div className="flex justify-end m-4">
        {adminBtn && <button className="bg-black text-white p-3 rounded-lg hover:bg-black/70 transition delay-75 font-bold" onClick={()=>{router.push("/admin")}}>Загрузить расписание</button>}
      </div>
      <div className="container mx-auto p-6">

        <h2 className="text-3xl font-bold text-center mb-4">
          <span className="text-red-500">{group}</span>
        </h2>
        <h1 className="text-3xl font-bold text-center mb-4 text-black">Расписание занятий</h1>
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

        <table className="min-w-full border-collapse border border-gray-300 text-left text-black">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 font-semibold">
                №
              </th>
              <th className="border border-gray-300 px-4 py-2 font-semibold">
                Детали
              </th>
            </tr>
          </thead>
          <tbody className="text-wrap">
            {currentDaySchedule.map((lesson, index) => (
              <tr key={index}>
                <td className="border border-gray-300  bg-white text-nowrap px-4 py-4">
                  {lesson.lessonNumber}
                </td>
                <td className="border border-gray-300 bg-white px-4 py-4">
                  {lesson.details || "Отсутсвует"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
