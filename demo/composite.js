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
        this.publisher = {};
        this.data_message = {};
    }   
    
    buildURL(view_path){
        return document.location.protocol + '//' + document.location.host + '/' + view_path;
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
    
    
    
    updateData(component_name , data){
        this.data_message[component_name] = data;
        this.notifySubscriber(component_name);
    }
    
    addModule(tab_module){
        this.addComponent(tab_module);
    }
    
    addComponent(tab_module){
        
        var c = tab_module.shift();
        
        if(!c){return;}
        
        var self = this;
        
        var component = $.extend(true,
            {
                name : '', //required
                view : {
                    anchor : '',  // container's id into which the view is inserted
                    template: '' // mustache.js template
                },
                data : '',
                init : function(){},
                listen : ''
            } , c );
        
        if(typeof c.listen !== " undefined"){
            component.listen = c.listen;
        }
        
        this.component[c.name] = component;
        
        $.when(
            self.settingView(c.name , c.view.template), 
            self.settingData(c.name , c.data))
        .then(function(){                
            self.renderComponent(c.name);
            self.component[c.name].init(self);
            self.addSubscriber(component);
            // add next component
            self.addComponent(tab_module);
            
        });
    }
    
    addSubscriber(component){
        
        if(Array.isArray(component.listen)){
            
            var listen_to = component.listen;            
            for (var i = 0, max = listen_to.length - 2 ; i <= max; i++) {
                if(typeof this.publisher[listen_to[i]] === "undefined"){
                    this.publisher[listen_to[i]] = [component];
                }
                else{
                    this.publisher[listen_to[i]].push(component);
                }   
            }
        }
    }
    
    notifySubscriber(component_name){
        
        if(typeof this.publisher[component_name] !== "undefined"){
            
            this.publisher[component_name].forEach(function(subscriber) {
                
                let callBack = subscriber.listen[subscriber.listen.length-1];
                callBack.call(
                        subscriber,
                        this, // Composite Object
                        { name :  component_name,
                          data : this.data_message[component_name]
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
