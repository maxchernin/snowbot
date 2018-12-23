
// exports.handler = (event, context, callback) => {

//TODO: ive written my name next to tasks that i should handle 
/**
 *  1. change create days method - use .map\.filter methods 
 *      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 *      this is an example api call: 
 *      http://api.weatherunlocked.com/api/resortforecast/54883463?hourly_interval=12&num_of_days=4&app_id=1c8f4af7&app_key=601a275a6193c68473a0c215f7c12a06
 *      we need to add hourly_interval and num_of_days params to our api call to display our results instead of getting a large array for every hour of the day
 *      for stage #1 - display all recieved answer - for a request for 12h interval and 4 days you should get an array of 8 objects, display them all like today
 * 
 *  2. add iniline query (max) 
 *  3. implement dictionary with usage (max)
 *  4. use the siteReports keyboard to display a keyboard after you click on a resort - and handle api call and responses 
 */

"use strict";

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');


// replace the value below with the Telegram token you receive from @BotFather
const token ="509757534:AAFs9jUqQrRZsZ6bYqGFhXKoG1Bk1yYWYV0";
const appKey = "601a275a6193c68473a0c215f7c12a06";
const appId = "1c8f4af7";
const baseURL = "https://api.weatherunlocked.com/"
const apiSuffix = '&app_id='+appId+"&app_key="+appKey;
const hourInterval = "12";
const numOfDays = "4";
const apiDaysHours = "?hourly_interval=" + hourInterval + "&num_of_days=" + numOfDays;
const productionURL = 'https://bla4tgbed6.execute-api.us-east-1.amazonaws.com/production';
const dictionary = require("./utils/Dictionary");
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const resortsMap = {
  "France": {
    "ValThorens": {"resortId": "333020"},
    "Tignes": {"resortId": "333018"},
    "flag" : "🇫🇷"
  },  
  "Georgia": {
    "Gudauri": {"resortId": "54888031"},
    "Mestia": {"resortId": "54888033"},
    "Bakuriani": {"resortId": "54883989"},
    "flag" : "🇬🇪"
    
  },
  "Bulgaria": {
    "Bansko": {"resortId": "54883463"},
    "flag" : "🇧🇬"
  },
  "Italy": {
    "": {"resortId": ""}
  },
  "Austria": {
    "Mayrhofen": {"resortId": "124"},
    "flag" : "🇦🇹"
  }

}


var KeyBoards = {
  "Back": [{text: "Back"}],
  "siteReports": [{text: "Snow Report"}, {text: "Snow Forecast"}],
  "countriesOne": [{text: resortsMap.Bulgaria.flag + " Bulgaria"}, {text: resortsMap.Georgia.flag + " Georgia"}],
  "countriesTwo": [{text: resortsMap.Austria.flag + " Austria"}, {text: resortsMap.France.flag + " France"}],
}


var morning = "10:00";
var night = "22:00";
var data;
var daysString;


//TODO: add emojis to lines.
//https://emojiterra.com/
function CreateDays(){
  //console.log(data);
  //JSON.stringify(days);
  const items = data.forecast.map(function(item, index, array){
    return "------------------------------------------------------------" +
           "\n" + 
           "תאריך 📅 : " + item.date + " \n" +
           "שעה ☀️ : " + item.time + " \n" +
           "טמפרטורה 🌡️ : " + item.base.temp_c.toString() + " C°"  + " \n" +
           "שלג ❄️: " + item.snow_mm.toString() + " מ'מ" + "\n" +
           "גשם ☔ : " + item.rain_mm.toString() + " מ'מ" +" \n" +
           "לחות 💧 : " + item.hum_pct.toString() + "% \n" +
           "רוח 🌬️ : " + item.vis_km.toString() + " קמ'ש" +"\n"
           + "\n";
           

  });
  daysString = "";
  console.log(items);
 /* for(var j = 0 ; j < data.forecast.length; j++){
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
    }


  }*/
  //return daysString;
  return items;
  //console.log(daysString);
}

bot.onText(/\/start/, (msg) => {
    
  bot.sendMessage(msg.chat.id, "Welcome to snowbro - choose a resort - TODO: text should come from a dictionary", {
  "reply_markup": {
      "keyboard": [ KeyBoards.countriesOne, KeyBoards.countriesTwo]
      }
  });
});

bot.onText(/\Georgia/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a resort", {
    "reply_markup": {
      "inline_keyboard": [[{"text": "Gudauri", callback_data: resortsMap.Georgia.Gudauri.resortId}, {"text": "Bakuriani", callback_data: resortsMap.Georgia.Bakuriani.resortId}]],
    }
  });
});

//, {"text": 'Mestia', callback_data: resortsMap.Georgia.Mestia.resortId}

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
  axios.get(baseURL+"api/resortforecast/"+callbackQuery.data+apiDaysHours+apiSuffix, {})
  .then((response) => {
    
    data = response.data;
    let daysString = CreateDays();
    //console.log(daysString);
    //console.log(items);
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
