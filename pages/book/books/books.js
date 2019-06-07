import { getRandomColor, formatImageUrl } from '../../../utils/util.js';

const app = getApp();
const hot = [
    {
        _id:"520da5d2dd2dfa6926000fc1",
        author:"风满楼",
        cat:"唐诗",
        copyright:"正版授权",
    cover:"http://www.kfzimg.com/G03/M01/5D/B2/pYYBAFWvJZCAIelfAANNfElNpXI260_b.jpg",
        gender:["male"],
    longIntro:"《唐诗三百首》是一部流传很广的唐诗选集。唐朝（618年~907年）二百八十九年间，是中国诗歌发展的黄金时代，云蒸霞蔚，名家辈出，唐诗数量多达五万余首。",
        majorCate:"诗词歌赋",
        minorCate:"唐诗",
        title:"唐诗三百首",
        lastChapter:"唐诗三百首",
        lastUpdated:"1年前",
        retentionRatio:"61.78",
        updated:"2017-11-23T02:41:46.500Z",
        latelyFollower:48035,
        postCount:220795,
    }
];

Page({
    data: {
        books: [],
        loading: false,
        empty: false,
        tang300:{}
    },

    onLoad: function () {
    },
    onShow(){
        //调用API从本地缓存中获取数据
        const res = wx.getStorageInfoSync();
        let books = res.keys.map((key) => {
            if (!['book:searches'].includes(key) && key.substr(0,5)=="book:") {
                return wx.getStorageSync(key);
            }
        })
        books = books.filter((book) => {
            if (book) {
                return book;
            }
        });
        books.forEach(function(item,index,array){
            let url = item.cover;
            url = decodeURIComponent(url);
            url = url.replace("/agent/","");
            if(url.slice(-1)=="/"){
                url = url.substr(0,url.length-1);
            }
            delete item.extra;
            item.cover = url;
        });
        books.reverse();
        //books=books.concat(hot);
        let key;
        for (var i = 0; i < books.length; i++) {
            key = 'books['+i+']';
            this.setData({
              [key]:books[i]
            })
        }
      this.setData({ tang300: hot[0]});
        // this.setData({empty: (books.length === 0) });

    },
    onLongpress(e){
      var self = this;
      wx.showModal({
          title: '提示',
          content: '删除此书',
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定');
                  let item = e.currentTarget.dataset.item;
                  let bookId = item._id;
                  let key = `book:${bookId}`;                  
                  try {
                    wx.removeStorageSync(key);
                    self.deleteBook(bookId);
                  } catch (e) {
                    // Do something when catch error
                  }

              } else if (res.cancel) {
                  console.log('用户点击取消')
              }
          }
      });
  },
  deleteBook(id){
    let arr=this.data.books;
    let len=arr.length;
    for (var i = 0; i < len; i++) {
        if(arr[i]._id==id){
            arr.splice(i,1);
            break;
        }
    }
    len = arr.length;
    this.setData({
      books:arr
    })
    /*let key;
    for (var i = 0; i < len; i++) {
        key = 'books['+i+']';
        this.setData({
          [key]:arr[i]
        })
    }*/
    // this.setData({empty: (len === 0) });
  },

    goSearchPage: function (e) {
        wx.navigateTo({
            url: '../search/search'
        });
    }
})