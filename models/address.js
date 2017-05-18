const AV = require('../libs/av-weapp-min');

class Address extends AV.Object {
  get objectId() { return this.get('objectId'); }
  
  get username() { return this.get('username'); }
  set username(value) { this.set('username', value); }
  
  get phonenum() { return this.get('phonenum'); }
  set phonenum(value) { this.set('phonenum', value); }
  
  get province() { return this.get('province'); }
  set province(value) { this.set('province', value); }
  
  get city() { return this.get('city'); }
  set city(value) { this.set('city', value); }
  
  get area() { return this.get('area'); }
  set area(value) { this.set('area', value); }
  
  get addr() { return this.get('addr'); }
  set addr(value) { this.set('addr', value); }

  get port() { return this.get('port'); }
  set port(value) { this.set('port', value); }
  
  get userId() { return this.get('userId'); }
  set userId(value) { this.set('userId', value); }
} 
AV.Object.register(Address);

module.exports = Address;