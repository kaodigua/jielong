// pages/interest/index.js
import store from '../../utils/store.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sdArr: new Array(100),
    msg: {},
    time: 0,
    status: 1,
    imgSrc: '../../'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (store.result) {
      var status = store.result.avg - store.result.time > 0 ? store.result.avg - store.result.time > 60 ? 3 : 2 : 1
      this.setData({
        sdArr: store.result.sdArr,
        time: store.result.time,
        msg: store.result,
        able: this.data.sdArr.map(x => x ? 0 : 1),
        status: status
      })
    } else {
      wx.redirectTo({
        url: '../home/main',
      })
    }
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

  again() {
    var url = this.data.msg.type == 4 ? '../game/main?path=four' : this.data.msg.type == 6 ? '../game/main?path=six' : this.data.msg.type == 9 ? '../game/main?path=nine' : '../home/main'
    wx.redirectTo({
      url: url,
    })
  }
})