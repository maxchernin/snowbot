
// exports.handler = (event, context, callback) => {

"use strict";

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');


// replace the value below with the Telegram token you receive from @BotFather
const token ="509757534:AAFs9jUqQrRZsZ6bYqGFhXKoG1Bk1yYWYV0";
const appKey = "601a275a6193c68473a0c215f7c12a06";
const appId = "1c8f4af7";
const baseURL = "https://api.weatherunlocked.com/"
const apiSuffix = '?app_id='+appId+"&app_key="+appKey;
const productionURL = 'https://bla4tgbed6.execute-api.us-east-1.amazonaws.com/production'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


const resortsMap = {
  "France": {
    "ValThorens": {"resortId": "333020"},
    "Tignes": {"resortId": "333018"},
  },  
  "Georgia": {
    "Gudauri": {"resortId": "54888031"},
    "Mestia": {"resortId": "54888033"},
    "Bakuriani": {"resortId": "54883989"},
    "emoji" : {"flag" : "\u{1F1EC}\u{1F1EA}"}
  },
  "Bulgaria": {
    "Bansko": {"resortId": "54883463"}
  },
  "Italy": {
    "": {"resortId": ""}
  },
  "Austria": {
    "Mayrhofen": {"resortId": "124"}
  }

}


var KeyBoards = {
  "Back": [{text: "Back"}],
  "siteReports": [{text: "Snow Report"}, {text: "Snow Forecast"}],
  "countries": [{text: "\u{1F1EC}\u{1F1EA} Georgia"}, {text: "🇦🇹 Austria"}, {text: "🇫🇷 France"}, {text: "🇧🇬 Bulgaria"}],
  "Georgia": [{"text": "Gudauri", callback_data: 'Gudauri'}, {"text": "Bakuriani", callback_data: 'Bakuriani'}, {"text": 'Mestia', callback_data: 'Mestia'}],
  "France": [{"text": "ValThorens", callback_data: 'ValThorens'}, {"text": "Tignes", callback_data: 'Tignes'}],
  "Bulgaria": [{"text": "Bansko", callback_data: 'Bansko'}],
  "Austria": [{"text": "Mayerhofen", callback_data: 'Mayerhofen'}]
}


var morning = "10:00";
var night = "22:00";
var data;
var daysString;


//TODO: add emojis to lines.
//https://emojiterra.com/
function CreateDays(){
  //JSON.stringify(days);
  daysString = "";
  for(var j = 0 ; j < data.forecast.length; j++){
    //daysString += data.forecast.date + " \n ";
    if(data.forecast[j].time.toString() === morning)
    {
      daysString += "------------------------------------------------------------";
      daysString += "\n";
      daysString += "תאריך 📅 : " + data.forecast[j].date.toString() + " \n";
      daysString += "שעה ☀️ : " + data.forecast[j].time.toString() + " \n";
      daysString += "טמפרטורה 🌡️ : " + data.forecast[j].base.temp_c.toString() + " C°"  + " \n";
      daysString += "שלג ❄️: " + data.forecast[j].snow_mm.toString() + " מ'מ" + "\n";
      daysString += "גשם ☔ : " + data.forecast[j].rain_mm.toString() + " מ'מ" +" \n";
      daysString += "לחות 💧 : " + data.forecast[j].hum_pct.toString() + "% \n";
      daysString += "רוח 🌬️ : " + data.forecast[j].vis_km.toString() + " קמ'ש" +" \n";
      daysString += "\n";
    }
    if(data.forecast[j].time.toString() === night)
    {
      daysString += "תאריך 📅 : " + data.forecast[j].date.toString() + " \n";
      daysString += "תאריך : " + data.forecast[j].date.toString() + " \n";
      daysString += "שעה 🌑 : " + data.forecast[j].time.toString() + " \n";
      daysString += "טמפרטורה 🌡️ : " + data.forecast[j].base.temp_c.toString() + " C°" + " \n";
      daysString += "שלג ❄️ : " + data.forecast[j].snow_mm.toString() + " מ'מ" + "\n";
      daysString += "גשם ☔ : " + data.forecast[j].rain_mm.toString() + " מ'מ" +" \n";
      daysString += "לחות 💧 : " + data.forecast[j].hum_pct.toString() + "% \n";
      daysString += "רוח 🌬️ : " + data.forecast[j].vis_km.toString() + " קמ'ש" + " \n";
      //daysString += "-----------------------"
    }


    //"\n [" + days[j].date + "] - [" + days[j].snow + "] סמ ";
  }
  return daysString;
  //console.log(daysString);
}

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/start/, (msg) => {
    
  bot.sendMessage(msg.chat.id, "Welcome to snowbot, please start by choosing a county to view its resorts (TODO)", {
  "reply_markup": {
      "keyboard": [ KeyBoards.countries, ["Sample text", "Second sample"]]
      }
  });
});

bot.onText(/\Georgia/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[{"text": "Gudauri", callback_data:  resortsMap.Georgia.Gudauri.resortId}, {"text": "Bakuriani", callback_data: resortsMap.Georgia.Bakuriani.resortId}, {"text": 'Mestia', callback_data: resortsMap.Georgia.Mestia.resortId}]],
    }
  });
});

//TODO: fill in missing resort id's on callback data like above
bot.onText(/\France/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[{"text": "ValThorens", callback_data: resortsMap.France.ValThorens.resortId}, {"text": "Tignes", callback_data: resortsMap.France.Tignes.resortId}]],
    }
  });
});

//{"text": "Val Thorens", callback_data: 'valThorens'}

bot.onText(/\Bulgaria/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[{"text": "Bansko", callback_data: resortsMap.Bulgaria.Bansko.resortId}]],
    }
  });
});

bot.onText(/\Austria/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[{"text": "Mayrhofen", callback_data: resortsMap.Austria.Mayrhofen.resortId}]], //callback data can be an object containing multiple keys e.g. {resordIt: 12312, resortName: "X"} etc.
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
  bot.sendMessage(callbackQuery.message.chat.id, "עוד רגע, מביא מידע");
  axios.get(baseURL+"api/resortforecast/"+callbackQuery.data+apiSuffix, {})
  .then((response) => {
    data = response.data;
    let daysString = CreateDays();
    console.log(daysString);
    bot.sendMessage(callbackQuery.message.chat.id, "מדינה: " + response.data.country + "\n" +
                                 "אתר: 🏔️" + response.data.name + "\n" +
                                 "תחזית לתאריכים \n" + response.data.forecast[response.data.forecast.length-1].date + " - " + response.data.forecast[0].date + " : \n"  +
                                 daysString)

  })
  .catch((e) => {
    console.error(e);
  });
  bot.sendMessage(callbackQuery.message.chat.id, callbackQuery.data.flag);
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
