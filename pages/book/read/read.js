import timeago from '../../../utils/timeago.js';
import api from "../../../api/index.js";

//read.js
//获取应用实例
const app = getApp()
let book;

Page({
    data: {
        //book: {},
        loading: false,
        content: '',
        showFooter: false,
        showModal: false,
        modalList: [],
        isChapterList: false,
        readIndex: 0,
        currentSource: '',
        //chapters: [],
        toView: '#',
        currentSourceIndex:0
    },

    onLoad: function (params) {
        // let [bookSources, chapters] = [[], []];
        book = wx.getStorageSync("book:"+params.id);
        const extra = book.extra;
        this.setData({ loading: true });
        wx.setNavigationBarTitle({ title: book.title });
        if (extra) {
            //this.setData({ book: book });
            if(extra.chapters && extra.chapters.length>0){
                this.getChapterContent(extra.readIndex || 0);
            }else{
                this.changeSourceIndex(0);
            }
            
            if (params.lastUpdated !== book.updated) {
                this.getNewestChapters();
            }
        } else {
            this.getBookSources()
            .then((response) => {                
                this.tryBookSource();                
            })
        }
    },
    tryBookSource(){
        this.getNewestChapters()
            .then(response => {
                return this.getChapterContent();
            })
            .catch(e => {
                this.changeSourceIndex();
            });
    },
    changeSourceIndex(idx){
        //const book = book;
        const modalList = book.extra.sources;
        let index;
        if(idx!=undefined){
            index = idx;
        }else{
            index = ++this.data.currentSourceIndex;
        }
        if(index < modalList.length){
            let bookSource = modalList[index];
            book.extra.currentSource = bookSource._id;

            this.tryBookSource();
        }else{
            this.setData({ loading: false });
            wx.showToast({
                title: '获取资源失败，请换源重试!',
                icon: 'warn',
                duration: 2000
            });
            //console.error(e);
        }
    },
    getChapterContent: function (index = 0) {
        const chapter = book.extra.chapters[index || 0];
        if (chapter && chapter.link) {
            this.setData({ showFooter: false, showModal: false, loading: true });
            api.book.fetchChapter(chapter.link).then((response) => {
                this.setData({
                    content: response.chapter.body,
                    title: response.chapter.title,
                    showModal: false,
                    loading: false,
                    readIndex: index
                });
                book.extra.readIndex = index;
                wx.setStorageSync("book:"+book._id, book);
            })
                .catch(e => {
                    /*this.setData({ loading: false });
                    this.showToast('获取资源失败，请换源重试!');
                    console.error(e);*/

                    this.changeSourceIndex();
                });
        }
    },

    showToast: function (title) {
        wx.showToast({
            title: title,
            icon: 'success',
            duration: 2000
        });
    },

    getNewestChapters: function () {
        //const book = book;
        return api.book.fetchChapters(book.extra.currentSource)
            .then(response => {
                book.extra.chapters = response.chapters || [];
                this.setData({ loading: false });
                wx.setStorageSync("book:"+book._id, book);
                return book.extra.chapters;
            });
    },

    getBookSources: function () {
        //const book = book;
        return api.book.fetchBookSource(book._id)
            .then(response => {
                const avalibleSources = response.filter((source) => {
                    return source.host !== 'vip.zhuishushenqi.com';
                })||[];
                if (!book.extra) {
                    book.extra = {}
                }
                book.extra.currentSource = avalibleSources.length>0?avalibleSources[0]._id:"";
                book.extra.sources = avalibleSources;
                this.setData({ currentSource: book.extra.currentSource });
                wx.setStorageSync("book:"+book._id, book);
                return response;
            })
            .catch(e=>{
                this.setData({ loading: false });
                wx.showToast({
                    title: '获取资源失败!',
                    icon: 'warn',
                    duration: 2000
                });
            });
    },

    bindViewTap: function (e) {
        if (this.data.showModal) {
            this.setData({ showModal: false });
        } else {
            this.setData({ showFooter: !this.data.showFooter });
        }
    },

    showSources: function () {
        const timeagoInstance = timeago();
        const modalList = book.extra.sources.map(source => {
            source.updated = timeagoInstance.format(source.updated, 'zh_CN');
            return source;
        });
        this.setData({ modalList: modalList, showModal: true, isChapterList: false });
    },

    showChapters: function () {
        this.setData({ modalList: book.extra.chapters, showModal: true, isChapterList: true, toView: `index-${this.data.readIndex}` });
    },

    readChapter: function (e) {
        const index = e.currentTarget.dataset.chapterindex;
        this.getChapterContent(index);
    },

    changeSource: function (e) {
        const bookSource = e.currentTarget.dataset.source;
        //const book = book;
        this.setData({ loading: true });
        this.getNewestChapters()
            .then(response => {
                book.extra.currentSource = bookSource._id;
                this.setData({ showModal: false, loading: false });
                wx.setStorageSync("book:"+book._id, book);
                return this.getChapterContent(this.data.readIndex);
            })
            .catch(e => {
                this.setData({ loading: false });
                wx.showToast({
                    title: '获取资源失败，请换源重试!',
                    icon: 'warn',
                    duration: 2000
                });
                console.error(e);
            }
            );;
    },


    prevChapter: function () {
        if (this.data.readIndex <= 0) {
            return this.showToast('这已经是第一章啦！');
        } else {
            this.getChapterContent(--this.data.readIndex);
        }
    },
    nextChapter: function () {
        if (this.data.readIndex >= book.extra.chapters.length) {
            return this.showToast('没有最新章节啦， 请等候更新！');
        } else {
            this.getChapterContent(++this.data.readIndex);
        }
    }
})