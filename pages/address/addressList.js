import AV from '../../libs/av-weapp-min'
import {Address, ADDRESS_TABLENAME} from '../../models/address'
import _ from '../../libs/lodash.js'

const app = getApp()

Page({
  data: {
    addressList: []
  },
  onLoad: function(options) {
    //Do some initialize when page load.
   this.setData({addressList: app.addressList})
 
  },
  onReady: function() {
    //Do some when page ready.

  },
  onShow: function() {
    //Do some when page show.
    const user = AV.User.current().toJSON()
    new AV.Query(ADDRESS_TABLENAME)
        .equalTo('userId', user.objectId)
        .descending('current')
        .find()
        .then((res) => {
            const addressList = _.map(res, elem => elem.toJSON())
            this.setData({addressList})
        }).catch(e => console.error(e));
  },
  onHide: function() {
    //Do some when page hide.

  },
  onUnload: function() {
    //Do some when page unload.

  },
  onPullDownRefresh: function() {
    //Do some when page pull down.

  },
  radioChange(e) {
    const selectId = e.detail.value
    _.each(app.addressList, (elem) => {
        var address = AV.Object.createWithoutData(ADDRESS_TABLENAME, elem.objectId);
        address.set('current', elem.objectId === selectId);
        elem.current = elem.objectId === selectId
        address.save();
    })
    this.setData({addressList: app.addressList})

  },
  createNewAddress(e) {
    wx.navigateTo({url: '../address/createAddress'})
  }

})