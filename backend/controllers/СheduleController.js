const xlsx = require("xlsx");
const db = require('../db/db')

class ScheduleController {
    async getScedule(req, res) {
        const {group} = req.body;

        const schedule = await db.query(`SELECT * FROM "${group}"`);

        res.status(200).json({schedule: schedule.rows})
    }

    async getFile(req, res) {
        const files = req.files;
        try {
            const workbook = xlsx.readFile("uploads/2.xlsx"); 
            const allSchedules = [];

            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                if (!worksheet) return;

                const tables = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

                if (isKazakhTable(tables)) {
                    const schedule = parseKazakhSchedule(tables, sheetName);
                    if (schedule) allSchedules.push(schedule);
                }
                else if (isRussianTable(tables)) {
                    const schedule = parseRussianSchedule(tables, sheetName);
                    if (schedule) allSchedules.push(schedule);
                }
            });

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

        function removeDayOfWeek(text, daysOfWeek) {
            const regex = new RegExp(`^(${daysOfWeek.join("|")})\\s*`, "i");
            return text.replace(regex, "").trim();
        }

        function parseKazakhSchedule(tables, sheetName) {
            const schedule = { group: "", schedule: {} };
            const daysOfWeek = ["ДҮЙСЕНБІ", "СЕЙСЕНБІ", "СӘРСЕНБІ", "БЕЙСЕНБІ", "ЖҰМА"];
            let currentDay = null;

            tables.forEach((row, index) => {
                const rowText = Object.values(row).join(" ").trim();

                if (index === 3) {
                    schedule.group = rowText;
                }

                if (!rowText || rowText.includes("Директор")) return;

                const dayOfWeek = daysOfWeek.find((day) => rowText.includes(day));
                if (dayOfWeek) {
                    currentDay = dayOfWeek;
                    schedule.schedule[currentDay] = [];
                }

                if (currentDay && rowText) {
                    const processedText =
                        schedule.schedule[currentDay].length === 0
                            ? removeDayOfWeek(rowText, daysOfWeek)
                            : rowText;

                    schedule.schedule[currentDay].push(processedText);
                }
            });

            if (schedule.group) {
                const groupName = schedule.group.replace(/\s+/g, "_"); 
                const createTableQuery = `
                    CREATE TABLE IF NOT EXISTS "${groupName}" (
                        id SERIAL PRIMARY KEY,
                        "1 пара" TEXT,
                        "2 пара" TEXT,
                        "3 пара" TEXT,
                        "4 пара" TEXT,
                        "5 пара" TEXT
                    );
                `;

                db.query(createTableQuery)
                    .then(() => {
                        console.log(`Таблица для группы ${groupName} успешно создана`);
                        insertScheduleData(groupName, schedule.schedule);
                    })
                    .catch((err) => console.error(`Ошибка создания таблицы для группы ${groupName}:`, err));
            }

            return schedule.group ? schedule : null;
        }

        function insertScheduleData(groupName, schedule) {
            const daysOfWeek = ["ДҮЙСЕНБІ", "СЕЙСЕНБІ", "СӘРСЕНБІ", "БЕЙСЕНБІ", "ЖҰМА"];
            
            daysOfWeek.forEach((day) => {
                const daySchedule = schedule[day];
                
                const pairs = daySchedule ? daySchedule.slice(0, 5) : [];
                
                while (pairs.length < 5) {
                    pairs.push("");  
                }
        
                const insertQuery = `
                    INSERT INTO "${groupName}" ("1 пара", "2 пара", "3 пара", "4 пара", "5 пара")
                    VALUES ($1, $2, $3, $4, $5)
                `;
        
                db.query(insertQuery, pairs)
                    .then(() => console.log(`Данные для дня ${day} в группе ${groupName} успешно добавлены`))
                    .catch((err) => console.error(`Ошибка добавления данных для дня ${day} в группу ${groupName}:`, err));
            });
        }

        function parseRussianSchedule(tables, sheetName) {
            const schedule = { group: "", schedule: {} };
            const daysOfWeek = ["ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА"];
            let currentDay = null;

            tables.forEach((row, index) => {
                const rowText = Object.values(row).join(" ").trim();

                if (index === 3) {
                    schedule.group = rowText;
                }

                if (!rowText || rowText.includes("Заместитель")) return;

                const dayOfWeek = daysOfWeek.find((day) => rowText.includes(day));
                if (dayOfWeek) {
                    currentDay = dayOfWeek;
                    schedule.schedule[currentDay] = [];
                }

                if (currentDay && rowText) {
                    const processedText =
                        schedule.schedule[currentDay].length === 0
                            ? removeDayOfWeek(rowText, daysOfWeek)
                            : rowText;

                    schedule.schedule[currentDay].push(processedText);
                }
            });

            if (schedule.group) {
                const groupName = schedule.group.replace(/\s+/g, "_"); 
                const createTableQuery = `
                    CREATE TABLE IF NOT EXISTS "${groupName}" (
                        id SERIAL PRIMARY KEY,
                        "1 пара" TEXT,
                        "2 пара" TEXT,
                        "3 пара" TEXT,
                        "4 пара" TEXT,
                        "5 пара" TEXT
                    );
                `;

                db.query(createTableQuery)
                    .then(() => {
                        console.log(`Таблица для группы ${groupName} успешно создана`);
                        insertScheduleData(groupName, schedule.schedule);
                    })
                    .catch((err) => console.error(`Ошибка создания таблицы для группы ${groupName}:`, err));
            }

            return schedule.group ? schedule : null;
        }
    }
}

module.exports = new ScheduleController();
