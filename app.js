//app.js

var PhraseDict = require("./model/PhraseDict.js");

App({
  onLaunch: function () {
    this.globalData.dict = new PhraseDict();
  },
  globalData: {
    dict:null
  }
})