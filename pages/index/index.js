//index.js
//获取应用实例
import AV from '../../libs/av-weapp-min'
import _  from '../../libs/lodash'
import Loading from '../../components/loading/loading'
Page({
  data: {
    products: [],
    tops: []
  },
  onReady: function () {
  
  },
  onLoad: function () {
    Loading.show({text: '加载数据...'})
    this.requestProducts()
   
  },
  onClickProductItem: function(event) {
    const product = event.currentTarget.dataset.product
    wx.navigateTo({ url: '../product/index?id=' + product.objectId})
  },
   onPullDownRefresh: function() {
    //Do some when page pull down.
    this.requestProducts()
  },

  requestProducts() {
    new AV.Query('Product')
      .find()
      .then(array => {
        const products = _.map(array, (elem) => elem.toJSON())
        const tops = _.filter(products, (elem) => elem.top)
        this.setData({ tops, products })
        Loading.hide()
      })
      .catch((error) => {
        console.error(error)
        this.setData({error})
      })
  }
})
