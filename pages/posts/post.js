var postsData = require('../../data/post-data.js');

Page({
  data:{
    // 小程序总会先读取data对象来做数据绑定，这个动作我们称之为A
    // A动作的执行，实在onload之后发生的
  },
  onLoad:function(options){
    // this.data.post_key = postsData.postList
    this.setData({
        post_key:postsData.postList
    });
  },
  onPostTap:function(e){
    var postId = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  onSwiperTap:function(e){
    // e.currentTarget 事件捕获 阶段 - Swiper
    // e.target 事件触发（点击） 阶段 - image
    // 点击 image 事件向上冒泡，到catchtap 阻止冒泡，捕获事件
    var postId = e.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    }) 
  }
})