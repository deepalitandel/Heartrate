const heartRate = require('../models/heartRate');
const saveHeartRate = async (heartRateData) => {
    return heartRateData.save();
}

const insertmanyHeartRate = async(data)=>{
    return heartRate.bulkWrite(data);
}
const getHeartrates = async(filter)=>{
    return heartRate.find(filter).lean();
}

module.exports = { saveHeartRate, insertmanyHeartRate, getHeartrates };