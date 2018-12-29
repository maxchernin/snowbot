
// exports.handler = (event, context, callback) => {

//TODO: ive written my name next to tasks that i should handle 
/**
 * 1. move sensitive data to external file - remove from git - change api keys
 *  4.  לסנן את הימים שיש בהם שלג מכל השכבות של ההר - base, mid, top 
 *    ואז בטוח יהיה מה להציג בהודעה 
 *  5. add iniline query (max) 
 *  6. implement dictionary with usage (max)
 *  7. 
 */

"use strict";

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const { token, appKey, appId, baseURL, hourInterval, numOfDays, productionURL } = require("./sensitive/data.js");
const apiSuffix = '&app_id=' + appId + "&app_key=" + appKey;
const apiDaysHours = "?hourly_interval=" + hourInterval + "&num_of_days=" + numOfDays;
const dictionary = require("./utils/Dictionary");
let selectedLang;
var selectedResortId;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const resortsMap = {
  "France": {
    "ValThorens": { "resortId": "333020" },
    "Tignes": { "resortId": "333018" },
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


var KeyBoards = {
  "Back": [{ text: "Back" }],
  "siteReports": [{ text: "4 day Snow Report", callback_data: "report" }, { text: "4 day Snow Forecast", callback_data: "resortforecast" }],
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
      "inline_keyboard": [[{ "text": "ValThorens", callback_data: resortsMap.France.ValThorens.resortId }, { "text": "Tignes", callback_data: resortsMap.France.Tignes.resortId }]],
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

  //@TODO: - handle each site here. - move to fn


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
            "אתר: 🏔️" + response.data.name + "\n" +
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
    bot.sendMessage(callbackQuery.message.chat.id, "עוד רגע, מביא מידע");
    axios.get(baseURL + "api/snowreport/" + selectedResortId + apiDaysHours + apiSuffix, {})
      .then((response) => {

        // TODO: @Danny prase a proper message of report - if available - if not - return error message
        // let snowingDaysArr = response.data.forecast.filter((dayPart => {
        //   return dayPart.snow_mm > 0;
        // }))

        // let daysString = CreateDays(response.data);
        // if (snowingDaysArr.length > 0) {
        //   bot.sendMessage(callbackQuery.message.chat.id, "מדינה: " + response.data.country + "\n" +
        //     "אתר: 🏔️" + response.data.name + "\n" +
        //     "תחזית לתאריכים \n" + response.data.forecast[response.data.forecast.length - 1].date + " - " + response.data.forecast[0].date + " : \n" +
        //     daysString.join(""), { parse_mode: 'Markdown' })
        // } else {
        //   bot.sendMessage(callbackQuery.message.chat.id, "No snow is excpected in the next 4 days, try again later today")
        // }

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
  if (Number.isInteger(parseInt(callbackQuery.data))) {
    selectedResortId = callbackQuery.data;
    bot.sendMessage(callbackQuery.message.chat.id, "Select type of report", {
      "reply_markup": {
        "inline_keyboard": [KeyBoards.siteReports]
      }
    });
  }



});


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
