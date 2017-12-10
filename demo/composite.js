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
        this.trigger = {};
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
        
        // deprecated
        component.updateData = function(data){
                self.data_message[component.name] = data;
                self.notifyListener(component.name);
        };
            
        if(component.data && typeof component.data === 'string'){
            
            return $.getJSON(this.buildURL(component.data) , function(response_data){
                self.component[component.name]['data'] = response_data;
            });
        }
        
        
    }
    
    initComponent(component_name){
        this.renderComponent(component_name);
        this.component[component_name].init(); 
    }
    
    settingView(component){
        
        if(component.view){
        
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
        }        
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
                data : '',
                init : function(){},
                listen : ''
            } , c );

            if(typeof c.listen !== "undefined"){
                component.listen = c.listen;
            }
            
            if(typeof c.view !== "undefined"){
                component.view = c.view;
            }
            
        this.component[c.name] = component;
        
        $.when(
            self.settingView(component), 
            self.settingData(component)
        ).then(function(){
            self.initComponent(component.name);
            self.addListener(component.name);
            // add next component
            self.settingComponent(tab_module);
            
        });
    }
    
    addListener(component_name){
        
        var component = this.component[component_name];
        if(Array.isArray(component.listen)){
            
            var trigger_component = component.listen;            
            for (var i = 0, max = trigger_component.length - 2 ; i <= max; i++) {
                if(typeof this.trigger[trigger_component[i]] === "undefined"){
                    this.trigger[trigger_component[i]] = [component];
                }
                else{
                    this.trigger[trigger_component[i]].push(component);
                }   
            }
        }
    }
    
    notifyListener(component_name){
        
        if(typeof this.trigger[component_name] !== "undefined"){
            
            this.trigger[component_name].forEach(function(listener) {
                
                var callback_idx = listener.listen.length - 1;
                
                var listener_callback = listener.listen[callback_idx];
                listener_callback.call(
                        listener,
                        { name :  component_name,
                          data : this.data_message[component_name]
                        });
                          
                if(typeof listener.view !== "undefined"){
                    this.renderComponent(listener.name);
                }
        
            },this);
        }
    }
  
    renderComponent(component_name){
        
        var c = this.component[component_name];
        if(!c.view || !c.view.anchor){return;}
           
        var anchor = document.getElementById(c.view.anchor);        
        if(!anchor){return;}
        
        //******* Mustache Rendering *****************
        anchor.innerHTML = Mustache.render(c.view.template, c.data);       
        //*********************************************/
    }
}

var Composite = new _Composite();
