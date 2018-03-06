var postsData = require('../../../data/post-data.js');
var app = getApp();
Page({
    data: {
        isPlayingMusic: false,
        currentPostId:""
    },
    onLoad: function (option) {
        var postId = option.id;
        var postData = postsData.postList[postId];
        
        //this.data.postData = postData;
        this.setData({
            postData: postData,
            currentPostId: postId
        });
        // var postsCollected = {
        //     1:"false",
        //     2:'true', 当没有2 时，默认false
        //     3:'true'
        // }

        // 获取所有的 缓存
        var postsCollected = wx.getStorageSync('posts_Collected');
        // 判断当前文章的缓存
        if (postsCollected) {
            // 当前文章缓存
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            });
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_Collected', postsCollected)
        }

        // 设置全局变量
        if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
            this.setData({
                isPlayingMusic: true,
            });
        }
        // 监听音乐总控开关的的 事件函数
        this.setMusicMonitor();
    },
    setMusicMonitor:function(){
        var that = this;
        wx.onBackgroundAudioPlay(function(){
            that.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlayingMusic = true;
            // 设置当前页面 全局id
            console.log(that.data.currentPostId);
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function(){
            that.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
        // 音乐播放结束后恢复默认设置
        wx.onBackgroundAudioStop(function(){
            that.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },
    onCollectionTap: function (e) {
        // 获取缓存
        // var game = wx.getStorageSync('key');
        // console.log(game);

        var postsCollected = wx.getStorageSync('posts_Collected');
        var postCollected = postsCollected[this.data.currentPostId];
        // 输出测试
        //console.log(postsCollected, this.data.currentPostId);
        // 收藏取反
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showModal(postsCollected, postCollected);

    },
    onShareTap: function (e) {
        // 删除全部缓存
        // wx.removeStorageSync('key');
        // wx.clearStorageSync();
        // sconsole.log(this.data.postId);
        var itemList = [
            "分享到微信",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#f30000",
            success: function (res) {
                // res.cancel 用户是否点击了取消
                // res.tapIndex 数组元素的序号，从从0开始
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消" + res.cancel + "现在不支持分享功能"
                })
            }
        })
    },
    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确定",
            confirmColor: "#f30000",
            success: function (res) {
                if (res.confirm) {
                    // 更新文章是否收藏的缓存值
                    wx.setStorageSync('posts_Collected', postsCollected);
                    // 更新数据绑定信息
                    that.setData({
                        collected: postCollected
                    });
                }
            }

        })
    },
    showToast: function (postsCollected, postCollected) {
        var that = this;
        // 更新文章是否收藏的缓存值
        wx.setStorageSync('posts_Collected', postsCollected);
        // 更新数据绑定信息
        that.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消成功',
            icon: 'success',
            duration: 2000
        })
    },
    onMusicTap: function (e) {
        var currentPostId = this.data.currentPostId;
        var isPlayingMusic = this.data.isPlayingMusic;
        var postData = postsData.postList[currentPostId];
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            //this.data.isPlayingMusic = false;
            this.setData({
                isPlayingMusic:false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg
            });
           // this.data.isPlayingMusic = true;
            this.setData({
                isPlayingMusic:true
            });
        }

    }
})