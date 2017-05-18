import AV from '../../libs/av-weapp-min'
import Toast from '../../components/toast/index'
import _ from'../../libs/lodash'
import Address from '../../models/address'
import Loading from '../../components/loading/loading'
const app = getApp()

let province = null
let city = null
let area = null
let userName = ''
let phonenum = ''
let address = ''
let port = ''

const default_province = '省份'
const default_city = '城市'
const default_area = '地区'

Page(Object.assign({}, Toast, {
  data: {
    provinceNames: [],
    cityNames: [],
    areaNames: [],
    selectedProvinceName: '',
    selectedCityName: '',
    selectedAreaName: '',
  },
  onLoad: function(options) {
    //Do some initialize when page load.
    const provinceNames = _.chain(app.province).map(elem=> elem.name).value()
     this.setData({
       selectedProvinceName: default_province, 
       selectedCityName: default_city, 
       provinceNames: [default_province, ...provinceNames],
       cityNames: [default_city],
       areaNames: [default_area],
       selectedAreaName: default_area,
     })
  },
  onReady: function() {
    //Do some when page ready.

  },
  onShow: function() {
    //Do some when page show.

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
  bindPickerProvinceChange: function(e) {
    const selectIndex = e.detail.value
    this.setData({selectedProvinceName: this.data.provinceNames[selectIndex]})
    if (selectIndex !== 0) {
      this.province = app.province[selectIndex - 1]
      let cityNames = _.chain(app.city[this.province.id]).map(item => _.isEqual('市辖区', item.name) ? item.province : item.name).value()
      cityNames = [default_city, ...cityNames]
      this.setData({cityNames, selectedCityName: default_city})
    }else {
      this.province = null
      this.city = null
      this.area = null
      this.setData({selectedCityName: default_city, electedAreaName: default_area, })
    }
  },

  bindPickerCityChange(e) {
    const selectIndex = e.detail.value
    
    if (selectIndex !== 0){
      this.setData({selectedCityName: this.data.cityNames[selectIndex]})
      this.city = app.city[this.province.id][selectIndex - 1]
      let areaNames = _.chain(app.area[this.city.id]).map(item =>  item.name).value()
      areaNames = [default_area, ...areaNames]
      this.setData({areaNames, selectedAreaName: default_area})
    }else {
      console.log(selectIndex)
      this.city = null
      this.area = null
      this.setData({electedAreaName: default_area, })
    }
  },

  bindPickerAreaChange(e) {
    const selectIndex = e.detail.value
    if (selectIndex !== 0){
      this.area = app.area[this.city.id][selectIndex - 1]
      this.setData({selectedAreaName: this.data.areaNames[selectIndex]})
    }
  },

  bindSave(e) {
   // console.log(this.province, this.city, this.area, this.userName, this.phonenum, this.address, this.port)
    if (_.isEmpty(this.userName)) {
        this.showZanToast('请填写收货人名字');
        return;
    }else if (_.isEmpty(this.phonenum)) {
        this.showZanToast('请提供联系方式');
        return;
    }else if (_.isEmpty(this.province) || _.isEmpty(this.city) || _.isEmpty(this.area) || _.isEmpty(this.address)) {
        this.showZanToast('请填写地址');
        return;
    }
    Loading.show({text: '加载数据中'})
    const user = AV.User.current().toJSON();
    new Address({
      username: this.userName,
      phonenum: this.phonenum,
      province: this.province.name,
      city:  _.isEqual('市辖区',this.city.name) ? this.city.province : this.city.name,
      area: this.area.name,
      addr: this.address,
      port: this.port,
      userId: user.objectId
    }).save().then((newAddress) => {
      // console.log(address.toJSON())
        Loading.hide()
        this.showZanToast('保存成功')
        wx.navigateBack()
    }) 
  },

  bindInputName(e) {
    this.userName = e.detail.value
  },
  bindInputPhonenum(e) {
    this.phonenum = e.detail.value
  },
  bindInputAdress(e) {
    this.address = e.detail.value
  },
  bindInputPort(e) {
    this.port = e.detail.value
  },

  bindBack(e) {
    wx.navigateBack()
  }
}))