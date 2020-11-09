class DataModel {
    constructor() {
        this.data = [];
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        for (let i=0; i < this.data.length; i++){
            if(this.data[i].id == id){
                 return this.data[i];
            }
               
        }
        return null;
    }

    save(obj) {
        if (this.validate(obj)) {
            this.data.push(obj);
            return true;
        }
        return false;
    }

    update(obj, id) {
        for(let i = 0; i < this.data.length; i++){
            if(this.data[i].id == id){
                for(let name in obj){
                    this.data[i][name] = obj[name]
                }
                return true;
            }
        }
        return false;
    }

    delete(id) {
        let originalLenght = this.data.length
        for(let i=0; i < this.data.length; i++){
            if(this.data[i].id == id){
                this.data.splice(i,1)
            }
           
        }
       if(this.data.length < originalLenght){
           return true;
       }
       return false;
    }

    // this method will be overriden in the sub classes
    validate(obj) {
        return false;
    }
}
