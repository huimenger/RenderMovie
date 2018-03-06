// pages/movies/more-movie/more-movie.js
var app = getApp();
var utils = require('../../../utils/utils.js');

Page({
  data: {
    movies: {},
    nextDataUrl: "",
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    // 页面初始化 options 参数集合
    var slogan = options.slogan;
    // 并没有在onReady 里设置
    wx.setNavigationBarTitle({
      title: slogan
    });
    var dataUrl = "";
    // 一般默认是20条数据
    switch (slogan) {
      case "正在热映":
        dataUrl = app.globalData.douBanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.douBanBase + "/v2/movie/coming_soon";
        break;
      case "Top250":
        dataUrl = app.globalData.douBanBase + "/v2/movie/top250";
        break;
    }
    this.data.nextDataUrl = dataUrl;
    utils.http(dataUrl, this.processDouBanData);
  },
  processDouBanData: function (MovieDouBan) {
    var movies = [];
    var subjects = MovieDouBan.subjects;

    for (var idx in subjects) {
      var title = subjects[idx].title;
      if (title.length > 6) {
        title = title.substr(0, 6) + "...";
      }
      var imgUrl = subjects[idx].images.large;
      var id = subjects[idx].id;
      var average = subjects[idx].rating.average;
      var stars = subjects[idx].rating.stars;

      var temp = {
        title: title,
        imgUrl: imgUrl,
        movieId: id,
        average: average,
        stars: utils.convertToStarArrays(stars)
      }
      movies.push(temp);
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      console.log(this.data.movies, movies, totalMovies);
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    // 隐藏加载loading
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  // 下拉加载数据
  onScrollLower: function () {
    var nextDataUrl = this.data.nextDataUrl + "?start=" + this.data.totalCount + "&count=20";
    console.log("加载数据");
    utils.http(nextDataUrl, this.processDouBanData);
    // 显示加载loading
    wx.showNavigationBarLoading();

  },
  onPullDownRefresh: function (e) {
    var refeshDataUrl = this.data.nextDataUrl + "?start=0&count=20";
    utils.http(refeshDataUrl, this.processDouBanData);
    this.data.movies = {};
    this.data.isEmpty = true;
    // todo 
    wx.showNavigationBarLoading();
  },
 onMovieTap:function(e){
        var id = e.currentTarget.dataset.movieid;
        wx.navigateTo({
            url:"../movie-detail/movie-detail?movieId=" + id
        });
    }
})