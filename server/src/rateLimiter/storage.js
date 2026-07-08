export default class MemoryStorage {
     requests
    constructor(){
        this.requests = new Map();
    }

    has(key){
        return this.requests.has(key);
    }

    get(key){
        return this.requests.get(key);
    }

    set(key, value){
       this.requests.set(key, value);
    }

    delete(key) {
        this.requests.delete(key);
    }
}