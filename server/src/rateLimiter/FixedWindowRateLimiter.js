 export default class FixedWindowRateLimiter {
    constructor(storage, limit = 10, windowMs = 10000){
        this.storage = storage;
        this.limit = limit;
        this.windowMs = windowMs;
    }

    allow(ip){
        if(!this.storage.has(ip)){
            let user =  this.createWindow(ip);
            return this.consumeRequest(user);
        }

        const user = this.storage.get(ip); 



        if(this.isWindowExpired(user)){
           let user =  this.resetWindow(ip);
           return this.consumeRequest(user);
        }

        if(!this.isRequestAllowed(user)){
            return false;
        }

  

        return this.consumeRequest(user);


    }

      createWindow(ip) {
        this.storage.set(ip, {remainingRequests : this.limit, windowStartedAt : Date.now()});
        return this.storage.get(ip);
      }

    resetWindow(ip) {
        return this.createWindow(ip);
    }

    consumeRequest(user) {
        console.log("Consumeer", user);
        user.remainingRequests--;
        return true;
    }

    isWindowExpired(user) {
       return Date.now() - user.windowStartedAt >= this.windowMs;
    }

    isRequestAllowed(user) {
        return user.remainingRequests > 0;
    }

}