const xlsx = require("xlsx");

class ScheduleController {
    async getScedule(req, res) {
        try {
            const workbook = xlsx.readFile("uploads/2.xlsx");
            let allSchedules = []; 

            let counter = 0;
            while (counter <= 20) {
                let worksheet = workbook.Sheets[workbook.SheetNames[counter]];

                if (!worksheet) {
                    counter++;
                    continue; 
                }

                let tables = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

                if (isKazakhTable(tables)) {
                    const schedule = kazahTables(tables);
                    if (schedule) {
                        allSchedules.push(schedule);
                    }
                } else if (isRussianTable(tables)) {
                    const schedule = russianTables(tables);
                    if (schedule) {
                        allSchedules.push(schedule);
                    }
                }

                counter++;
            }

            if (allSchedules.length === 0) {
                return res.status(404).json({ message: "Расписания не найдены" });
            }

            res.status(200).json(allSchedules);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка обработки файла" });
        }

        function isKazakhTable(tables) {
            const kazakhDaysOfWeek = ["ДҮЙСЕНБІ", "СЕЙСЕНБІ", "СӘРСЕНБІ", "БЕЙСЕНБІ", "ЖҰМА"];
            return tables.some((row) => {
                const rowText = Object.values(row).join(" ").trim();
                return kazakhDaysOfWeek.some((day) => rowText.includes(day));
            });
        }

        function isRussianTable(tables) {
            const russianDaysOfWeek = ["ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА"];
            return tables.some((row) => {
                const rowText = Object.values(row).join(" ").trim();
                return russianDaysOfWeek.some((day) => rowText.includes(day));
            });
        }

        function kazahTables(tables) {
            const schedule = {
                group: "",
                schedule: {}
            };

            const daysOfWeek = ["ДҮЙСЕНБІ", "СЕЙСЕНБІ", "СӘРСЕНБІ", "БЕЙСЕНБІ", "ЖҰМА"];
            let currentDay = null;
            let foundFirstDay = false;

            tables.forEach((row, index) => {
                const rowText = Object.values(row).join(" ").trim();

                if (index === 3 && !schedule.group) {
                    schedule.group = rowText;
                }

                if (rowText.includes("Директордың оқу ісі жөніндегі орынбасары")) {
                    return;
                }

                const dayOfWeek = daysOfWeek.find((day) => rowText.includes(day));

                if (dayOfWeek) {
                    currentDay = dayOfWeek;
                    if (!schedule.schedule[currentDay]) {
                        schedule.schedule[currentDay] = [];
                    }
                    foundFirstDay = true;

                    const firstRowText = rowText.replace(dayOfWeek, "").trim();
                    if (firstRowText) {
                        schedule.schedule[currentDay].push(firstRowText);
                    }
                } else if (rowText && foundFirstDay) {
                    const filteredRow = rowText.trim();
                    if (filteredRow) {
                        schedule.schedule[currentDay].push(filteredRow);
                    }
                }
            });

            return schedule.group ? schedule : null; 
        }

        function russianTables(tables) {
            const schedule = {
                group: "",
                schedule: {}
            };

            const daysOfWeek = ["ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА"];
            let currentDay = null;
            let foundFirstDay = false;

            tables.forEach((row, index) => {
                const rowText = Object.values(row).join(" ").trim();

                if (index === 4 && !schedule.group) {
                    schedule.group = rowText;
                }

                if (rowText.includes("Заместитель директора по учебной работе")) {
                    return;
                }

                const dayOfWeek = daysOfWeek.find((day) => rowText.includes(day));

                if (dayOfWeek) {
                    currentDay = dayOfWeek;
                    if (!schedule.schedule[currentDay]) {
                        schedule.schedule[currentDay] = [];
                    }
                    foundFirstDay = true;

                    const firstRowText = rowText.replace(dayOfWeek, "").trim();
                    if (firstRowText) {
                        schedule.schedule[currentDay].push(firstRowText);
                    }
                } else if (rowText && foundFirstDay) {
                    const filteredRow = rowText.trim();
                    if (filteredRow) {
                        schedule.schedule[currentDay].push(filteredRow);
                    }
                }
            });

            return schedule.group ? schedule : null; 
        }
    }

    async getFile(req, res) {
        const filedata = req.file;

        if(!filedata) {
            res.status(500).json({message: 'Файл не загрузился'})
        } else {
            res.status(200).json({message: filedata})
        }
    }
}

module.exports = new ScheduleController();
