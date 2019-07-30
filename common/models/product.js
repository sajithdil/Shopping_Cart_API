'use strict';

module.exports = function(Product) {

    Product.disableRemoteMethodByName('createChangeStream');

};
