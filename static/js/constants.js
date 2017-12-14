/**
 * Created by zhouxin on 2017/8/8.
 */

const GLOBAL = {
  NAME:"六六脑<sup>&#174;</sup>脑康复云",
  API: "/api/",
  ORDER:  "/api/v2/order/",
  PAYURL: "/api/v2/pay/",
  cognition: '',
  selectOption: {
    gender: {
      options: [
        {id: 2, text: '男'},
        {id: 1, text: '女'},
        {id: 9, text: '其他'}
      ],
      flag: 'gender',
      name: '性别'
    },
    edus: {
      options: [
        {id: 1, text: '文盲'},
        {id: 2, text: '小学'},
        {id: 3, text: '初中'},
        {id: 4, text: '高中'},
        {id: 5, text: '专科'},
        {id: 6, text: '本科及以上'}
      ],
      flag: 'edus',
      name: '教育程度'
    },
    hands: {
      options: [
        {id: 1, text: '左利手'},
        {id: 2, text: '右利手'},
        {id: 3, text: '双利手'}
      ],
      flag: 'hands',
      name: '利手'
    },
    marry: {
      options: [
        {id: 0, text: '请选择'},
        {id: 1, text: '未婚'},
        {id: 2, text: '已婚'},
        {id: 3, text: '离异'},
        {id: 4, text: '丧偶'}
      ],
      flag: 'marry',
      name: '婚姻状态'
    },
    // 现居住地
    place: {
      options: [
        {id: 0, text: '请选择'},
        {id: 1, text: '农村'},
        {id: 2, text: '城镇'}
      ],
      flag: 'place',
      name: '居住地'
    },
    // 设置天数
    days: {
      options: [
        {id: 0, text: '15'},
        {id: 1, text: '30'},
        {id: 2, text: '45'},
        {id: 3, text: '60'},
        {id: 4, text: '75'},
        {id: 5, text: '90'}
      ],
      flag: 'days',
      name: '设置天数'
    },
    pay: {
      options: [
        {id: "UNPAID", text: '待支付'},
        {id: "PAID", text: '已付款'},
        // {id: "PAY_COMPLETED", text: '支付已完成,订单有效期已添加'},
        {id: "USER_CANCLE", text: '已取消'},
        // {id: "FINISHED", text: '支付回调已完成，订单无法退款'},
        // {id: "PAY_EXPIER", text: '已取消'},
        // {id: "REFUNDS", text: '支付退款完成'},
        // {id: "NO_NEED_PAY", text: '试用产品无需支付'},
        {id: "END_OF_ORDER_USE", text: '已完成'},
        // {id: "ORDER_FREEZE", text: '试用产品冻结'},
        // {id: "USER_PAY_FAILED", text: '用户支付失败'}
      ],
      flag: 'pay',
      name: '支付状态'
    }
  }

};
