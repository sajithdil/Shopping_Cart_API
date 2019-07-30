'use strict';

module.exports = function(Cart) {
    Cart.disableRemoteMethodByName('patchOrCreate');
    Cart.disableRemoteMethodByName('createChangeStream');
    Cart.disableRemoteMethod('__create__products',false);
    Cart.disableRemoteMethod('__delete__products',false);
    Cart.disableRemoteMethod('__updateById__products',false);
    Cart.disableRemoteMethod('__delete__products',false);
    Cart.disableRemoteMethod('__destroyById__products',false);
    //Cart.disableRemoteMethod('__get__carts',false);
    //Cart.disableRemoteMethod('__get__carts__products',false);
    //Cart.disableRemoteMethod('__exists__carts',false);
    Cart.disableRemoteMethod('__updateById__carts',false);
    Cart.disableRemoteMethod('__delete__carts',false);
    Cart.disableRemoteMethod('__destroyById__carts',false);
    Cart.disableRemoteMethod('__updateById__carts',false);

    Cart.disableRemoteMethod('__exists__products',false);
    //Cart.disableRemoteMethod('__exist__products',false);
    Cart.disableRemoteMethod('__updateById__products',false);
    Cart.disableRemoteMethod('__delete__products',false);
    Cart.disableRemoteMethod('__destroyById__products',false);
    Cart.disableRemoteMethod('__updateById__products',false);
    Cart.disableRemoteMethod('__link__products',false);
    Cart.disableRemoteMethod('__unlink__products',false);
    Cart.disableRemoteMethod('__exists__products__rel',false);

    //Cart.disableRemoteMethod('__get__carts__products__carts',false);

    //Cart.disableRemoteMethod('__get__products',false);
    //Cart.disableRemoteMethod('__get__product',false);
    //Cart.disableRemoteMethod('__get__carts',false);
    //Cart.disableRemoteMethod('__count__products',false);

    Cart.disableRemoteMethod('__exists__carts__products',false);
    Cart.disableRemoteMethod('__updateById__carts__products',false);
    Cart.disableRemoteMethod('__delete__carts__products',false);
    Cart.disableRemoteMethod('__destroyById__carts__products',false);

    //Cart.disableRemoteMethod('__get__products',false);
    Cart.disableRemoteMethod('__exists__products__carts',false);
    Cart.disableRemoteMethod('__exists__products__carts__rel',false);
    Cart.disableRemoteMethod('__link__products__carts',false);
    Cart.disableRemoteMethod('__unlink__products__carts',false);
    Cart.disableRemoteMethod('__get__products__carts',false);
    Cart.disableRemoteMethod('__get__products__carts__',false);
    Cart.disableRemoteMethod('__create__products__carts',false);
    Cart.disableRemoteMethod('__delete__products__carts',false);
    Cart.disableRemoteMethod('__destroyById__products__carts',false);
    Cart.disableRemoteMethod('__updateById__products__carts',false);
    Cart.disableRemoteMethod('__count__products__carts',false);

    Cart.addItemToCart = function(data,res) {
        //console.log(data);
        //console.log(res);
        Cart.findOne({where:{id:data.CartId}},function(err,cart){
            if (err || !cart) {
                console.log('Something went wrong: '+ err)
                var error = new Error();
                error.status = 500;
                error.message = "Could not find Cart"
                res(error);
              } else {
                // do something with the user object
                Cart.app.models.Product.findOne({where:{id:data.ProductId}},function(err,product){
                    if (err || !product) {
                        console.log('Something went wrong: '+ err)
                        var error = new Error();
                        error.status = 500;
                        error.message = "Could not find Product"
                        res(error);
                      } else {
                        console.log("came to found product");
                        Cart.app.models.CartItem.findOne({where:{cartId:data.CartId,productId:data.ProductId}},function(err,cartitem){
                            //console.log(err);
                            if (err || !cartitem) {
                                console.log("came to could not find cart item");
                                Cart.app.models.CartItem.create({cartId:data.CartId,productId:data.ProductId,quantity:data.Quantity,UnitPrice:product.Price},function(err,resp){
                                    //res(null,{status:"success"});
                                    if (err || !resp) {
                                        console.log('Something went wrong: '+ err)
                                        var error = new Error();
                                        error.status = 500;
                                        error.message = "Could not create cart item"
                                        res(error);
                                      } else {
                                          console.log("cart.total: " + cart.total);
                                          console.log("product.Price: " + product.Price);
                                          console.log("data.Quantity: " + data.Quantity);
                                          var tot = (product.Price*data.Quantity).toFixed(2);
                                          console.log("tot: " + tot);
                                        cart.total += tot;
                                        cart.save({},function(err,done){
                                            if (err || !done) {
                                                console.log('Something went wrong: '+ err)
                                                var error = new Error();
                                                error.status = 500;
                                                error.message = "Could not save cart"
                                                res(error);
                                            }
                                            else
                                            {
                                                res(null,{status:"Item Added to Cart"});
                                            }
                                        
                                        });
                                    }
                                })
                            }
                            else
                            {
                                console.log("came to found cart item");
                                cartitem.quantity += data.Quantity;
                                //res(null,{status:"success"});
                                cartitem.save({},function(err,doneit){
                                    if (err || !doneit) {
                                        console.log('Something went wrong: '+ err)
                                        var error = new Error();
                                        error.status = 500;
                                        error.message = "Could not save cart item"
                                        res(error);
                                    }
                                    else
                                    {
                                        Cart.app.models.CartItem.find({where:{cartId:data.CartId}},function(err,itemList){
                                            var total = 0;
                                            for(var i =0;i<itemList.length;i++)
                                            {
                                                total+= (itemList[i].UnitPrice*itemList[i].quantity).toFixed(2);
                                            }

                                            cart.total = total;

                                            cart.save({},function(err,done){
                                                if (err || !done) {
                                                    console.log('Something went wrong: '+ err)
                                                    var error = new Error();
                                                    error.status = 500;
                                                    error.message = "Could not save cart"
                                                    res(error);
                                                }
                                                else
                                                {
                                                    console.log("cart saved");
                                                    res(null,{status:"Item Added to Cart"});
                                                }
                                            
                                            });
                                        })
                                        
                                    }
                                
                                });
                            }
                        })
                        
                    }
                })
                
            }
        })
        
    }

    Cart.removeItemFromCart = function(data,res) {
        //console.log(data);
        //console.log(res);
        Cart.findOne({where:{id:data.CartId}},function(err,cart){
            if (err || !cart) {
                console.log('Something went wrong: '+ err)
                var error = new Error();
                error.status = 500;
                error.message = "Could not find Cart"
                res(error);
              } else {
                // do something with the user object
                Cart.app.models.Product.findOne({where:{id:data.ProductId}},function(err,product){
                    if (err || !product) {
                        console.log('Something went wrong: '+ err)
                        var error = new Error();
                        error.status = 500;
                        error.message = "Could not find Product"
                        res(error);
                      } else {
                        console.log("came to found product");
                        Cart.app.models.CartItem.findOne({where:{cartId:data.CartId,productId:data.ProductId}},function(err,cartitem){
                            //console.log(err);
                            if (err || !cartitem) {
                                // console.log("came to could not find cart item");
                                
                                // console.log('Something went wrong: '+ err)
                                // var error = new Error();
                                // error.status = 500;
                                // error.message = "Could not find Cart Item"
                                // res(error);

                                Cart.app.models.CartItem.find({where:{cartId:data.CartId}},function(err,itemList){
                                    var total = 0;;
                                    console.log("itemList: " + itemList);
                                    for(var i =0;i<itemList.length;i++)
                                    {
                                        total+= (itemList[i].UnitPrice*itemList[i].quantity).toFixed(2);
                                    }
                                    console.log("total: " + total);
                                    cart.total = total;

                                    cart.save({},function(err,done){
                                        if (err || !done) {
                                            console.log('Something went wrong: '+ err)
                                            var error = new Error();
                                            error.status = 500;
                                            error.message = "Could not removed item from cart"
                                            res(error);
                                        }
                                        else
                                        {
                                            console.log("cart removed");
                                            res(null,{status:"Item removed from Cart"});
                                        }
                                    
                                    });
                                })
                            }
                            else
                            {
                                console.log("came to found cart item");
                                cartitem.quantity -= data.Quantity;
                                if(cartitem.quantity>0){
                                    cartitem.save({},function(err,doneit){
                                        if (err || !doneit) {
                                            console.log('Something went wrong: '+ err)
                                            var error = new Error();
                                            error.status = 500;
                                            error.message = "Could not save cart item"
                                            res(error);
                                        }
                                        else
                                        {
                                            Cart.app.models.CartItem.find({where:{cartId:data.CartId}},function(err,itemList){
                                                var total = 0;
                                                for(var i =0;i<itemList.length;i++)
                                                {
                                                    total+= (itemList[i].UnitPrice*itemList[i].quantity).toFixed(2);
                                                }
    
                                                cart.total = total;
    
                                                cart.save({},function(err,done){
                                                    if (err || !done) {
                                                        console.log('Something went wrong: '+ err)
                                                        var error = new Error();
                                                        error.status = 500;
                                                        error.message = "Could not removed item from cart"
                                                        res(error);
                                                    }
                                                    else
                                                    {
                                                        console.log("cart saved");
                                                        res(null,{status:"Item removed from Cart"});
                                                    }
                                                
                                                });
                                            })
                                            
                                        }
                                    
                                    });
                                }
                                else
                                {
                                    cartitem.destroy(function(err,destroyed){
                                        if (err || !destroyed) {
                                            console.log('Something went wrong: '+ err)
                                            var error = new Error();
                                            error.status = 500;
                                            error.message = "Could not removed item from cart"
                                            res(error);
                                        }
                                        else
                                        {
                                            Cart.app.models.CartItem.find({where:{cartId:data.CartId}},function(err,itemList){
                                                var total = 0;
                                                for(var i =0;i<itemList.length;i++)
                                                {
                                                    total+= (itemList[i].UnitPrice*itemList[i].quantity).toFixed(2);
                                                }
    
                                                cart.total = total;
    
                                                cart.save({},function(err,done){
                                                    if (err || !done) {
                                                        console.log('Something went wrong: '+ err)
                                                        var error = new Error();
                                                        error.status = 500;
                                                        error.message = "Could not removed item from cart"
                                                        res(error);
                                                    }
                                                    else
                                                    {
                                                        console.log("cart removed item");
                                                        res(null,{status:"Item removed from Cart"});
                                                    }
                                                
                                                });
                                            })

                                            
                                        }
                                    })
                                }
                                //res(null,{status:"success"});
                                
                            }
                        })
                        
                    }
                })
                
            }
        })
        
    }

    Cart.remoteMethod('addItemToCart', {
          description: "Function which adds items to cart",
          accepts: {arg: 'data', type:'CartItemData', required:true,http: {source: 'body'}},
          returns: {arg: 'response', type: 'object'},
          http: {path: '/addItemToCart', verb: 'post'}
    });

    Cart.remoteMethod('removeItemFromCart', {
        description: "Function which adds items to cart",
        accepts: {arg: 'data', type:'CartItemData', required:true,http: {source: 'body'}},
        returns: {arg: 'response', type: 'object'},
        http: {path: '/removeItemFromCart', verb: 'post'}
  });
};