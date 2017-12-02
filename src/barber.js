class _Barber {
    
    constructor() {      
        this.component = {};
        this.observable = {};
    }   
    
    buildURL(view_path){
        return document.location.protocol + '//' + document.location.host + '/' + view_path;
    }    
    
    addModule(_module){
        _module.forEach(function(c){
            this.addComponent(c);
        } , this);
    }
    
    getComponent(name){
      return this.component[name];
    }
  
    configComponent(c){
        let barber = this;        
        $.when( 
            barber.settingView(c.name , c.view), 
            barber.settingData(c.name , c.data))
        .then(function(){
                // Barber.updateComponentData()
                //MUST be called after registering observer
                //@see Barber.registerObserver();                 
                c.eventHandler(this);
                barber.updateRender(c.name);
            });
        
        return c;
    }
    
    settingData(component_name , data){
        
        if(typeof data === 'string'){            
            let barber = this;
            return $.getJSON(this.buildURL(data) , function(response_data){
                 barber.component[component_name]['data'] = response_data;
            });
        }
    }
    
    settingView(component_name , view){
        
        let barber = this;
        if(typeof view === 'function'){
            barber.component[component_name]['view'] = view();
            
        }else if (typeof view === 'string'){
            let url = this.buildURL(view);
            return $.get( url , function(html){
                barber.component[component_name]['view'] = html;
            });
        }
    }
    
    registerObserver(c){
        
        if(Array.isArray(c.observable)){
            c.observable.forEach(function(subject){
                if(typeof this.observable[subject] === "undefined"){
                    this.observable[subject] = [c.name];
                }
                else{
                    this.observable[subject].push(c.name);
                }
            },this);
        }
    }
    
    addComponent(_c){        
        
        var c = Object.assign({
            name : '',
            view : '',
            parent : '',
            data : '',
            eventHandler : function(){},
            observable : []
        } , _c);
        
        /**
         * registerObserver() MUST be called before configComponent()
        */        
        this.registerObserver(c);
        this.component[c.name] = c;
        this.configComponent(c);
       
    }
    
    notify(component_name){
        if(typeof this.observable[component_name] !== "undefined"){
            this.observable[component_name].forEach(function(observer_name) {
                this.render(observer_name);
            },this);            
        }
    }
  
    updateRender(component_name){
        //this.component[component_name].data = data;        
        this.render(component_name);
        this.notify(component_name);
    }
  
    render(component_name){
        
        //console.log('render ' + component_name);
        
        //************************ Mustache Rendering *****************
        var c = this.component[component_name];
        console.log("========== begin render ===============");
        console.log(c);
        console.log("========== end render ===============");
        
        var parent = document.getElementById(c.parent);
        
        if(!parent){return;}
        
        parent.innerHTML = Mustache.render(c.view, c.data); 
        
        //**************************************************************/
    }
}

var Barber = new _Barber();