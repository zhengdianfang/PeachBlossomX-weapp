import AV from'../../libs/av-weapp-min'
import _ from'../../libs/lodash'
import Quantity from '../../components/quantity/index.js'
import {Cart, CART_TABLENAME} from '../../models/cart'
import Toast from '../../components/toast/index'
import Loading from '../../components/loading/loading'

let productId = ''
Page(Object.assign({}, Quantity, Toast,{
  data: {
    showDialog: false,
    product: {},
    quantity: {
      quantity: 1,
      min: 1,
      max: 20
    },
    isJustPay: false,
    selectFlavor: '',
    isLoading: true,
  },
  onReady: function () {
   
  },
  onPullDownRefresh: function() {
    //Do some when page pull down.
     new AV.Query('Product')
      .get(this.productId)
      .then(res => {
        const product = res.toJSON()
        const selectFlavor = _.head(product.flavor)
        this.setData({
          product,
          quantity: { quantity: 1, min: 1,max: product.repertory - 1},
          selectFlavor,
          isLoading: false,
        })
        Loading.hide()
      })
      .catch(console.error);
  },
  onLoad: function (props) {
     Loading.show({text: '加载数据...'})
     this.productId = props.id
      this.setData({isLoading: true})
     this.onPullDownRefresh()
  },
 
  toggleDialog(e) {
    this.setData({
      showDialog: !this.data.showDialog,
      isJustPay: e.currentTarget.dataset.isjustpay
    });
  },
  handleZanQuantityChange(e) {
    // 如果页面有多个Quantity组件，则通过唯一componentId进行索引
    var compoenntId = e.componentId;
    var quantity = e.quantity;

    this.setData({
      'quantity.quantity': quantity
    });
  },
  createOrder(e) {
    const quantity =  this.data.quantity.quantity
    const product = this.data.product
    const param = [{productId:  product.objectId, count: quantity, flavor: this.data.selectFlavor}]
    this.setData({showDialog: false})
    wx.navigateTo({ url: '../order/createOrder?products=' + JSON.stringify(param)})
  },

  addToCart(e) {
    Loading.show({text: '添加中...'})
    const product = this.data.product
    new Cart({
      count:  this.data.quantity.quantity,
      productTitle: product.title,
      productPrice: product.price,
      productImage: _.head(product.images),
      productId: product.objectId,
      productFlavor: this.data.selectFlavor,
      user: AV.User.current()
    }).save().then((res) => {
       this.showZanToast('添加成功')
       Loading.hide()
       this.setData({showDialog: false})
    })
  },

  bindWrapGroupChildrenClick(e) {
    const selectFlavor = e.currentTarget.dataset.text
    this.setData({selectFlavor})
  },
  openCart() {
    wx.switchTab({url : '../cart/index'})
  }
}))
