//index.js
import util from "../../utils/util.js"

//获取应用实例
const app = getApp();
let timerId="";

Page({
  data: {
    phrases:[      
      
    ],
    isFocus:false,
    btnTxt:"提示",
    inputWords:"",
    scrollTop:0,
    emptyHeight:200,
    windowHeight:400,
    counter:0,//个数
    resultMsg: '',
    isGameOver:false,
    tips: [
      
    ]
  }, 
  /*
  *根据输入产生提示
  */
  createTips(word){
    console.log("createTips");
    let self=this;
    let dict = app.globalData.dict;
    let lastPhrase = self.getLastPhrase();
    let firstWord ="",phraseList;
    if (lastPhrase){
      firstWord = lastPhrase.substr(lastPhrase.length - 1, 1);
      phraseList = dict.getPhraseListByFirstWord(firstWord);
    }else if(word){
      firstWord = word.substr(0, 1);
      phraseList = dict.getPhraseListByFirstWord(firstWord);
    }
    let list=[];
    if (phraseList){
      list=this.getTipsListMap(word, phraseList);
    }
    //多于8个随机选8个
    if (list.length>8){
      list = util.getArrayItems(list,8);
    }
    this.setData({
      tips: list,
      isFocus: true
    });
  },
  getTipsListMap(word, phraseList){
    let result=[];
    let p,map={};//map用来去重
    let len=word.length;
    let simple;
    let item;
    for(let i=0;i<phraseList.length;i++){
      p=phraseList[i];
      if (p.substr(0, len) == word){
        simple=p.substr(0,len+1);
        if (!map[simple]){
          item = {
            whole: p,
            simple: simple
          }
          result.push(item);
          map[simple]=true;
        }
      }
    }
    return result;
  },
  onClickItem(e){
    let phrase=e.currentTarget.dataset.phrase;
    this.setData({
      inputWords: phrase,
      btnTxt: "确定",
      tips: [],
      isFocus: true
    });
  }, 
  getLastPhrase(){
    let lastPhrase = "";
    let len = this.data.phrases.length;
    if (len > 0) {
      lastPhrase = this.data.phrases[len - 1].content;
    }
    return lastPhrase;
  },
  onInputWord(e){
    let self=this;
    let value = e.detail.value||"";
    let btnTxt="";
    value=value.trim();
    this.setData({
      inputWords: value
    });
    // clearTimeout(timerId);
    // timerId=setTimeout(function(){
    //   self.createTips(value);
    // },500);
    let lastPhrase = this.getLastPhrase();
    //输入有值 
    if(value){
      //有上一个成语
      if (lastPhrase){
        //如果输入第一字与上一个成语最后一个字相同
        if (value.substr(0, 1) == lastPhrase.substr(lastPhrase.length - 1, 1)){
          btnTxt="确定";
        }else{
          btnTxt = "提示";
        }
      }else{
        btnTxt = "确定";
      }
      this.setData({
        inputWords: value
      });      
    }else{
      btnTxt = "提示";
    }
    this.setData({
      btnTxt: btnTxt
    });
  },
  onComfirm(){
    //this.onClickBtn();
    this.setData({
      isGameOver: false
    });
  },
  onClickBtn(){
    let self=this;
    let lastPhrase = self.getLastPhrase();
    let phrase;
    if (self.data.btnTxt == "提示"){
      phrase = self.findAPhrase(lastPhrase);
      if (phrase){
        self.setData({
          inputWords: phrase,
          btnTxt: "确定",
          isFocus: true
        });
      }else{
        self.setData({
          inputWords: "阿拉不晓得",
          btnTxt: "重来",
          isFocus: true
        });
      }
    } else if (self.data.btnTxt == "确定"){
      let top;
      self.appendMePhrase(self.data.inputWords);
      top = (self.data.phrases.length+1) * 96;
      let emptyHeight=self.data.windowHeight-12-top/2;
      emptyHeight = emptyHeight > 0 ? emptyHeight:0;
      self.setData({
        scrollTop: top,
        emptyHeight: emptyHeight,
        tips: [],
        counter: self.data.counter+1,
        isFocus:true
      });
      self.setTitleBar();
      setTimeout(function(){
        lastPhrase = self.getLastPhrase();
        phrase = self.findAPhrase(lastPhrase)||"不知道啦啦";
        self.appendAiPhrase(phrase);
        //self.createTipsByInput();
        let top = (self.data.phrases.length + 1) * 96;
        let emptyHeight = self.data.windowHeight - 12 - top/2;
        emptyHeight = emptyHeight > 0 ? emptyHeight : 0;
        self.setData({
          scrollTop: top,
          emptyHeight: emptyHeight,
          counter: self.data.counter + 1,
          isFocus: true
        });
        self.setTitleBar();
        if (phrase == "不知道啦啦"){
          self.setData({
            inputWords: "",
            resultMsg: 'YOU WIN!',
            isGameOver:true,
            btnTxt: "重来"
          });
        }
      },500);
      this.clearInput();
      this.resetBtn();
    }else{
      self.setData({
        phrases:[],
        inputWords: "",
        counter: 0,
        btnTxt: "提示"
      });
      self.setTitleBar();
    }
  },
  setTitleBar(){
    wx.setNavigationBarTitle({
      title: `成语接龙(${this.data.counter})`
    })
  },
  clearInput(){
    this.setData({
      inputWords: ""
    });
  },
  resetBtn(){
    this.setData({
      btnTxt: "提示"
    });
  },
  findAPhrase(phrase){
    let word="";
    let resultPhrase="";
    let count=0;
    let dict = app.globalData.dict;
    //找出一个仍然能接下一个成语的成语
    do{
      if (phrase) {
        word = phrase.substr(phrase.length - 1, 1);
        resultPhrase = app.globalData.dict.getAPhrase(word);
      } else {
        resultPhrase = app.globalData.dict.randomAPhrase();
      }
      //实在没有也要退出循环
      if (!resultPhrase){
        break;
      }
      //防止死循环
      count++;
      if(count>=10){
        break;
      }
    } while (!dict.hasNext(resultPhrase));
    
    return resultPhrase;
  },
  appendPhraseObj(phrase){
    let phrases=this.data.phrases;
    phrases.push(phrase);
    this.setData({
      phrases: phrases
    });
  },
  appendMePhrase(phrase){
    let obj={
      photoURI: "/images/me.png",
      content: phrase,
      className: "phrases-desc-right"
    }
    this.appendPhraseObj(obj);
  },
  appendAiPhrase(phrase){
    let obj = {
      photoURI: "/images/ai.png",
      content: phrase,
      className: "phrases-desc-left"
    }
    this.appendPhraseObj(obj);
  },
  onInputFocus(){
    //this.createTipsByInput();
  },
  onInputBlur(){
    this.setData({
      tips: []
    });
  },
  createTipsByInput(){
    let word = this.inputWords || "";
    // if (word != "不知道啦啦" && word != "阿拉不晓得") {
    //   this.createTips(word);
    // }
  },
  onLoad: function () {
    let self=this;
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          windowHeight:res.windowHeight,
          emptyHeight:res.windowHeight-60,
          isGameOver:false,
          resultMsg: ''
        });
      },
    })
    
  },
  onShareAppMessage: function (options) {
    return {
      title: `成语接龙，让你快速掌握大量成语`,  
      path: '/pages/index/index',
      imageUrl: "../../images/logo.jpg",  
      success: function (res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
