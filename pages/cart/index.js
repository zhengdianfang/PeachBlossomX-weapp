//index.js
//获取应用实例
import AV from'../../libs/av-weapp-min'
import {Cart, CART_TABLENAME} from '../../models/cart'
import _ from '../../libs/lodash'
import Quantity from '../../components/quantity/index.js'
import Loading from '../../components/loading/loading'

var app = getApp()
let selectIds = []
Page(Object.assign({}, Quantity,{
  data: {
    cartList: [],
    editable: false,
    quantitys: {},
  },
  onReady: function () {
  
  },
  onLoad: function () {
  },
  onShow: function() {
    Loading.show({text: '加载数据中'})
    const quantitys = {}
    new AV.Query(CART_TABLENAME)
      .equalTo('user', AV.User.current())
      .descending('createAt')
      .find()
      .then((res) => {
        const cartList = _.map(res, (i) => {
          const cart = i.toJSON()
          quantitys[cart.objectId] = {
              quantity: cart.count,
              min: 1,
              max: 20
          }
          return cart
        })
        this.calTotalPrice(cartList)
        this.selectIds = _.map(cartList, elem => elem.objectId)
        this.setData({cartList, quantitys})
        Loading.hide()
      }).catch(e => console.error(e))
  },
  onHide: function() {
    this.setData({editable: false})
  },
  checkboxChange(e) {
    this.selectIds = e.detail.value
    const findArray = _.filter(this.data.cartList, (elem) => _.includes(this.selectIds, elem.objectId))
    this.calTotalPrice(findArray)
   
  },
  calTotalPrice(array) {
    let totalPrice = 0
    _.each(array, (elem) => totalPrice += (elem.productPrice * elem.count))
    this.setData({totalPrice})
  },
  toggleEdit(e) {
    const editable = !this.data.editable
    this.setData({editable})
    if (!editable) {
      this.calTotalPrice(this.data.cartList)
      AV.Object.saveAll(_.map(this.data.cartList, (elem) => {
         var cart = AV.Object.createWithoutData(CART_TABLENAME, elem.objectId);
         cart.set('count', elem.count)
         return cart
      }))
    }
  },
  handleZanQuantityChange(e) {
    // 如果页面有多个Quantity组件，则通过唯一componentId进行索引
    var compoenntId = e.componentId;
    var quantity = e.quantity;
    const quantitys = _.cloneDeep(this.data.quantitys)
    quantitys[compoenntId].quantity = quantity
    const cartList = _.cloneDeep(this.data.cartList)
    const cart = _.find(cartList, (elem) => _.isEqual(elem.objectId, compoenntId))
    if (cart) {
      cart.count = quantity
    }
    this.setData({
      quantitys,
      cartList
    });
  },

  deleteCart(e) {
    let cartList = _.cloneDeep(this.data.cartList)
    const willDeleteCart = _.find(cartList, (elem) => _.isEqual(elem.objectId, e.currentTarget.dataset.cartid))
    if(willDeleteCart) {
       AV.Object.createWithoutData('Cart', willDeleteCart.objectId).destroy().then((res) => {
           cartList.pop(willDeleteCart)
           this.calTotalPrice(cartList)
           this.setData({cartList})
       })
    }
  },
  createOrder(e) {
    const param = _.chain(this.data.cartList).filter((elem) => _.includes(this.selectIds, elem.objectId)).map((elem) => {
      return {cartId: elem.objectId, productId: elem.productId, count: elem.count, flavor: elem.productFlavor}
    }).value()
    wx.navigateTo({ url: '../order/createOrder?products=' + JSON.stringify(param)})
  },
  goMaimai() {
    wx.switchTab({url: '../index/index'})
  }
}))
