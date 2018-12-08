"use strict";

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

var data;

// replace the value below with the Telegram token you receive from @BotFather
const token ="509757534:AAFs9jUqQrRZsZ6bYqGFhXKoG1Bk1yYWYV0";
const appKey = "601a275a6193c68473a0c215f7c12a06";
const appId = "1c8f4af7";
const baseURL = "https://api.weatherunlocked.com/"
const resortsId = {
  "france": {
    "valThorens": "333020"
  },  
  gudauri: "54888031"
}
const apiSuffix = '?app_id='+appId+"&app_key="+appKey;


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
//gudauri object
var gudauri = {
      placeName:"shvili",
      lastUpdate:"20/10/2018",
      temperature:-2,
      amountOfSnow:3
};
var daysString = "";
//i dont know how you will get the data so for now its array with objects
var d = new Date();
var days =[
  {date: d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear(), snow:2},
  {date: d.getDate()+1 + "/" + d.getMonth() + "/" + d.getFullYear(), snow:5},
  {date: d.getDate()+2 + "/" + d.getMonth() + "/" + d.getFullYear(), snow:1},
  {date: d.getDate()+3 + "/" + d.getMonth() + "/" + d.getFullYear(), snow:0.5},
  {date: d.getDate()+4 + "/" + d.getMonth() + "/" + d.getFullYear(), snow:3},
  {date: d.getDate()+5 + "/" + d.getMonth() + "/" + d.getFullYear(), snow:2},
  {date: d.getDate()+6 + "/" + d.getMonth() + "/" + d.getFullYear(), snow:5}
];
var KeyBoards = {
  "Back": ["Back"],
  "siteReports": ["Snow Report", "Snow Forecast"]
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

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  var forecast = "Snow Forecast";
  if (msg.text.indexOf(forecast) === 0) {
    console.log(msg);
    axios.get(baseURL+"api/resortforecast/"+resortsId.france.valThorens+apiSuffix, {})
    .then((response) => {
      console.log(response.data);
      data = response.data;
      CreateDays();
      bot.sendMessage(msg.chat.id, "אתר: " + response.data.name + "\n" +
                                   "מדינה: " + response.data.country + "\n" +
                                   "תחזית לתאריכים " + response.data.forecast[response.data.forecast.length-1].date + " - " + response.data.forecast[0].date + " : \n"  +
                                   daysString)
    })
    .catch((error) => {

    })
  }
    var report = "Snow Report";
    if(msg.text.indexOf(report) === 0) {
      axios.get(baseURL+"api/snowreport/"+resortsId.france.valThorens+apiSuffix, {})
    .then((response) => {
      console.log(response.data);
      bot.sendMessage(msg.chat.id, response.data.resortid.toString())
    })
    .catch((error) => {

    })
   }
      // bot.sendMessage(msg.chat.id, "Select a country:", {
      //   "reply_markup": {
      //     "keyboard": [["France"], KeyBoards.Back ]
      //   }
      // });
  

  var France = "France";
  if (msg.text.indexOf(France) === 0) {
      bot.sendMessage(msg.chat.id, "Select a resort", {
        "reply_markup": {
          "keyboard": [["Val Thorens"], ["Back"]] //list all available resorts 
        }
      });
  } 
  var valThorens = "Val Thorens";
  if (msg.text.indexOf(valThorens) === 0) {
    bot.sendMessage(msg.chat.id, "Val Thorens:", {
      "reply_markup": {
        "keyboard": [KeyBoards.siteReports]
      }
    });
  }



});


bot.onText(/\/start/, (msg) => {
    
  bot.sendMessage(msg.chat.id, "Welcome to snowbot, please start by choosing a county to view its resorts (TODO)", {
  "reply_markup": {
      "keyboard": [["France"], ["Sample text", "Second sample"], ["Back"]]
      }
  });
      
  });
var morning = "10:00";
var night = "22:00";
function CreateDays(){
  //JSON.stringify(days);
  daysString = "";
  for(var j = 0 ; j < data.forecast.length; j++){
    //daysString += data.forecast.date + " \n ";
    if(data.forecast[j].time.toString() === morning)
    {
      daysString += "------------------------------------------------------------";
      daysString += "\n";
      daysString += "תאריך : " + data.forecast[j].date.toString() + " \n";
      daysString += "זמן : " + data.forecast[j].time.toString() + " \n";
      daysString += "שלג (ממ) : " + data.forecast[j].snow_mm.toString() + " \n";
      daysString += "שלג (אינצ') : " + data.forecast[j].snow_in.toString() + " \n";
      daysString += "גשם (ממ) : " + data.forecast[j].rain_mm.toString() + " \n";
      daysString += "גשם (אינצ') : " + data.forecast[j].rain_in.toString() + " \n";
      daysString += "לחות : " + data.forecast[j].hum_pct.toString() + "% \n";
      daysString += "מהירות רוח (קילומטר לשעה) : " + data.forecast[j].vis_km.toString() + " \n";
      daysString += "מהירות רוח (מייל לשעה) : " + data.forecast[j].vis_mi.toString() + " \n";
      daysString += "\n";
    }
    if(data.forecast[j].time.toString() === night)
    {
      daysString += "תאריך : " + data.forecast[j].date.toString() + " \n";
      daysString += "זמן : " + data.forecast[j].time.toString() + " \n";
      daysString += "שלג (ממ) : " + data.forecast[j].snow_mm.toString() + " \n";
      daysString += "שלג (אינצ') : " + data.forecast[j].snow_in.toString() + " \n";
      daysString += "גשם (ממ) : " + data.forecast[j].rain_mm.toString() + " \n";
      daysString += "גשם (אינצ') : " + data.forecast[j].rain_in.toString() + " \n";
      daysString += "לחות : " + data.forecast[j].hum_pct.toString() + "% \n";
      daysString += "מהירות רוח (קילומטר לשעה) : " + data.forecast[j].vis_km.toString() + " \n";
      daysString += "מהירות רוח (מייל לשעה) : " + data.forecast[j].vis_mi.toString() + " \n ";
      //daysString += "-----------------------"
    }

    //"\n [" + days[j].date + "] - [" + days[j].snow + "] סמ ";
    
  }
  //console.log(daysString);
}
bot.on('webhook_error', (error) => {
  console.log(error.code);  // => 'EPARSE'
});

bot.on('polling_error', (error) => {
  console.log(error.code);  // => 'EFATAL'
});
