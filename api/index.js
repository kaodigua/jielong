import config from "../config";
import apiClient from "./api-client";

//设置中间层，http代理
function request(opts){
	wx.request(opts);
}

let api = new apiClient(config.cfg,request);

export default api;