const Router = require("express");
const router = new Router();
const ScheduleController = require('../controllers/scheduleController');
const multer = require('multer')

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, '2.xlsx');
    }
})

const upload = multer({storage: storageConfig});

router.get("/schedule", ScheduleController.getScedule);

router.post("/get-file", upload.array("files", 2), ScheduleController.getFile);

module.exports = router;