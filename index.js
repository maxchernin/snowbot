process.env["NTBA_FIX_319"] = 1;

// exports.handler = (event, context, callback) => {

//TODO: ive written my name next to tasks that i should handle 
/**
 * 1. cronjob - plan
 *  get report for each site
 * parse a report message for each site
 * save report message locally ?
 * retrieve message from storage to user
 *  4.  לסנן את הימים שיש בהם שלג מכל השכבות של ההר - base, mid, top 
 *    ואז בטוח יהיה מה להציג בהודעה 
 *  5. add iniline query (max) 
 *  6. implement dictionary with usage (max)
 *  7. 
 */

"use strict";


const CronJob = require('cron/lib/cron.js').CronJob;


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
console.log('Before job instantiation');
const job = new CronJob('*/1 * * * *', function() {

//--------------------Tinges----------------//
  axios.get(baseURL + "api/snowreport/" + "333018" + apiDaysHours + apiSuffix, {})
  .then((response) => {
    let tempstring = ReportTemplate(response.data);
    localStorage.setItem('report333018', tempstring);
  })
  .catch((e) => {
    handleError(e, "report333018");
  });
  

//--------------------ValThorens----------------//
  axios.get(baseURL + "api/snowreport/" + "333020" + apiDaysHours + apiSuffix, {})
  .then((response) => {
    let tempstring = ReportTemplate(response.data);
    localStorage.setItem('report333020', tempstring);
  })
  .catch((e) => {
    handleError(e, "report333020");
  });

  //--------------------Gudauri----------------//
  axios.get(baseURL + "api/snowreport/" + "54888031" + apiDaysHours + apiSuffix, {})
  .then((response) => {
    let tempstring = ReportTemplate(response.data);
    localStorage.setItem('report54888031', tempstring);
  })
  .catch((e) => {
    handleError(e, "report54888031");
  });
  

  //--------------------Mestia----------------//
  axios.get(baseURL + "api/snowreport/" + "54888033" + apiDaysHours + apiSuffix, {})
  .then((response) => {
    let tempstring = ReportTemplate(response.data);
    localStorage.setItem('report54888033', tempstring);
  })
  .catch((e) => {
    handleError(e, "report54888033");
  });

  //--------------------Bakuriani----------------//
  axios.get(baseURL + "api/snowreport/" + "54883989" + apiDaysHours + apiSuffix, {})
  .then((response) => {
    let tempstring = ReportTemplate(response.data);
    localStorage.setItem('report54883989', tempstring);
  })
  .catch((e) => {
    handleError(e, "report54883989");
  });

  //--------------------Bansko----------------//
  axios.get(baseURL + "api/snowreport/" + "54883463" + apiDaysHours + apiSuffix, {})
  .then((response) => {
    let tempstring = ReportTemplate(response.data);
    localStorage.setItem('report54883463', tempstring);
  })
  .catch((e) => {
    handleError(e, "report54883463");
  });

  //--------------------Mayrhofen----------------//
  axios.get(baseURL + "api/snowreport/" + "124" + apiDaysHours + apiSuffix, {})
  .then((response) => {
    let tempstring = ReportTemplate(response.data);
    localStorage.setItem('report124', tempstring);
  })
  .catch((e) => {
    handleError(e, "report124");
  });
  
 //console.log(localStorage.getItem('report124'));
});
//console.log('After job instantiation');
job.start();




const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const _ = require("lodash");

const { token, appKey, appId, baseURL, hourInterval, numOfDays, productionURL } = require("./sensitive/data.js");
const apiSuffix = '&app_id=' + appId + "&app_key=" + appKey;
const apiDaysHours = "?hourly_interval=" + hourInterval + "&num_of_days=" + numOfDays;
const dictionary = require("./utils/Dictionary");
// const schedule = require('node-schedule');
let selectedLang;
var selectedResortId;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// var rule = new schedule.RecurrenceRule();
// rule.hour = 0;
// rule.minute = 0;
// rule.second = 2;

//cache forecast every 4 hours
// schedule.scheduleJob(rule, function () {
//   console.log(new Date(), 'Every 4 hours');
// });

