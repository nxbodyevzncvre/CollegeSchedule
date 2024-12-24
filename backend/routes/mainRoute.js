const Router = require("express");
const router = new Router();
const ScheduleController = require('../controllers/СheduleController');
const AuthController = require('../controllers/AuthController');
const multer = require('multer')

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, '2.xlsx');
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({storage: storageConfig, fileFilter: fileFilter});

router.post("/schedule", ScheduleController.getScedule);
router.post("/get-file", upload.single("file"), ScheduleController.getFile);

router.post("/sign-in", AuthController.signIn);

module.exports = router;