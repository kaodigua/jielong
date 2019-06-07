import BookService from "./service/book-service";

class apiClient{

	constructor(cfg,request){
		this.cfg = cfg;
		this.request = request;

		this.init();
	}

	init(){
		let self = this;

		self.registerAPI("book",new BookService(this.cfg,this.request));
	}

	// 注册api
	registerAPI(name,instance){
		let self = this;

		self.addPromise(instance);
		self[name] = instance;
	}

	addPromise(instance){
		let self = this;
		let protoName = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));

		protoName.forEach(function(name){
			let original = instance[name];

			if(typeof original === "function" && name !== "constructor"){
				instance[name] = self.promiseOrCallback(original);
			}
		});
	}	

	promiseOrCallback(fn){
		let self = this;
		return function(){
			let slice = Array.prototype.slice;
			const args = slice.call(arguments);

			// 判断最后一位参数，是否是一个function
			if(typeof args[args.length-1] === "function" && args.length == fn.length){
				return fn.apply(self,args);
			}

			// 返回promise
			return new Promise((resolve,reject) => {
				// 动态的添加一个回调
				args.push((err,res) =>{
					err?reject(err):resolve(res);
				});
				fn.apply(self,args);
			});
		}
	}

}

export default apiClient;