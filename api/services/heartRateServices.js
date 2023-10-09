const fs = require("fs");
const  hearRatedal = require("../dal/hearRate");
const heartRate = require("../models/heartRate");
const HeartRate = require("../models/heartRate");
const weeks = { 'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6 };
const uploadCSVService = async (file) => {
    const excelToJson = require('convert-excel-to-json');

    const result = excelToJson({
        source: file.buffer,
        header: {
            rows: 1
        }, columnToKey: {
            'A': '{{A1}}',
            'B': '{{B1}}', C: "{{C1}}", D: "{{D1}}", E: "{{E1}}", F: "{{F1}}", G: "{{G1}}", H: "{{H1}}"
        }// fs.readFileSync return a Buffer
    });
    console.log(JSON.stringify(result[0]));
    const b = await saveHeartRate(result);
    await hearRatedal.insertmanyHeartRate(b);

}

saveHeartRate = async (result) => {
    let currentDate = new Date();
    currentDate.setDate(1);
    const day = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - day);
    const bulkData = [];
    for (const element of Object.values(result)) {//sheet
        let weekDays = Object.keys(weeks)// element[0];//week 1 [sun,mon]
        // delete weekDays[Object.keys(weekDays)[0]];
        // const missedWeekdays = Object.keys(weeks).filter(x => !Object.values(weekDays).includes(x));
        // const keyOfMissWeekdays = Object.keys(weekDays).filter(x => Object.values(keyOfMissWeekdays).includes(x));
        // console.log(weekDays);
        for (let i = 0; i < element.length; i++) {//week data
            let time = element[i]['time'];
            for (const iterator of weekDays) {
                if (iterator != "time") { //coulum A == time                 
                    const h = new HeartRate();
                    const rate = element[i][iterator];
                    if (!rate || isNaN(rate) || rate <= 0) {
                        h.heartRate = 90;
                    } else {
                        h.heartRate = element[i][iterator];
                    }
                    h.weekName = iterator;
                    let d = new Date();
                    d.setHours(new Date(time).getHours());
                    d.setMinutes(new Date(time).getMinutes());
                    d.setSeconds(0);
                    d.setMilliseconds(0);
                    d.setDate(currentDate.getDate() + weeks[h.weekName]);
                    h.time = d;
                    bulkData.push({
                        updateOne: {
                            filter: { 'time': d },
                            update: { '$set': { weekName: iterator, time: d, heartRate: h.heartRate } },
                            upsert: true
                        }
                    })
                }
            }

        }
        currentDate.setDate(currentDate.getDate() + 7);
        console.log(currentDate.toString());
    };
    return bulkData;
}

const calculateAverage = async () => {
    const data = await hearRatedal.getHeartrates({});
    const timedetails = {};
    data.forEach((d, i) => {
        timedetails[d.time] = i;
    });
    const dates = data.map((d) => d.time);
    let val = [];
    let iteration = 7 * 24;
    console.log(iteration)
    for (let i = 0; i < 24; i++) {
        const time = formatAMPM(new Date(dates[i * 7]));
        let obj = { time }
        for (let j = 0; j < 7; j++) {
            const date = new Date(dates[i * 7]);
            date.setDate(date.getDate() + j);
            const day = date.getDay();
            let avg = 0;
            let count = 0;
            while (timedetails[date] >= 0) {
                avg = avg + data[timedetails[date]].heartRate;
                date.setDate(date.getDate() + 7);
                count++;
            }
            obj[Object.keys(weeks)[day]] = Math.round(avg / count);
        }
        val.push(obj)
    }
    console.log(val);
    return val;
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
module.exports = { uploadCSVService, calculateAverage }   