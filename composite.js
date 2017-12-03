/****************************************************************************************
 * Composite.js
 *
 * @link      https://github.com/cherattk/Composite.js
 * @copyright Copyright (c) 2017 cheratt karim
 * @license   (MIT License) https://github.com/cherattk/Composite.js/blob/master/LICENSE
 * 
 *****************************************************************************************/

class _Composite {
    
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
        let self = this;        
        $.when( 
            self.settingView(c.name , c.view), 
            self.settingData(c.name , c.data))
        .then(function(){
                // Composite.updateComponentData()
                //MUST be called after registering observer
                //@see Composite.registerObserver();                 
                c.eventHandler(this);
                self.updateRender(c.name);
            });
        
        return c;
    }
    
    settingData(component_name , data){
        
        if(typeof data === 'string'){            
            let self = this;
            return $.getJSON(this.buildURL(data) , function(response_data){
                self.component[component_name]['data'] = response_data;
            });
        }
    }
    
    settingView(component_name , view){
        
        let self = this;
        if(typeof view === 'function'){
            self.component[component_name]['view'] = view();
            
        }else if (typeof view === 'string'){
            let url = this.buildURL(view);
            return $.get( url , function(html){
                self.component[component_name]['view'] = html;
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
        this.render(component_name);
        this.notify(component_name);
    }
  
    render(component_name){
        
        //************************ Mustache Rendering *****************
        var c = this.component[component_name];        
        var parent = document.getElementById(c.parent);        
        if(!parent){return;}
        
        parent.innerHTML = Mustache.render(c.view, c.data); 
        
        //**************************************************************/
    }
}

var Composite = new _Composite();