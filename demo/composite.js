/****************************************************************************************
 * Composite.js
 *
 * @link      https://github.com/cherattk/Composite.js
 * @copyright Copyright (c) 2017 cheratt karim
 * @license   (MIT License) https://github.com/cherattk/Composite.js/blob/master/LICENSE
 ******************************************************************************************/

class _Composite {
    
    constructor() {
        this.component = {};
        this.observable = {};
        this.shared_data = {};
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
  
    settingData(component_name , data){
        
        if(data && typeof data === 'string'){            
            let self = this;
            return $.getJSON(this.buildURL(data) , function(response_data){
                self.component[component_name]['data'] = response_data;
            });
        }
    }
    
    settingView(component_name , template){
        
        var self = this;
        if(typeof template === 'function'){
            self.component[component_name]['view']['template'] = template();
            
        }else if (typeof template === 'string'){
            let url = this.buildURL(template);
            return $.get( url , function(html){
                self.component[component_name]['view']['template'] = html;
            });
        }
    }
    
    settingComponent(c){
        
        var self = this;        
        this.component[c.name] = c;
        
        $.when(
            self.settingView(c.name , c.view.template), 
            self.settingData(c.name , c.data))
        .then(function(){                
                self.renderComponent(c.name);
                self.component[c.name].init(self);
        });
    }
    
    updateData(component_name , data){
        this.shared_data[component_name] = data;
        this.notifyObserver(component_name);
    }
    
    registerObserver(component){
        
        if(Array.isArray(component.listen)){
            
            var listen = component.listen;            
            for (var i = 0, max = listen.length - 2 ; i <= max; i++) {
                if(typeof this.observable[listen[i]] === "undefined"){
                    this.observable[listen[i]] = [component];
                }
                else{
                    this.observable[listen[i]].push(component);
                }   
            }
        }
    }
    
    addComponent(_c){
        
        var component = $.extend(true,
            {
                name : '', //required
                view : {
                    anchor : '',  // container's id into which the view is inserted
                    template: ''
                },
                data : '',
                init : function(){},
                listen : ''
            } , _c );
        
        if(typeof _c.listen !== " undefined"){
            component.listen = _c.listen;
        }
        this.settingComponent(component);
        this.registerObserver(component);
    }
    
    notifyObserver(component_name){
        
        if(typeof this.observable[component_name] !== "undefined"){
            
            this.observable[component_name].forEach(function(observer) {
                
                let lastElement = observer.listen[observer.listen.length-1];
                lastElement.call(
                        observer,
                        this, // Composite Object
                        { name :  component_name,
                          data : this.shared_data[component_name]
                        });
                    
        
            },this);            
        }
    }
  
    renderComponent(component_name){
        
        var c = this.component[component_name];        
        var anchor = document.getElementById(c.view.anchor);        
        if(!anchor){return;}
        
        //******* Mustache Rendering *****************
        anchor.innerHTML = Mustache.render(c.view.template, c.data);       
        //*********************************************/
    }
}

var Composite = new _Composite();
