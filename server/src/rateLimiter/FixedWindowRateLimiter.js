 export default class FixedWindowRateLimiter {
    constructor(storage, limit = 10, windowMs = 10000){
        this.storage = storage;
        this.limit = limit;
        this.windowMs = windowMs;
    }

    allow(ip){
        if(!this.storage.has(ip)){
            const user =  this.createWindow(ip);
             this.consumeRequest(user);
             return true;
        }

        const user = this.storage.get(ip); 



        if(this.isWindowExpired(user)){
           const user =  this.resetWindow(ip);
           this.consumeRequest(user);
           return true;
        }

        if(!this.isRequestAllowed(user)){
            return false;
        }

  

        this.consumeRequest(user);

        return true;


    }

      createWindow(ip) {
        this.storage.set(ip, {remainingRequests : this.limit, windowStartedAt : Date.now()});
        return this.storage.get(ip);
      }

    resetWindow(ip) {
        return this.createWindow(ip);
    }

    consumeRequest(user) {
        user.remainingRequests--;
    }

    isWindowExpired(user) {
       return Date.now() - user.windowStartedAt >= this.windowMs;
    }

    isRequestAllowed(user) {
        return user.remainingRequests > 0;
    }

}