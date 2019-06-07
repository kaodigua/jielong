import { getRandomColor, formatImageUrl } from '../../../utils/util.js';
import api from "../../../api/index.js";
import config from "../../../config";

const app = getApp();

Page({
    data: {
        books: [],
        loading: false,
        searches: [],
        showSearchLog: true
    },

    onLoad: function () {
        //调用API从本地缓存中获取数据
        const searchArray = wx.getStorageSync("book:"+'searches') || [];
        const searches = searchArray.map((search) => {
            return { color: getRandomColor(), word: search };
        });
        this.setData({ searches: searches });
        // console.log("onLoad");
    },

    bindHideKeyboard: function (e) {
        //收起键盘
        wx.hideKeyboard();
    },

    autoComplete: function (e) {
        const query = e.detail.value;
        if (!query) { return };
        api.book.fetchAutoComplete(query)
            .then((response) => {
                console.log(response);
            });
    },

    search: function (e) {
        const query = e.detail.value || e.currentTarget.dataset.query;
        if (!query) { return };
        this.setData({ loading: true });
        this.logSearch(query);
        api.book.fetchSearch(query)
            .then(response => {
                response.books.map((item) => { item.cover = formatImageUrl(item.cover,config.cfg.bookApiUrl) });
                this.setData({ books: response.books, loading: false, showSearchLog: false });
            }).catch(e => {
                this.setData({ loading: false, showSearchLog: false });
                console.error(e);
            });
    },

    logSearch: function (word) {
        const searchArray = wx.getStorageSync("book:"+'searches') || [];
        if (searchArray.indexOf(word) === -1) {
            searchArray.unshift(word);
            wx.setStorageSync("book:"+'searches', searchArray);
            this.setData({ searches: wx.getStorageSync("book:"+'searches') });
        }
    },

    clear: function () {
        this.setData({ searches: [] });
        wx.setStorageSync("book:"+'searches', []);
    }
})