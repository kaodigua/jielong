module.exports = {
  get: function(key, next) {
    wx.getStorage({
      key: key,
      success: function (res) {
        if (res.errMsg == "getStorage:ok")  {
          next(null, res.data);
        } else {
          next(null, null);
        }
      },
      fail: function(err) {
        next(err);
      }
    })
  },
  set: function(key, data, next){
    wx.setStorage({
      key: key,
      data: data,
      success: function (res) {
        next(null, res);
      },
      fail: function (err) {
        next(err);
      }
    })
  },
  remove: function(key, next) {
    wx.removeStorage({
      key: key,
      success: function (res) {
        next(null, res);
      },
      fail: function (err) {
        next(err);
      }
    })
  }
}