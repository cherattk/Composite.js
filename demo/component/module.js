MyModule = [
    {  
        name : 'head',
        view : {
            anchor : 'anchor-head',
            template: "demo/component/head.html"
        },
        data : {
                title : "Composite Todo List",
                message : "One Task at a Time"
            }
    },    
    {
        name : 'task-form',
        view : {
            anchor : 'anchor-form',
            template : function(){
                return `<form id="task-form">
                        <input type="text" name="label"/>
                        <input type="submit" value="save"/>
                      </form>`;
            }
        },
        
        init : function(composite){            
            form = document.getElementById('task-form');
            var self = this;
            form.onsubmit = function(e){
                e.preventDefault();
                var data = {
                    id : '1111',
                    status : 'todo',
                    label : this.elements['label'].value
                };
                composite.updateData(self.name , data);
            };
        }
    },
    {  
        name : 'list',
        view : {            
            anchor : 'anchor-list',
            template : function(){
                return `<ul id="todo-list" class="todo-list">
                        {{ #todo }}
                          <li class="{{ status }}" data-taskid="{{ id }}">
                            {{ label }}
                          </li>
                        {{ /todo }}
                    </ul>`;
            }
        },
        data : "demo/component/data.json",
        init : function(){
            var list = document.getElementById(this.view.anchor);
                    list.addEventListener('click', function(ev) {
                    if (ev.target.tagName === 'LI') {
                      ev.target.classList.toggle('done');
                    }
                }, false);
        },
        listen : ['task-form' , function(composite , notification){
                
            this.data.todo.push(notification.data);
            composite.renderComponent(this.name);
        }]
    }
];


Composite.addModule(MyModule);

