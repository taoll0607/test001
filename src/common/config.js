//const ROOTPATH = "https://labs-kilo.erongyun.com/"//"https://mallbff.dev.aiyouhelp.com";
//const ROOTPATH = "http://127.0.0.1:8080";
let ROOTPATH = "http://10.10.1.105:80"
let FILESERVICE = "http://172.16.88.50:8083"
let APPID = "wxd33103789251644f"
if (process.env.NODE_ENV !== "development") {
  FILESERVICE = "https://ygtstatics.erongyun.com"
  ROOTPATH = "https://ygtmobile.erongyun.com"	
  APPID = "wx032849011595fc83"
}
window.APPID = APPID
window.APIHOST = ROOTPATH
window.FILESERVICE = FILESERVICE

module.exports = {
  APIHOST: ROOTPATH,
  FILESERVICE
}
