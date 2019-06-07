// pages/letters/letters.js
var dictionary = require('../../model/letters/dictionary.js');
var gameControl = require('../../model/letters/gameControl.js');
var computer = require('../../model/letters/computer.js');

Page({
    data: {
        score: 0,
        answer: '',
        errorMsg: ' ',
        timerStatus: 'no-animation',
        defaultTimerNumber: 60,
        timerNumber: 60,
        timerId: null,
        wordChain: [],
        scrollTop: 0,
        gameover: false,
        resultMsg: '',
        gameStart:true
    },
    onLoad(){
      gameControl.init();
    },
    onReady: function () {
      this.setData({
        wordChain: [],
        score: 0,
        gameStart: true,
        gameover: false,
        resultMsg: '',
        scrollTop: 0,
        errorMsg: ' '
      });      
    },
    start: function () {
        var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        this.setData({
            wordChain: [],
            score: 0,
            level: 1,
            gameStart:false,
            gameover: false,
            resultMsg: '',
            scrollTop: 0,
            errorMsg: ' '
        });
        var computerAnswer = computer.default.responseAnswer(letters[new Date().getTime() % 25]);
        this.answer(computerAnswer, 'computer');
        this.startTimer();
    },
    restart: function () {
        var wordChain = this.data.wordChain;
        for (var i = 0; i < wordChain.length; i++) {
            dictionary.default.add(wordChain[i]);
        }
        this.start();
    },
    check(word){
      let result = dictionary.default.check(word);
      return result;
    },
    validate: function (word, role) {
        //var search = dictionary.default.get(word);
        var isRight = true;
        if (role =="player"){
          isRight =this.check(word);
        }
        var wordChain = this.data.wordChain;
        var isRepeat = false;
        for (var i = 0; i < wordChain.length; i++) {
            var wordItem = wordChain[i];
            if (wordItem.word === word) {
                isRepeat = true;
                break;
            }
        }
        if (isRepeat === true) {
            return {
                status: false,
                msg: '这个单词已经出现过了'
            }
        }
        var validate = isRight;
        if (validate) {
            //dictionary.default.remove(word);
            return {
                status: true
            }
        } else {
            return {
                status: false,
                msg: '呀，拼错了！'
            }
        }
    },
    answer: function (word, role) {
        var self = this;
        var validate = this.validate(word, role);
        if (!validate.status) {
            this.setData({
                errorMsg: validate.msg
            });
            return false;
        }

        var oldWordChain = this.data.wordChain;
        oldWordChain.push({
            word: word,
            preWord: word.slice(0, word.length - 1),
            lastLetter: word.slice(word.length - 1)
        });
        let level = gameControl.getLevel();
        this.setData({
            wordChain: oldWordChain,
            score: this.data.score + 1,
            level:level
        });
        this.scrollDown(0, 400);
        let levelWords = gameControl.getLevelWords();
        if (this.data.score === levelWords) {
            this.gameOver('player');
            gameControl.setLevel(level+1);
            return;
        }else{
          this.startTimer();
        }
        if (role === 'computer') {
            this.setData({
                answer: word.slice(word.length - 1)
            })
        } else if (role === 'player') {
            this.setData({
                errorMsg: ' '
            });
            this.answer(computer.default.responseAnswer(word.slice(word.length - 1)), 'computer');
        }
    },
    linear: function (t, b, c, d) {
        return c * t/d + b;
    },
    scrollDown: function(currentTime,duration) {
        var self = this;
        var scrollTop = this.data.scrollTop;
        var changeValue = 60;
        var beginValue = 0;
        if (changeValue <= 0) {
            return;
        }
        var value = this.linear(currentTime, beginValue, changeValue, duration);
        this.setData({
            scrollTop: scrollTop + value
        });
        currentTime = currentTime + 20;
        if (currentTime <= duration) {
            setTimeout(function(){
                self.scrollDown(currentTime,duration);
            },16.7);
        }
    },
    responseAnswer: function () {
        var self = this;
        
        this.answer(this.data.answer, 'player');
    },
    startTimer: function () {
        var self = this;
        clearInterval(this.data.timerId);
        this.setData({
            timerStatus: 'no-animation'
        });
        setTimeout(function () {
            self.setData({
                timerStatus: '',
                timerNumber: 60
            });
        }, 17);
        let timerId = setInterval(function () {
            self.setData({
                timerNumber: self.data.timerNumber - 1
            });
            if (self.data.timerNumber === 0) {
                clearInterval(self.data.timerId);
                // 电脑获胜
                self.gameOver('computer');
            }
        }, 1000);
        this.setData({
          timerId: timerId
        });
    },
    writeAnswer: function(event) {
        var letter = event.target.dataset.letter;
        if (letter === undefined) {
            return;
        }

        var newAnswer = '';
        var oldAnswer = this.data.answer;
        if (letter === 'delete') {
            if (oldAnswer.length === 1) {
                return;
            }
            newAnswer = oldAnswer.substr(0, oldAnswer.length - 1);
        } else {
            newAnswer = oldAnswer + letter;
        }
        this.setData({
            answer: newAnswer
        })
    },
    gameOver: function (winner) {
        console.log(winner);
        clearInterval(this.data.timerId);
        if (winner === 'computer') {
            this.setData({
                gameover: true,
                timerStatus: 'no-animation',
                resultMsg: 'GAME OVER!'
            });
        } else {
            console.log(123);
            this.setData({
                gameover: true,
                timerStatus: 'no-animation',
                resultMsg: 'YOU WIN!'
            })
        }
    }, 
    onShareAppMessage: function (options) {
      return {
        title: `单词接龙，好玩又能让你快速掌握大量单词`,
        path: '/pages/letters/letters',
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
});