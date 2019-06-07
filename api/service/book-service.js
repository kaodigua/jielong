class Service{
	constructor(cfg,request){
		this.cfg = cfg;
		this.request = request;
	}
	// 书籍详情
	// GET api.zhuishushenqi.com/book/57206c3539a913ad65d35c7b
	fetchBook(id,next) {
	    const url = `${this.cfg.bookApiUrl}/book/${id}`;
	    this.request({
	    	url:url,
	    	header: { 'Content-Type': 'json' },
	    	data:{},
	    	success:function(res){
	    		next(null,res.data);
	    	},
	    	fail:function(err){
	    		next(err);
	    	}

	    });
	}
	// 书源
	// GET api.zhuishushenqi.com/toc?view=summary&book=57206c3539a913ad65d35c7b
	fetchBookSource(id,next) {
	    const url = `${this.cfg.bookApiUrl}/toc`;
	    const params = { view: 'summary', book: id };
	    this.request({
	    	url:url,
	    	header: { 'Content-Type': 'json' },
	    	data:params,
	    	success:function(res){
	    		next(null,res.data);
	    	},
	    	fail:function(err){
	    		next(err);
	    	}

	    });
	}
	// 章节列表
	// GET api.zhuishushenqi.com/toc/577b477dbd86a4bd3f8bf1b2?view=chapters
	fetchChapters(id,next) {
	    const url = `${this.cfg.bookApiUrl}/toc/${id}`;
	    const params = { view: 'chapters' };
	    this.request({
	    	url:url,
	    	header: { 'Content-Type': 'json' },
	    	data:params,
	    	success:function(res){
	    		next(null,res.data);
	    	},
	    	fail:function(err){
	    		next(err);
	    	}

	    });
	}
	// 章节
	// GET chapter2.zhuishushenqi.com/chapter/http%3a%2f%2fbook.my716.com%2fgetBooks.aspx%3fmethod%3dcontent%26bookId%3d1127281%26chapterFile%3dU_1212539_201701211420571844_4093_2.txt?k=2124b73d7e2e1945&t=1468223717
	fetchChapter(link,next) {
	    const url = `${this.cfg.bookChapterApiUrl}/chapter/${link}`;
	    const params = { k: '2124b73d7e2e1945', t: '1468223717' };
	    this.request({
	    	url:url,
	    	header: { 'Content-Type': 'json' },
	    	data:params,
	    	success:function(res){
	    		next(null,res.data);
	    	},
	    	fail:function(err){
	    		next(err);
	    	}

	    });
	}
	// 搜索
	// GET api.zhuishushenqi.com/book/fuzzy-search?query=一念&start=0&limit=2
	fetchSearch(query,next) {
	    const url = `${this.cfg.bookApiUrl}/book/fuzzy-search`;
	    const params = { query: query, start: 0, limit: 5 };
	    this.request({
	    	url:url,
	    	header: { 'Content-Type': 'json' },
	    	data:params,
	    	success:function(res){
	    		next(null,res.data);
	    	},
	    	fail:function(err){
	    		next(err);
	    	}

	    });
	}
	
	// 自动补全
	// GET api.zhuishushenqi.com/book/auto-complete?query=一念
	fetchAutoComplete(query,next) {
	    const url = `${this.cfg.bookApiUrl}/book/auto-complete`;
	    const params = { query: query };
	    this.request({
	    	url:url,
	    	header: { 'Content-Type': 'json' },
	    	data:params,
	    	success:function(res){
	    		next(null,res.data);
	    	},
	    	fail:function(err){
	    		next(err);
	    	}

	    });
	}



}

export default Service;