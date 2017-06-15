//app.js
//init leancloud sdk
import AV from './libs/av-weapp-min'
import Address from './models/address'
import _ from './libs/lodash'

AV.init({
  appId: 'oa82IgTxTxiTSuuxGABIbnKp-gzGzoHsz',
  appKey: 'cajEUrQdnfUI1Ki7jw2fQddw',
});

const WX_APPID = 'wxb3a86a78386e955c'
const WX_APPSECRET = 'ae66ee86653e31156eeccb9f6e9247dc'

App({
  province :require('./utils/regions/province').province,
  city: require('./utils/regions/city').city,
  area: require('./utils/regions/area').area,
  addressList: [],

  onLaunch: function(options) {
    this.getLoginUser()
  },

  getLoginUser() {
    const user = AV.User.current()
    AV.User.loginWithWeapp().then(user => {
            wx.getUserInfo({
            success: ({userInfo}) => {
              // 更新当前用户的信息
              user.set(userInfo).save().then(user => {
              }).catch(console.error)
            }
          });
      }).catch(console.error);
     return user.toJSON()
  },
 })