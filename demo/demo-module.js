Task = (typeof Task !== "undefined")  ? Task : {};

Task.util = {
    
    /**
    * @param {Object} config
    * @returns String
    */
    
    render : function(config){
        
        _config = $.extend({} , {
            parentElement : null, //Id element on which append component
            template : null, // mustache template
            viewData : null, // datas to inject in template
            eventHandler : function(){},
            callback : function(){},
            append : false // append or replace with the old view
        }, config);

        if(_config.append){
            document.getElementById(_config.parentElement).innerHTML += 
            Mustache.render(_config.template, _config.viewData);
        }
        else { 
            document.getElementById(_config.parentElement).innerHTML = 
            Mustache.render(_config.template, _config.viewData); 
        }
        
        if(typeof _config.eventHandler === "function"){
            _config.eventHandler();
        };
        
        if(typeof _config.callback === "function"){
            _config.callback();
        };
    }
};

// ============================================================================

Task.moduleName = {
    
    component :
    {
        componentOne : {
            
            /** Simple way to write and render component is
             * to use Template literals
             * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
             */            
            templateHtml : `<div class="todo-head">
                                <h1>{{ title }}</h1>
                                <h4> {{ message }} </h4>
                                <br/>
                            </div>`,
            
            parentElement : 'component-1',
            
            viewData : {
                title : "Todo List",
                message : "One Task at a Time"
            },
            
            render : function(){             
                var html = this.templateHtml;
                Task.util.render({
                    parentElement : this.parentElement,
                    template : html,
                    viewData : this.viewData
                });                
            }
        }, //
        
        componentTwo : {
            templateUrl : "demo-view.html",
            viewData : 'demo-data.json',
            parentElement : 'component-2',
            
            render : function(){
                
                var renderConfig = {
                        parentElement : this.parentElement,
                        template : this.templateHtml,
                        viewData : {},
                        append : false,
                        eventHandler : this.eventHandler
                    };
                
                if(typeof this.viewData === "string" /* if is url */ ){
                    $.getJSON(this.viewData , function(response){
                        renderConfig.viewData.todo = response.todo;                    
                        Task.util.render(renderConfig);
                    });
                }
                else if(typeof this.viewData === "object" && this.viewData){
                    Task.util.render(renderConfig);
                }
                
            },            
            eventHandler : function(){
                var list = document.getElementById('component-2');
                    list.addEventListener('click', function(ev) {
                    if (ev.target.tagName === 'LI') {
                      ev.target.classList.toggle('done');
                    }
                }, false);
            }
        }
    },
    
    loadTemplate : function(){
                
        $.each(this.component , function(key , val){
            
            if(!val.templateHtml){
                $.get(val.templateUrl, function(response){
                    val.templateHtml = response;
                    val.render();
                });
            }else{
                val.render();
            };            
        });
    },
    
    init : function(){
       this.loadTemplate();
    }
    
};

$(document).ready(function(){

    //==========================
        Task.moduleName.init();
    //==========================   
});