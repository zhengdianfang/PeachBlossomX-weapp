const AV = require('../libs/av-weapp-min');

const CART_TABLENAME = 'Cart'

class Cart extends AV.Object {
  get objectId() { return this.get('objectId'); }
  
  get count() { return this.get('count'); }
  set count(value) { this.set('count', value); }
  
  get productId() { return this.get('productId'); }
  set productId(value) { this.set('productId', value); }
  
  get productTitle() { return this.get('productTitle'); }
  set productTitle(value) { this.set('productTitle', value); }
  
  get productPrice() { return this.get('productPrice'); }
  set productPrice(value) { this.set('productPrice', value); }
  
  get productImage() { return this.get('productImage'); }
  set productImage(value) { this.set('productImage', value); }

  get user() { return this.get('user'); }
  set user(value) { this.set('user', value); }
} 
AV.Object.register(Cart);

module.exports = {Cart, CART_TABLENAME};