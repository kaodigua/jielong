import { SDsix, SDfour, SDnine, isAllRight } from '../../utils/sdpro.js'
import store from '../../utils/store.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sdArr: [],
    blankArr: [],
    level: 18,
    startTime: Date.now(),
    activeId: null,
    able: [],
    sign: 'g0',
    signX: 0,
    signY: 0,
    error: 0,
    count: 1,
    typelevel: 0,
    type: 0,
    path: '',
    imgSrc: '../../'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      path: options.path
    });
    if (this.data.path == 'four') {
      this.sd = new SDfour()
      this.sd.createSdArr()
      this.sd.blankNum = this.data.level = this.data.typelevel = 8
      this.sd.createBlank()
      this.data.type = 4
      this.avg = 120
    } else if (this.data.path == 'six') {
      this.sd = new SDsix()
      this.sd.createSdArr()
      this.sd.blankNum = this.data.level = this.data.typelevel = 18
      this.sd.createBlank()
      this.data.type = 6
      this.avg = 180
    } else if (this.data.path == 'nine') {
      this.sd = new SDnine()
      this.sd.createSdArr()
      this.sd.blankNum = this.data.level = this.data.typelevel = 40
      this.sd.createBlank()
      this.data.type = 9
      this.avg = 360
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
    this.setData({
      sdArr: this.sd.sdArr.slice(),
      able: this.sd.sdArr.map(x => x ? 0 : 1),
      startTime: Date.now(),
      activeId: null,
      sign: 'g0',
      signX: 0,
      signY: 0
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  signChange: function (e) {
    // console.log(e.target.dataset.able, e.target.dataset)
    if (e.target.dataset.able == 1) {
      this.setData({
        activeId: e.target.dataset.id,
        sign: e.target.dataset.id,
        signX: e.target.dataset.id - e.target.dataset.id % 10,
        signY: e.target.dataset.id % 10
      });
    } else {
      // console.log(888)
      this.setData({
        activeId: null,
        sign: 'g' + e.target.dataset.num,
        signX: 0,
        signY: 0
      });
    }
  },
  set: function (e) {
    let sdArrKey = 'sdArr[' + this.data.activeId + ']'
    if (this.data.activeId && this.data.sdArr[this.data.activeId] != e.target.dataset.index) {
      this.setData({
        level: this.data.sdArr[this.data.activeId] == '' ? this.data.level - 1 : this.data.level,
        [sdArrKey]: parseInt(e.target.dataset.index),
        sign: 'g' + e.target.dataset.index,
        signX: 0,
        signY: 0
      });
      if (this.data.level == 0) {
        this.check()
      }
    }
  },
  check() {
    // if (this.data.sdArr + '' == this.sd.backupSdArr + '') {
    if (isAllRight(this.data.type, this.data.sdArr)) {
      store.result = {
        type: this.data.type,
        sdArr: this.data.sdArr,
        time: Math.floor((Date.now() - this.data.startTime) / 1000),
        count: this.data.count,
        error: this.data.error,
        avg: this.avg
      }
      wx.navigateTo({
        url: '../result/main',
      })
    }
  },
  
  undo() {

  },
  back() {
    wx.redirectTo({
      url: '../home/main',
    })
  },
  restart() {
    console.log(this.data.sdArr, this.sd.sdArr)
    this.setData({
      level: this.data.typelevel,
      sdArr: this.sd.sdArr.slice(),
      startTime: Date.now(),
      activeId: null,
      sign: 'g0',
      signX: 0,
      signY: 0,
      count: this.data.count + 1
    })
  }
})