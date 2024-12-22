"use client"
import { useState, useEffect } from "react";

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
  const [currentDay, setCurrentDay] = useState("Понедельник");
  const daysOfWeek = Object.keys(scheduleData)




  const handleDayChange = (day) =>{
    setCurrentDay(day);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-4">Шейко Егор <span className="text-red-500">206ПО(Р)</span></h2>
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
            <th className="border border-gray-300 px-4 py-2 font-semibold">1 пара</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">Кабинет</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">2 пара</th>
            <th className="border border-gray-300 px-4 py-2 font-semibold">Кабинет</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData[currentDay].map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 px-4 py-2">{row.firstClass}</td>
              <td className="border border-gray-300 px-4 py-2">{row.firstRoom}</td>
              <td className="border border-gray-300 px-4 py-2">{row.secondClass}</td>
              <td className="border border-gray-300 px-4 py-2">{row.secondRoom}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