//cache history daily
// var j = schedule.scheduleJob('*/1 * * * *', function () {
//   //
//   // console.log('The answer to life, the universe, and everything!');
// });

const resortsMap = {
  "France": {
    "ValThorens": { "resortId": "333018" },
    "Tignes": { "resortId": "333020" },
    "flag": "🇫🇷"
  },
  "Georgia": {
    "Gudauri": { "resortId": "54888031" },
    "Mestia": { "resortId": "54888033" },
    "Bakuriani": { "resortId": "54883989" },
    "flag": "🇬🇪"

  },
  "Bulgaria": {
    "Bansko": { "resortId": "54883463" },
    "flag": "🇧🇬"
  },
  "Italy": {
    "": { "resortId": "" }
  },
  "Austria": {
    "Mayrhofen": { "resortId": "124" },
    "flag": "🇦🇹"
  }

}
// const cronJobCalls = resortsMap.map((country, key) => {
//   console.log(country);
//   console.log(key);
// })
const cronJobCalls = _.reduce(resortsMap, (iterator, country) => {
  // console.log(iterator);
  // console.log(country);

  let resorts = _.filter(country, (resort) => {
    if (_.has(resort, 'resortId')) {
      return resort
    }
  }).map((resort) => {
    return resort.resortId
  })
  console.log(resorts);
  return iterator;
}, [])
// console.log(cronJobCalls);

var KeyBoards = {
  "Back": [{ text: "Back" }],
  "siteReports": [{ text: "Snow Report", callback_data: "report" }, { text: "4 day Snow Forecast", callback_data: "resortforecast" }],
  "Countries": [[{ text: resortsMap.Bulgaria.flag + " Bulgaria" }, { text: resortsMap.Georgia.flag + " Georgia" }], [{ text: resortsMap.Austria.flag + " Austria" }, { text: resortsMap.France.flag + " France" }]]
}

//https://emojiterra.com/
//TODO: calc avg of tempature
function CreateDays(data) {
  const items = data.forecast.map(function (item, index, array) {
    let day = index + 1 < data.forecast.length && item.date === data.forecast[index + 1].date ? true : false;
    let messageTemplate = `
    ${day ? "📅------ " + "*תאריך* : " + item.date + " ------📅" : ''}
    שעה ${day ? '☀️' : '🌑'}: ${item.time}
    טמפרטורה 🌡️: ${ item.base.temp_c.toString()} C°
    * שלג ️❄️️️: ${ item.snow_mm.toString()} מ"מ*
    גשם ☔ : ${ item.rain_mm.toString()} מ"מ
    לחות 💧 : ${ item.hum_avg_pct.toString()} %
    רוח 🌬️ : ${ item.vis_avg_km.toString()} קמ"ש 
      `
    return messageTemplate;
  });

  return items;
}

function ReportTemplate(data){
  const { reportdate, reporttime, lastsnow, newsnow_cm, lowersnow_cm, uppersnow_cm, conditions } = data;
  let template = `${reportdate ? "📅------ " + "*תאריך דיווח* : " + reportdate + " ------📅" : ''}
  שעת דיווח ${reporttime ? '☀️' : '🌑'}: ${reporttime}
  * שלג אחרון ️❄️️️: ${lastsnow} *
  * שלג טרי ️❄️️️: ${ newsnow_cm} ס"מ*
  שלג במפלס תחתון ️️❄️️️ : ${ lowersnow_cm} ס"מ
  שלג במפלס עליון ️️❄️️️ : ${ uppersnow_cm} ס"מ
  תנאי גלישה: ${ conditions}
  `

  return template.toString();
}

function handleError(e,localItem){
  switch (e.response.status) {
    case 400: localStorage.setItem(localItem.toString(), "עמכם הסליחה, הבוט עדיין אינו תומך בהסטוריית מזג אוויר עבור אתר זה");
      break;
    case 403: localStorage.setItem(localItem.toString(), "אתר זה לא נתמך כרגע על ידי הבוט");
      break;
    default: localStorage.setItem(localItem.toString(), "בעיית רשת, אנא נסה שנית מאוחר יותר");
      break;
  }
}

bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Welcome to snowbro - choose a resort - TODO: text should come from a dictionary", {
    "reply_markup": {
      "keyboard": KeyBoards.Countries
    }
  });
});

