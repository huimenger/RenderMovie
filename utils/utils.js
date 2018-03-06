function convertToStarArrays(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}
function judgeTitle(_name) {
    switch (_name) {
        case "isTheaters":
            return "正在热映";
            break;
        case "comingSoon":
            return "即将上映";
            break;
        case "top250":
            return "Top250";
            break;
        default:
            return "error";
            break;
    }
}
function http(url,callBack,method,settedkey){
    douban_limit();
    wx.request({
        url: url,
        method: method || "GET",
        header: {
            "Content-Type": "application/xml"
        },
        success: function (res) {
           callBack(res.data,settedkey);
        },
        fail: function (err) {
            console.log(err);
        }
    });
}
function converToCastString(casts){
    var castsjoin = "";
    for(var idx in casts){
        castsjoin = castsjoin + casts[idx].name + ' / ';
    }
    return castsjoin.substring(0,castsjoin.length-2);
}
function converToCastInfos(casts){
    var castArray = [];
    for(var idx in casts){
        var cast = {
            img:casts[idx].avatars ? casts[idx].avatars.large : "",
            name:casts[idx].name
        }
        castArray.push(cast);
    }
    return castArray;
}
function douban_limit() {
    var timestamp = Date.parse(new Date());
    var requestDoubanTime = wx.getStorageSync('requestDoubanTime');
    var requestDoubanNum = wx.getStorageSync('requestDoubanNum');
    if (requestDoubanTime && timestamp - requestDoubanTime < 60000) {
        wx.setStorageSync('requestDoubanNum', requestDoubanNum += 1);
        if (requestDoubanNum < 35) {
            //Lower than 35/m,pass            
            return;
        }
        else {
            wx.showToast({
                title: '豆瓣api请求频率超35/m，小心',
                icon: 'loading',
                duration: 5000
            })
            //提示或者去别的地方
            // wx.redirectTo({
            //      url:"pages/welcome/welcome"
            // });
        }
    }
    else {
        wx.setStorageSync('requestDoubanTime', timestamp);
        wx.setStorageSync('requestDoubanNum', 1);
    }
}
module.exports = {
    convertToStarArrays: convertToStarArrays,
    judgeTitle: judgeTitle,
    http:http,
    converToCastString:converToCastString,
    converToCastInfos:converToCastInfos
}