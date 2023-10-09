
const  heartRateServices = require("../services/heartRateServices")

const uploadCSV = async (req, res) => {
     console.log(req.file);
     console.log(req.headers);
     console.log(req.body);
     const a = await heartRateServices.uploadCSVService(req.file);
     console.log(a);
     res.status(201).json({
          message: 'Supplier Added Successfully'
     });
}
const getAverage = async (req, res) => {
   
     const a = await heartRateServices.calculateAverage();
     console.log(a);
     res.status(201).json(a);
}

module.exports = { uploadCSV, getAverage }