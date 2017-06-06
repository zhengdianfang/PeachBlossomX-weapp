const ORDER_STATUS = {
    WILL_PAY : 0,
    WILL_SNED : 1,
    WILL_RECIVER : 2,
    WILL_FINFISH : 3,
    CLOSED: 4,

}

const ORDER_STATUS_STRING = ['待支付', '待发货', '确认收货', '已完成', '交易关闭']

const Distributions = ['快递', '无需物流']

module.exports = {
 ORDER_STATUS,
 ORDER_STATUS_STRING,
 Distributions
}