var utils = require('../../utils/utils.js');

var app = getApp();
Page({
    // RESTFul API JSON
    // SOAP XMl
    // 粒度
    data:{
        isTheaters:{},
        comingSoon:{},
        top250:{},
        searchResult:{},
        containerShow:true,
        srearchPanelShow:false
    },
    onLoad: function (e) {
        var isTheaters = app.globalData.douBanBase + "/v2/movie/in_theaters"+"?start=0&count=3";
        var comingSoonUrl = app.globalData.douBanBase + "/v2/movie/coming_soon"+"?start=0&count=3";
        var top250 = app.globalData.douBanBase + "/v2/movie/top250"+"?start=0&count=3";
        
        // 异步调用 没有办法判断console先后顺序
        this.getMovieListData(isTheaters,"isTheaters");
        this.getMovieListData(comingSoonUrl,"comingSoon");
        this.getMovieListData(top250,"top250");
    },
    onMoreTap:function(e){
        var slogan = e.currentTarget.dataset.slogan;
        wx.navigateTo({
            url:"more-movie/more-movie?slogan=" + slogan
        });
    },
    onMovieTap:function(e){
        var id = e.currentTarget.dataset.movieid;
        wx.navigateTo({
            url:"movie-detail/movie-detail?movieId=" + id
        });
    },
    getMovieListData: function (url,settedKey) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "application/xml"
            }, // 设置请求的 header
            success: function (res) {
                // success
                that.processDouBanData(res.data,settedKey);
            },
            fail: function () {
                // fail
                console.log("fail");
            }
        });
    },
    processDouBanData:function(MovieDouBan,settedKey){
        var movies = [];
        var subjects = MovieDouBan.subjects;
        
        for(var idx in subjects){
            var title = subjects[idx].title;
            if(title.length > 6){
                title = title.substr(0,6)+"...";
            }
            var imgUrl = subjects[idx].images.large;
            var id = subjects[idx].id;
            var average = subjects[idx].rating.average;
            var stars = subjects[idx].rating.stars;

            var temp = {
                title:title,
                imgUrl:imgUrl,
                movieId:id,
                average:average,
                stars:utils.convertToStarArrays(stars)
            }
            movies.push(temp);
        }
        
        var readyData = {};
        readyData[settedKey] = {
            movies:movies,
            slogan:utils.judgeTitle(settedKey)
        }
        this.setData(readyData);
    },
    // 搜索组件
    onBindFocus:function(e){
        console.log('获取焦点');
        this.setData({
            containerShow:false,
            srearchPanelShow:true
        });
    },
    onCanceImgTap:function(e){
        console.log('关闭搜索');
        this.setData({
            containerShow:true,
            srearchPanelShow:false,
            searchResult:{}
        });
    },
    onBingChange:function(e){
        var text = e.detail.value;
        console.log(text);
        var searchUrl = app.globalData.douBanBase +"/v2/movie/search?q=" + text;
       this.getMovieListData(searchUrl,"searchResult");
    }
})