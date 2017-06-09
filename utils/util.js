import _ from '../libs/lodash'

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const N9City = ['甘孜藏族自治州', '凉山彝族自治州']//1KG内9元 ，每增加1KG加6元
const N9Province = ['海南省', '青海省', '吉林省', '辽宁省', '黑龙江省'] //1KG内9元 ，每增加1KG加6元
const N12Province = ['新疆维吾尔自治区新疆', '内蒙古自治区', '西藏自治区'] //1KG内12元 ，每增加1KG加9元
const free_balance = 120
/**川内 1KG内7元 ，每增加1KG加3元
 * 川外 1KG内7元 ，每增加1KG加3元
 */

function freightByWeight(weight, p1, p2){
  if (weight <= 1000) {
    return p1
  }
  const m = Math.ceil(weight / 1000)
  return p1 + p2 * (m - 1)
}


function calculateFreight(products, address) {
  let freight = 0
  if (!_.isEmpty(products) && !_.isEmpty(address)) {
     
      let totalPrice = 0
      _.each(products, elem => {
        totalPrice += (elem.price * elem.count)
      })
      //满168元免运费
      let totalWeight = 0
      if (totalPrice < free_balance) {
        _.each(products, elem => {
          totalWeight += (elem.weight * elem.count)
        })
        //四川内
        if (_.isEqual(address.province, '四川省')) {
          freight = freightByWeight(totalWeight, 7, 3)
          if (_.includes(N9City, address.city)) {
            freight = freightByWeight(totalWeight, 9, 6)
          }
        }else {
          freight = freightByWeight(totalWeight, 7, 3)
          if (_.includes(N9Province, address.province)) {
            freight = freightByWeight(totalWeight, 9, 6)
          }
          if (_.includes(N12Province, address.province)) {
            freight = freightByWeight(totalWeight, 12, 9)
          }
        }
      }
  }
  
  return freight
}

function parseShowPriceString(priceArray) {
  const uniqArray = _.sortedUniq(_.cloneDeep(priceArray));
  if (uniqArray.length == 1) {
    return `${uniqArray[0]}`
  }
  return `${uniqArray[0]} - ${uniqArray[uniqArray.length - 1]}`
}

module.exports = {
  formatTime,
  calculateFreight,
  parseShowPriceString
}


