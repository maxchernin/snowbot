
// exports.handler = (event, context, callback) => {

//TODO: ive written my name next to tasks that i should handle 
/**
 *  2. הפרדה ויזואלית
 *  טובה יותר בין הימים
 *  3. לסנן את הימים שיש בהם שלג
 *  4.  לסנן את הימים שיש בהם שלג מכל השכבות של ההר - base, mid, top 
 *    ואז בטוח יהיה מה להציג בהודעה 
 *  5. add iniline query (max) 
 *  6. implement dictionary with usage (max)
 *  7. 
 */

"use strict";

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');


// replace the value below with the Telegram token you receive from @BotFather
const token = "509757534:AAFs9jUqQrRZsZ6bYqGFhXKoG1Bk1yYWYV0";
const appKey = "601a275a6193c68473a0c215f7c12a06";
const appId = "1c8f4af7";
const baseURL = "https://api.weatherunlocked.com/"
const apiSuffix = '&app_id=' + appId + "&app_key=" + appKey;
const hourInterval = "12";
const numOfDays = "4";
const apiDaysHours = "?hourly_interval=" + hourInterval + "&num_of_days=" + numOfDays;
const productionURL = 'https://bla4tgbed6.execute-api.us-east-1.amazonaws.com/production';
const dictionary = require("./utils/Dictionary");
let selectedLang;
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
  "countriesOne": [{ text: resortsMap.Bulgaria.flag + " Bulgaria" }, { text: resortsMap.Georgia.flag + " Georgia" }],
  "countriesTwo": [{ text: resortsMap.Austria.flag + " Austria" }, { text: resortsMap.France.flag + " France" }],
}

//TODO: add emojis to lines.
//https://emojiterra.com/
function CreateDays(data) {
  const items = data.forecast.map(function (item, index, array) {
    let day = index + 1 < data.forecast.length && item.date === data.forecast[index + 1].date ? true : false;
    let messageTemplate = `
    ${day ? "📅------ " + "*תאריך* : " + item.date + " ------📅" : ''}
    שעה ${day ? '☀️' : '🌑'}: ${item.time}
    טמפרטורה 🌡️: ${ item.base.temp_c.toString()} C°
    * שלג ️❄️️️: ${ item.snow_mm.toString()} מ"מ*
    גשם ☔ : ${ item.rain_mm.toString()} מ"מ
    לחות 💧 : ${ item.hum_pct.toString()} %
    רוח 🌬️ : ${ item.vis_km.toString()} קמ"ש 
      `
    return messageTemplate;
  });

  return items;
}

bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Welcome to snowbro - choose a resort - TODO: text should come from a dictionary", {
    "reply_markup": {
      "keyboard": [KeyBoards.countriesOne, KeyBoards.countriesTwo]
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

// Listen for any kind of message. There are different kinds of
// messages.
/*bot.on('message', (msg) => {
  //TODO: deprecated move to its own handler  
  var forecast = "Snow Forecast";
  if (msg.text.indexOf(forecast) === 0) {
    axios.get(baseURL+"api/resortforecast/"+resortsId.Georgia.gudauri+apiSuffix, {})
    .then((response) => {
      console.log("snow mm:", response.data.forecast[0].snow_mm);
      data = response.data;
      CreateDays();
      bot.sendMessage(msg.chat.id, "אתר: " + response.data.name + "\n" +
                                   "מדינה: " + response.data.country + "\n" +
                                   "תחזית לתאריכים " + response.data.forecast[response.data.forecast.length-1].date + " - " + response.data.forecast[0].date + " : \n"  +
                                   daysString)

      //bot.sendMessage(msg.chat.id, data.forecast[0].snow_mm + "mm of snow from: " + data.forecast[0].date);
    })
    .catch((e) => {
      console.error(e);
    });
  }

  //TODO: deprecated move to its own handler  
  var report = "Snow Report";
  if(msg.text.indexOf(report) === 0) {
    axios.get(baseURL+"api/snowreport/"+resortsId.france.valThorens+apiSuffix, {})
  .then((response) => {
    console.log(response.data);
    bot.sendMessage(msg.chat.id, response.data.resortid.toString())
  })
  .catch((e) => {
    console.error(e);
    });
  }
});
*/
// Listen to inline button presses\messages
bot.on("callback_query", (callbackQuery) => {
  //@TODO: - handle each site here. - move to fn

  if (!userSelectedSite) {
    bot.sendMessage(callbackQuery.message.chat.id, "Select type of report", {
      "reply_markup": {
        "inline_keyboard": [KeyBoards.siteReports]
      }
    });
  }



  if (callbackQuery.data === 'report' || callbackQuery.data === 'resortforecast') {

  }



  bot.sendMessage(callbackQuery.message.chat.id, "עוד רגע, מביא מידע");
  axios.get(baseURL + "api/resortforecast/" + callbackQuery.data + apiDaysHours + apiSuffix, {})
    .then((response) => {

      let daysString = CreateDays(response.data);
      bot.sendMessage(callbackQuery.message.chat.id, "מדינה: " + response.data.country + "\n" +
        "אתר: 🏔️" + response.data.name + "\n" +
        "תחזית לתאריכים \n" + response.data.forecast[response.data.forecast.length - 1].date + " - " + response.data.forecast[0].date + " : \n" +
        daysString.join(""), { parse_mode: 'Markdown' })

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
