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
        this.data_message = {};
    }   
    
    buildURL(view_path){
        return document.location.protocol + '//' + document.location.host + '/' + view_path;
    }
    
    getComponent(name){
      return this.component[name];
    }
  
    settingData(component){
        
        let self = this;        
        if(component.data && typeof component.data === 'string'){            
            
            return $.getJSON(this.buildURL(component.data) , function(response_data){
                self.component[component.name]['data'] = response_data;
            });
        }
    }
    
    settingView(component){
        
        if(!component.view){ return;}
        
         var self = this;
        var template = component.view.template;
            
        if(typeof template === 'function'){            
            // TODO : Assign HTML-Element rather than HTML-String
            this.component[component.name]['view']['template'] = template();
            
        }else if (typeof template === 'string'){
            
            let url = this.buildURL(template);                   
            
            return $.get( url , function(html){                
                // TODO : Assign HTML-Element rather than HTML-String
                self.component[component.name]['view']['template'] = html;
            });
        }
        
        // add updateView function to component
        this.component[component.name].updateView = function(){
            self.renderComponent(component.name);
        };
        
    }
    
    initComponent(component_name){
        
        var self = this;
        var util = {
            updateData : function(data){
                self.data_message[component_name] = data;
                self.notifyObserver(component_name);
            }
        };
        
        this.component[component_name].init(util);
    }
    
    addModule(tab_module){
        this.settingComponent(tab_module);
    }
    
    settingComponent(tab_module){
        
        var c = tab_module.shift();
        
        if(!c){return;}
        
        var self = this;
        
        var component = jQuery.extend(true,
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

            if(typeof c.listen !== "undefined"){
                component.listen = c.listen;
            }
            
        this.component[c.name] = component;
        
        console.log(component);
        
        $.when(
            self.settingView(component), 
            self.settingData(component)
        ).then(function(){                
            self.renderComponent(component.name);
            self.initComponent(component.name);
            self.addObserver(component.name);
            // add next component
            self.settingComponent(tab_module);
            
        });
    }
    
    addObserver(component_name){
        
        var component = this.component[component_name];
        if(Array.isArray(component.listen)){
            
            var listen_to = component.listen;            
            for (var i = 0, max = listen_to.length - 2 ; i <= max; i++) {
                if(typeof this.observable[listen_to[i]] === "undefined"){
                    this.observable[listen_to[i]] = [component];
                }
                else{
                    this.observable[listen_to[i]].push(component);
                }   
            }
        }
    }
    
    notifyObserver(component_name){
        
        if(typeof this.observable[component_name] !== "undefined"){
            
            this.observable[component_name].forEach(function(observer) {
                
                var notification_idx = observer.listen.length - 1;
                
                var observer_callback = observer.listen[notification_idx];
                var update_view = observer_callback.call(
                        observer,
                        { name :  component_name,
                          data : this.data_message[component_name]
                        });
                          
                if(update_view){
                    this.renderComponent(observer.name);
                }
        
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
