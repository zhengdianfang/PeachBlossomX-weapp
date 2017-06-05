const AV = require('../libs/av-weapp-min');

const ORDER_TABLENAME = 'Order'

class Order extends AV.Object {
  get objectId() { return this.get('objectId'); }
  
  get products() { return this.get('products'); }
  set products(value) { this.set('products', value); }
  
  get user() { return this.get('user'); }
  set user(value) { this.set('user', value); }
  
  get status() { return this.get('status'); }
  set status(value) { this.set('status', value); }
  
  get address() { return this.get('address'); }
  set address(value) { this.set('address', value); }
  
  get freight() { return this.get('freight'); }
  set freight(value) { this.set('freight', value); }

  get price() { return this.get('price'); }
  set price(value) { this.set('price', value); }

  get message() { return this.get('message'); }
  set message(value) { this.set('message', value); }

  get tradeId() { return this.get('tradeId'); }
  set tradeId(value) { this.set('tradeId', value); }

  get amount() { return this.get('amount'); }
  set amount(value) { this.set('amount', value); }

  get productDescription() { return this.get('productDescription'); }
  set productDescription(value) { this.set('productDescription', value); }

  get ip() { return this.get('ip'); }
  set ip(value) { this.set('ip', value); }
  
  get tradeType() { return this.get('tradeType'); }
  set tradeType(value) { this.set('tradeType', value); }

  get prepayId() { return this.get('prepayId'); }
  set prepayId(value) { this.set('prepayId', value); }

  get payErrorCode() { return this.get('payErrorCode'); }
  set payErrorCode(value) { this.set('payErrorCode', value); }

  get payErrorCodeDes() { return this.get('payErrorCodeDes'); }
  set payErrorCodeDes(value) { this.set('payErrorCodeDes', value); }

  get paidAt() { return this.get('paidAt'); }
  set paidAt(value) { this.set('paidAt', value); }

  get transactionId() { return this.get('transactionId'); }
  set transactionId(value) { this.set('transactionId', value); }

  get bankType() { return this.get('bankType'); }
  set bankType(value) { this.set('bankType', value); }
} 
AV.Object.register(Order);

module.exports = {Order, ORDER_TABLENAME};