bot.onText(/\Georgia/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[
        { "text": "Gudauri", callback_data: resortsMap.Georgia.Gudauri.resortId },
        { "text": "Bakuriani", callback_data: resortsMap.Georgia.Bakuriani.resortId }
      ]],
    }
  });
});

//, {"text": 'Mestia', callback_data: resortsMap.Georgia.Mestia.resortId}

//TODO: fill in missing resort id's on callback data like above
bot.onText(/\France/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[{ "text": "Tinges", callback_data: resortsMap.France.ValThorens.resortId }, { "text": "ValThorens", callback_data: resortsMap.France.Tignes.resortId }]],
    }
  });
});

//{"text": "Val Thorens", callback_data: 'valThorens'}

bot.onText(/\Bulgaria/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[{ "text": "Bansko", callback_data: resortsMap.Bulgaria.Bansko.resortId }]],
    }
  });
});

bot.onText(/\Austria/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[{ "text": "Mayrhofen", callback_data: resortsMap.Austria.Mayrhofen.resortId }]], //callback data can be an object containing multiple keys e.g. {resordIt: 12312, resortName: "X"} etc.
    }
  });
});

// Listen to inline button presses\messages
bot.on("callback_query", (callbackQuery) => {
  console.log(callbackQuery.da)
  if (Number.isInteger(parseInt(callbackQuery.data))) {
    selectedResortId = callbackQuery.data;
    bot.sendMessage(callbackQuery.message.chat.id, "Select type of report", {
      "reply_markup": {
        "inline_keyboard": [KeyBoards.siteReports]
      }
    });
  }


  if (callbackQuery.data === 'resortforecast') {
    bot.sendMessage(callbackQuery.message.chat.id, "עוד רגע, מביא מידע");
    axios.get(baseURL + "api/resortforecast/" + selectedResortId + apiDaysHours + apiSuffix, {})
      .then((response) => {

        let snowingDaysArr = response.data.forecast.filter((dayPart => {
          return dayPart.snow_mm > 0;
        }))

        let daysString = CreateDays(response.data);
        if (snowingDaysArr.length > 0) {
          bot.sendMessage(callbackQuery.message.chat.id, "מדינה: " + response.data.country + "\n" +
            "אתר: 🏔️ " + response.data.name + "\n" +
            "תחזית לתאריכים \n" + response.data.forecast[response.data.forecast.length - 1].date + " - " + response.data.forecast[0].date + " : \n" +
            daysString.join(""), { parse_mode: 'Markdown' })
        } else {
          bot.sendMessage(callbackQuery.message.chat.id, "No snow is excpected in the next 4 days, try again later today")
        }

      })
      .catch((e) => {
        console.error(e.response);
        switch (e.response.status) {
          case '403': bot.sendMessage(callbackQuery.message.chat.id, "אתר זה לא נתמך כרגע על ידי הבוט");
            break;
          default: bot.sendMessage(callbackQuery.message.chat.id, "בעיית רשת, אנא נסה שנית מאוחר יותר");
            break;
        }
      });
  }
  if (callbackQuery.data === 'report') {
    //bot.sendMessage(callbackQuery.message.chat.id, "עוד רגע, מביא מידע");
    if(localStorage.getItem("report" + selectedResortId) == null){
      bot.sendMessage(callbackQuery.message.chat.id, "No snow report available for this resort");
    }
    bot.sendMessage(callbackQuery.message.chat.id,
      localStorage.getItem("report" + selectedResortId) , { parse_mode: 'Markdown' })
  }
});

/*
bot.on('webhook_error', (error) => {
  console.log(error.code);  // => 'EPARSE'
});

bot.on('polling_error', (error) => {
  console.log(error.code);  // => 'EFATAL'
});


//in development
bot.on('chosen_inline_result', result => {
  console.log("Max");
  console.log(result);
})
*/

// setInterval(() => {
//   axios.post(`https://api.telegram.org/${token}/setWebhook`, {
//     params: {
//       url: productionURL
//     }
//   })
//   .catch( (e) => {
//     console.error(e);
//   })
// }, 5000)
// }
