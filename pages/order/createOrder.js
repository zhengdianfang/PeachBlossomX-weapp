import AV from '../../libs/av-weapp-min'
import _  from '../../libs/lodash'
import Address from '../../models/address'
import Loading from '../../components/loading/loading'
import {calculateFreight} from '../../utils/util'
import {Order} from '../../models/order'
import {CART_TABLENAME} from '../../models/cart'
import {ORDER_STATUS} from '../../utils/constants'

var app = getApp()
Page({
  data: {
    order: {
      products: [],
      totalPrice: 0,
      address: {},
      freight: 0,
    },
  },
  cartIds: [],
  onLoad: function(props) {
      Loading.show({text: '加载数据...'})
      const products = JSON.parse(props.products)
      this.cartIds = _.map(products, elem => elem.cartId)
      const query =  new AV.Query('Product')
      Promise.all(_.map(products, (product) => query.get(product.productId))).then(results => {
          const order = _.cloneDeep(this.data.order)
          order.address =  _.find(app.addressList, (elem) => elem.current)
          order.products = _.chain(results).map((elem) => elem.toJSON()).map((p, index) => {
              const count = products[index].count
              p.flavor = products[index].flavor
              order.totalPrice += p.price * count
              return Object.assign({count}, p)
          }).value()
          order.freight = calculateFreight(order.products, order.address)
          this.setData({order})
          Loading.hide()
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
     Loading.show({text: '正在生成订单...'})
     const order = _.cloneDeep(this.data.order)
     _.each(order.products, elem => {
       elem.images = [_.head(elem.images)]
       delete elem.description
       delete elem.createAt
       delete elem.updatedAt
       delete elem.top
     })
     const user = AV.User.current().toJSON()
     order.userId = user.objectId
     order.status = ORDER_STATUS.WILL_PAY
     new Order(order).save().then(res => {
       const order = res.toJSON()
       //清空购物车
       AV.Object.destroyAll(_.map(this.cartIds, elem => {
         return AV.Object.createWithoutData(CART_TABLENAME, elem)
       }))
       wx.redirectTo({url: './orderDetail?orderId=' + order.objectId})
       Loading.hide()
     })
  }
 
})
