import AV from '../../libs/av-weapp-min'
import _  from '../../libs/lodash'
import {Address} from '../../models/address'
import {calculateFreight} from '../../utils/util'
import {Order} from '../../models/order'
import {CART_TABLENAME} from '../../models/cart'
import {ORDER_STATUS, Distributions} from '../../utils/constants'

var app = getApp()
Page({
  data: {
    order: {
      products: [],
      totalPrice: 0,
      address: {},
      freight: 0,
      distribution: 0,
    },
    inputValue: '',
    distributions: Distributions,
    selectDistribution: Distributions[0],
  },
  cartIds: [],
  onLoad: function(props) {
      wx.showLoading({
        title: '加载数据...',
      })
      const products = JSON.parse(props.products)
      this.cartIds = _.map(products, elem => elem.cartId)
      const query =  new AV.Query('Product')
      Promise.all(_.map(products, (product) => query.get(product.productId))).then(results => {
          const order = _.cloneDeep(this.data.order)
          order.address =  _.find(app.addressList, (elem) => elem.current)
          order.products = _.chain(results).map((elem) => elem.toJSON()).map((p, index) => {
              const count = products[index].count
              p.option = products[index].option
              p.price = products[index].price
              order.totalPrice += p.price * count
              return Object.assign({count}, p)
          }).value()
          order.freight = calculateFreight(order.products, order.address)
          this.setData({order})
          wx.hideLoading()
      }).catch(e => console.error(e))
 
  },
  onReady: function() {
    //Do some when page ready.

  },
  onShow: function() {
    const order = _.cloneDeep(this.data.order)
    order.address =  _.find(app.addressList, (elem) => elem.current) 
    this.setData({order})


  },
  onHide: function() {
    //Do some when page hide.

  },
  addReciverProductAddress(e) {
    wx.navigateTo({url: '../address/addressList'})
  },
  addMessage(e) {
      
  },
  setAddress(address) {
    const order = Object.assign({address}, this.data.order)
    this.setData({order})
  },
  commitOrder(e) {
     wx.showLoading({
       title: '正在生成订单...',
     })
     const order = _.cloneDeep(this.data.order)
     _.each(order.products, elem => {
       elem.images = [_.head(elem.images)]
       delete elem.description
       delete elem.createAt
       delete elem.updatedAt
       delete elem.top
     })
     order.user = AV.User.current()
     order.message = this.data.inputValue
     order.status = ORDER_STATUS.WILL_PAY
     new Order(order).save().then(res => {
       const order = res.toJSON()
       //清空购物车
       AV.Object.destroyAll(_.map(this.cartIds, elem => {
         return AV.Object.createWithoutData(CART_TABLENAME, elem)
       }))
       wx.redirectTo({url: './orderDetail?orderId=' + order.objectId})
       wx.hideLoading()
     })
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindPickerDistributionsChange(e) {
    const selectIndex = e.detail.value
    const order = _.cloneDeep(this.data.order)
    order.distribution = parseInt(selectIndex)
    this.setData({selectDistribution: Distributions[selectIndex], order})
  }
})
