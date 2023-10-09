const mongoose = require('mongoose');

const HeartrateSchema = mongoose.Schema({
  weekName: { type: String, require: true },
  time: { type: Date, require: true,unique: true  },
  heartRate: { type: Number, require: true },
})

module.exports = mongoose.model('heartRate', HeartrateSchema);
