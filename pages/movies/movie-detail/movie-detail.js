// pages/movies/movie-detail/movie-detail.js
var utils = require('../../../utils/utils.js');
var app = getApp();

Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.movieId;
    console.log(id);
    var url = app.globalData.douBanBase + "/v2/movie/subject/" + id;
    utils.http(url, this.processDouBanData);
  },
  processDouBanData: function (data) {
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }

    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentsCount: data.comments_count,
      year: data.year,
      genres: data.genres.join("、"),
      stars: utils.convertToStarArrays(data.rating.stars),
      scope: data.rating.average,
      director: director,
      casts: utils.converToCastString(data.casts),
      castsInform: utils.converToCastInfos(data.casts),
      summary: data.summary
    }
    console.log(movie);
    this.setData({
      movie: movie
    });
  },
  onCaleTap: function (e) {
    var curImg = e.currentTarget.dataset.src;
    wx.previewImage({
      current: curImg, // 当前显示图片的http链接
      urls: [curImg] // 需要预览的图片http链接列表
    })
  }
})