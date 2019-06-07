class Config{

	constructor(){
		this.cfg={
			bookApiUrl:"https://api.zhuishushenqi.com",
			bookChapterApiUrl:"https://chapter2.zhuishushenqi.com"
		};
	}

	get(key){
		return this.cfg[key];
	}

	set(key,val){
		this.cfg[key] = val;
	}
}

let config = new Config();

export default config;