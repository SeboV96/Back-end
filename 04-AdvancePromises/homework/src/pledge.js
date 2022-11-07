'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise (executor) {
    if (typeof executor !== 'function') throw new TypeError('executor is not a function')

    this._handlerGroups = []

    this._state = 'pending'
executor(this._internalResolve.bind(this), this._internalReject.bind(this)) // se lo bindea por que sino no se sabe a donde apunta el this
// tmb puede ser executor(() => _internalResolve, () => _internalRejected)
}

$Promise.prototype._internalResolve = function (value) {
    if (this._state === 'pending'){
        this._state = 'fulfilled'
        this._value = value
        this._callHandlers()
    }
}

$Promise.prototype._internalReject = function (value) {
    if (this._state === 'pending'){

        this._state = 'rejected'

        this._value = value

        this._callHandlers()
    }
}

$Promise.prototype.then = function (successCb, errorCb){
    if (typeof successCb !== 'function' ) successCb = false

    if (typeof errorCb !== 'function') errorCb = false

    const downstreamPromise = new $Promise(function (){})

    this._handlerGroups.push({successCb, errorCb, downstreamPromise})

    if (this._state !== 'pending') this._callHandlers()

    return downstreamPromise
}

$Promise.prototype._callHandlers = function() {
    while(this._handlerGroups.length > 0){

        let current = this._handlerGroups.shift()

        if(this._state === 'fulfilled'){

            if(!current.successCb){

                current.downstreamPromise._internalResolve(this._value)

            }else {

                try{

                    const result = current.successCb(this._value)

                    if(result instanceof $Promise){

                        result.then(value => current.downstreamPromise._internalResolve(value), 

                        err => current.downstreamPromise._internalReject(err))

                    }else {
                        current.downstreamPromise._internalResolve(result)

                    }
                } catch (e) {

                 current.downstreamPromise._internalReject(e)

                }
                } 
              
         // current.successCb && current.successCb(this._value)
        } else if (this._state === 'rejected'){

          if (!current.errorCb){

            current.downstreamPromise._internalReject(this._value)

          }else{

            try{

                const result = current.errorCb(this._value)

                if (result instanceof $Promise){

                    result.then(value => current.downstreamPromise._internalResolve(value), 

                    err => current.downstreamPromise._internalReject(err))

                } else {

                    current.downstreamPromise._internalResolve(result)

                }

            }catch(e){

                     current.downstreamPromise._internalReject(e)
                     
            }
          }
        }
    }
}

$Promise.prototype.catch = function(errorCb) {
    return this.then(null, errorCb)
}

//module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
