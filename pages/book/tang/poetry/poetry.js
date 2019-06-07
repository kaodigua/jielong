// pages/book/tang/main/poetry.js
import tang from '../../../../model/tang.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poetry: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let typeIndex = options.typeIndex;
    let poetryIndex = options.poetryIndex;
    let poetry = tang[typeIndex].children[poetryIndex];
    poetry.content = poetry.content.replace(/\|/g, '\n')
    this.setData({ poetry: poetry })
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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