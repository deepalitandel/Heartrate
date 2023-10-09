const express = require("express");
const router = express.Router();
const multer = require("multer");
const heartrateController = require("../controller/heartrateController");
const upload = multer();
router.get("/", (req, res) => { res.send('hello') });
router.post("/uploadcsv",fileUpload, heartrateController.uploadCSV);
router.get("/getaverage", heartrateController.getAverage);
function fileUpload(req, res, next) {
    upload.single('file')(req, res, next);
}
module.exports = router;
