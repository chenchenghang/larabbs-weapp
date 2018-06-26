function e(e, r) {
    var i = void 0;
    return o[e].forEach(function(e) {
        e.id === r && (i = e)
    }),
    i
}
var o = {
    Order: [{
        id: "created",
        name: "已创建",
        workflow: "预订"
    },
    {
        id: "confirmed",
        name: "已确认",
        workflow: "预订"
    },
    {
        id: "resolved",
        name: "已拆分",
        workflow: "预订"
    },
    {
        id: "merged",
        name: "被合并",
        workflow: "预订"
    },
    {
        id: "revoked",
        name: "已取消",
        workflow: "预订"
    },
    {
        id: "closed",
        name: "已关闭",
        workflow: "预订"
    },
    {
        id: "finished",
        name: "已完成",
        workflow: "评价"
    }],
    Payment: [{
        id: "unpaid",
        name: "未支付",
        workflow: "预订"
    },
    {
        id: "prepaid",
        name: "已付定金",
        workflow: "预订"
    },
    {
        id: "paid_in_full",
        name: "已付全款",
        workflow: "拍摄"
    },
    {
        id: "refund_issued",
        name: "退款中",
        workflow: "预订"
    },
    {
        id: "refund_settled",
        name: "已退款",
        workflow: "预订"
    }],
    Ticket: [{
        id: "created",
        name: "等待拍摄",
        workflow: "拍摄"
    },
    {
        id: "confirmed",
        name: "等待拍摄",
        workflow: "拍摄"
    },
    {
        id: "service_prepared",
        name: "等待拍摄",
        workflow: "拍摄"
    },
    {
        id: "service_completed",
        name: "拍摄完毕",
        workflow: "拍摄"
    },
    {
        id: "service_incompleted",
        name: "拍摄未完成",
        workflow: "拍摄"
    },
    {
        id: "service_assessed",
        name: "服务评价完毕",
        workflow: "拍摄"
    },
    {
        id: "trailer_raw_uploaded",
        name: "大片预览（原片）已上传",
        workflow: "拍摄"
    },
    {
        id: "trailer_retouched_uploaded",
        name: "大片预览（精修片）已上传",
        workflow: "拍摄"
    },
    {
        id: "trailer_demo_sent",
        name: "大片预览（精修片）已发送",
        workflow: "拍摄"
    },
    {
        id: "raw_demo_uploaded",
        name: "小样已上传",
        workflow: "拍摄"
    },
    {
        id: "raw_demo_sent",
        name: "小样已发送",
        workflow: "选片"
    },
    {
        id: "raw_demo_confirmed",
        name: "客户已选片",
        workflow: "选片"
    },
    {
        id: "pp_assigned",
        name: "后期已指派",
        workflow: "后期"
    },
    {
        id: "pp_initial_retouched",
        name: "后期初修完毕",
        workflow: "后期"
    },
    {
        id: "pp_final_retouched",
        name: "后期精修完毕",
        workflow: "后期"
    },
    {
        id: "pp_layout_designed",
        name: "后期排版完毕",
        workflow: "后期"
    },
    {
        id: "pp_wait_for_confirm",
        name: "精修已发送",
        workflow: "后期"
    },
    {
        id: "pp_customer_confirmed",
        name: "客户已确认",
        workflow: "后期"
    },
    {
        id: "pp_customer_has_feedback",
        name: "客户有修改意见",
        workflow: "后期"
    },
    {
        id: "on_printing",
        name: "相册制作中",
        workflow: "制作"
    },
    {
        id: "production_completed",
        name: "等待质检",
        workflow: "制作"
    },
    {
        id: "qa_passed",
        name: "质检通过",
        workflow: "制作"
    },
    {
        id: "package_shipped",
        name: "已发货",
        workflow: "预订"
    },
    {
        id: "package_deliveried",
        name: "已签收",
        workflow: "发货"
    },
    {
        id: "package_returned",
        name: "已退货",
        workflow: "发货"
    },
    {
        id: "waiting_for_evaluation",
        name: "等待客户评价",
        workflow: "评价"
    },
    {
        id: "customer_evaluated",
        name: "客户已评价",
        workflow: "评价"
    },
    {
        id: "finished",
        name: "服务结束",
        workflow: "评价"
    },
    {
        id: "revoked",
        name: "已废弃",
        workflow: "预订"
    }]
};
module.exports = {
    states: function(r) {
        var i = r.state,
        a = r.payment_state,
        d = r.ticket.state,
        w = 0,
        n = "",
        t = [{
            workflow: "预订",
            status: "",
            active: !1
        },
        {
            workflow: "拍摄",
            status: "",
            active: !1
        },
        {
            workflow: "选片",
            status: "",
            active: !1
        },
        {
            workflow: "后期",
            status: "",
            active: !1
        },
        {
            workflow: "制作",
            status: "",
            active: !1
        },
        {
            workflow: "发货",
            status: "",
            active: !1
        },
        {
            workflow: "评价",
            status: "",
            active: !1
        }];
        if (["created", "revoked", "closed"].includes(i)) return w = 0,
        n = ["unpaid", "refund_issued", "refund_settled"].includes(a) ? e("Payment", a) : e("Order", i),
        t[w].active = !0,
        t[w].status = n.name,
        t;
        if ("finished" === i && "finished" === d) return w = 6,
        t[w].active = !0,
        t[w].status = "服务完毕",
        t;
        var f = o.Ticket.find(function(e) {
            return e.id === d
        });
        if (!f) return [];
        var l = t.find(function(e) {
            return e.workflow === f.workflow
        });
        if (l) return l.active = !0,
        l.status = f.name,
        t;
        console.error("unexpected index", i, a, d)
    }
};