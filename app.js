App({
    onLaunch: function() {


    wepy.login().then(res => {
      console.log('login: ', res)
         })
        var o = this;
        wx.getSystemInfo({
            success: function(n) {
                o.globalData.isIpx = !(n.model.indexOf("iPhone X") < 0),
                o.globalData.systemInfo = n
            },
            fail: function(o) {},
            complete: function(o) {}
        })
    },
    onHide: function() {},
    onShow: function() {},
    globalData: {
        userInfo: null,
        code: "",
        userId: "",
        token: "",
        cart: {
            storeId: null,
            store: null,
            inventory: null,
            shipping_address: {}
        },
        tenantId: "5a747495ce615177009f6400",
        appId: "wxa3e11b3f3c3fa98e",
        BASE_URL: "http://larabbs.test", //本地测试时候取出https 的S
       
        stores: [],
        isIpx: !1,
        systemInfo: {}
    }, 
    login: function(o) {
        console.info("app.login()");
        var n = this;
        wx.login({
            success: function(e) {
                var t = e.code;
                console.info("code >", t),
                n.globalData.code = t;
                try {
                    var a = wx.getStorageSync("token"),
                    r = wx.getStorageSync("userId"),
                    i = wx.getStorageSync("userInfo");
                    console.log("check token", a),
                    console.log("check userId", r),
                    console.log("check userInfo", i),
                    a && r ? (n.globalData.token = a, n.globalData.userId = r, n.refreshUserProfile(function() {
                        "function" == typeof o && o(e)
                    })) : (wx.removeStorageSync("token"), wx.removeStorageSync("userId"), n.navigateLogin())
                } catch(o) {
                    n.navigateLogin()
                }
            },
            fail: function(o) {
                console.info("app.login() failed", o)
            },
            complete: function(o) {
                console.info("app.login() complete", o)
            }
        })
    },
    refreshUserProfile: function(o) {
        var n = this;
        this.getRequest(this.globalData.BASE_URL + "/auth/profile", {}).then(function(e) {
            console.log("userInfo", e),
            n.globalData.userInfo = e,
            wx.setStorageSync("userInfo", e),
            o && "function" == typeof o && o()
        })
    },
    navigateLogin: function() {
        wx.redirectTo({
            url: "/pages/login/login",
            success: function(o) {},
            fail: function(o) {},
            complete: function(o) {}
        })
    },
    showErrorMsg: function(o, n) {
        wx.showModal({
            title: o,
            content: n || "",
            showCancel: !1,
            confirmText: "知道了"
        })
    },
    getRequest: function(o, n) {
        var e = this;
        return new Promise(function(t, a) {
            wx.showNavigationBarLoading(),
            wx.request({
                url: o,
                data: n,
                method: "GET",
                header: {
                    "X-Tenant-Id": e.globalData.tenantId,
                    "X-API-Token": e.globalData.token
                },
                success: function(o) {
                    401 == o.statusCode ? (wx.removeStorageSync("token"), wx.removeStorageSync("userId"), e.globalData.token = "", wx.reLaunch({
                        url: "/pages/stores/stores"
                    })) : 200 == o.statusCode || 204 == o.statusCode ? t(o.data) : (console.error(o), console.error("error", o))
                },
                fail: function(o) {},
                complete: function(o) {
                    function n(n) {
                        return o.apply(this, arguments)
                    }
                    return n.toString = function() {
                        return o.toString()
                    },
                    n
                } (function(o) {
                    "function" == typeof complete && complete(o),
                    wx.hideNavigationBarLoading()
                })
            })
        })
    },
    postRequest: function(o, n) {
        var e = this;
        return new Promise(function(t, a) {
             console.log("请求参数")
                     console.log(n)
            wx.showNavigationBarLoading(),
            wx.request({
                url: o,
                data: n,
                method: "POST",
                header: {
                    "X-Tenant-Id": e.globalData.tenantId,
                    "X-API-Token": e.globalData.token
                },
                success: function(o) {
                    console.log("请求结果")
                     console.log(o)

                    401 == o.statusCode ? (e.globalData.token = "", wx.reLaunch({
                        url: "/pages/stores/stores"
                    })) : 201 == o.statusCode || 200 == o.statusCode? t(o.data) : (console.error("error", o), a(o.data))
                },
                fail: function(o) {},
                complete: function(o) {
                    function n(n) {
                        return o.apply(this, arguments)
                    }
                    return n.toString = function() {
                        return o.toString()
                    },
                    n
                } (function(o) {
                    "function" == typeof complete && complete(o),
                    wx.hideNavigationBarLoading()
                })
            })
        })
    }
});