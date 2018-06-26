var e = getApp(),
o = require("./configs.js"),
t = require("./utils/pingpp.js");
module.exports = {
    setGlobal: function(o, t) {
        e.globalData[o] = t
    },
    setStore: function(t) {
        wx.setStorageSync("nitro:storeId", t),
        e.globalData.storeId = t,
        e.globalData.store = o.stores.find(function(e) {
            return e._id === t
        })
    },
    getStore: function(e) {
        var o = e || wx.getStorageSync("nitro:storeId");
        return this.getStores().find(function(e) {
            return e._id === o
        })
    },
    getStores: function() {
        return o.stores
    },
    fetchProducts: function(o) {
        var t = o || e.globalData.storeId,
        r = e.globalData.categories,
        s = e.globalData.items;
        return r && s ? (console.info("fetchProducts() from local"), Promise.resolve().then(function() {
            return {
                categories: r,
                items: s
            }
        })) : Promise.all([e.getRequest(e.globalData.BASE_URL + "/product/categories?store_id=" + t, {}), e.getRequest(e.globalData.BASE_URL + "/product/items?store_id=" + t, {})]).then(function(o) {
            var t = o[0],
            r = o[1];
            return e.globalData.categories = t,
            e.globalData.items = r,
            console.info("fetchProducts() from remote"),
            {
                categories: t,
                items: r
            }
        })
    },
    payOrder: function(o) {
        wx.showLoading({
            title: "准备支付…",
            mask: !0
        }),
        o ? (console.log("payOrder app.globalData", e.globalData), e.postRequest(e.globalData.BASE_URL + "/orders/" + o + "/pay", {}).then(function(r) {
            console.info("pay charge", r),
            t.createPayment(r,
            function(t, s) {
                console.info("payment", t, s),
                "success" == t ? wx.showToast({
                    title: "支付成功",
                    icon: "success",
                    duration: 2e3,
                    success: function() {
                        wx.reLaunch({
                            url: "/pages/orders/orders?reload=true"
                        })
                    }
                }) : (wx.showToast({
                    title: "已取消支付",
                    icon: "none",
                    duration: 2e3
                }), console.log("info", t, s.msg, s.extra), e.postRequest(e.globalData.BASE_URL + "/orders/" + o + "/uncharge", {
                    charge_id: r.id
                }).then(function(e) {
                    console.info("客户端撤销支付", e),
                    wx.reLaunch({
                        url: "/pages/orders/orders?reload=true"
                    })
                }))
            })
        },
        function(e) {
            wx.showToast({
                title: "当前下单人较多，服务器繁忙，请稍后再试。",
                icon: "none",
                duration: 2e3,
                success: function() {
                    setTimeout(function() {
                        wx.removeStorageSync("token"),
                        wx.removeStorageSync("userId"),
                        wx.reLaunch({
                            url: "/pages/stores/stores"
                        })
                    },
                    2e3)
                }
            })
        })) : wx.showToast({
            title: "数据异常，请重试。",
            icon: "none",
            duration: 2e3,
            success: function() {}
        })
    }
};