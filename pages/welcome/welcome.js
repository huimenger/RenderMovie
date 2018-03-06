// pages/welcome/welcome.js
Page({
  data:{},
  onTap:function(e){
    // 可返回
    wx.navigateTo({
      url: '../posts/post',
    })
    // 不可返回
    // wx.redirectTo({
    //   url: '../posts/post',
    // })
  }
})