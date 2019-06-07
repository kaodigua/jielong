
var cache = require("../../utils/cache.js");
const key = "letters:user:level";
const times=10;

module.exports= {
  level:1,
  init(){
    var self=this;
    this.getLocalLevel(function(level){
      self.level = level;
    });
  },
  getLocalLevel(next){
    cache.get(key, function (err, level) {
      if (err) {
        next(1)
        console.log("没有获取到level");
        return;
      };
      console.log("get level from Cache, data: %j", level);

      next(level);
    });
  },
  getLevel(){
    return this.level;
  },
  getLevelWords(){
    return this.level * times;
  },
  setLevel(level){
    let self=this;
    cache.set(key, level, function (err, res) {
      if (err) {
        console.log("设置level缓存失败");
        cb(null, err);
      };
      self.level=level;
      console.log("设置level缓存成功");
    });
  }
};
