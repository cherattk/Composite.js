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
            
        if(component.data && typeof component.data === 'string'){            
            return $.getJSON(this.buildURL(component.data) , function(response_data){
                self.component[component.name]['data'] = response_data;
            });
        }

        /**
         * @deprecated Called by component to trigger notification
         * @param {Object} data - data message
         * @todo check data format - must be valid json object
         */
        component.updateData = function(data){
            self.data_message[component.name] = data;
            self.notifyListener(component.name);
        };
        
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
                /** @todo : Assign HTML-Element rather than HTML-String  */
                this.component[component.name]['view']['template'] = template();

            }else if (typeof template === 'string'){

                let url = this.buildURL(template);                   

                return $.get( url , function(html){                
                    /** @todo : Assign HTML-Element rather than HTML-String  */
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

            if(typeof c.listenTo !== "undefined"){
                component.listenTo = c.listenTo;
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
        if(Array.isArray(component.listenTo)){
            
            var trigger_component = component.listenTo;            
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
            
            var callback_idx = 0,
                listener_callback = function(){};

            this.trigger[component_name].forEach(function(listener) {
                
                    callback_idx = listener.listenTo.length - 1;                
                    listener_callback = listener.listenTo[callback_idx];

                    var render_view = listener_callback.call(
                        listener,
                        { name :  component_name,
                          data : this.data_message[component_name]
                        }
                        );
                          
                // deprecated
                if(render_view && typeof listener.view !== "undefined"){
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
