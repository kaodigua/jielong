// pages/interest/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  handleProxy(e) {
    if (e.currentTarget.dataset.eventid === "0") {
      wx.navigateTo({
        url: '../game/main?path=four',
      })
    } else if (e.currentTarget.dataset.eventid === "1") {
      wx.navigateTo({
        url: '../game/main?path=six',
      })
    } else if (e.currentTarget.dataset.eventid === "2") {
      wx.navigateTo({
        url: '../game/main?path=nine',
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.reLaunch({
    //   url: '../../../interest1/index',
    // })
    let deep = getCurrentPages().length;
    wx.navigateBack({
      delta: deep
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})