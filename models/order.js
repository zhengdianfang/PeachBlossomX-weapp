const AV = require('../libs/av-weapp-min');

const ORDER_TABLENAME = 'Order'

class Order extends AV.Object {
  get objectId() { return this.get('objectId'); }
  
  get products() { return this.get('products'); }
  set products(value) { this.set('products', value); }
  
  get userId() { return this.get('userId'); }
  set userId(value) { this.set('userId', value); }
  
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
} 
AV.Object.register(Order);

module.exports = {Order, ORDER_TABLENAME};