MyModule = [
    {  
        name : 'head',
        view : {
            anchor : 'anchor-head',
            template: "component/head.html"
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
                            <input type="text" name="task_label" placeholder="your task here"/>
                            <input type="submit" value="save"/>
                        </form>`;
            }
        },
        
        eventHandler : function(){
            form = document.getElementById('task-form');
            var self = this;
            form.onsubmit = function(e){
                e.preventDefault();
                
                if(!this.elements['task_label'].value){return;}

                var data = {
                    "id" : '1111',
                    "status" : 'todo',
                    "task_label" : this.elements['task_label'].value
                };
                this.elements['task_label'].value = '';
                
                // 2 - notify listeners by updating data
                self.updateData(data);
            };
        },
        
        init : function(){
            this.eventHandler();
        }
    },
    {
        name : "worker-that-processes-data",
        listenTo : ['task-form' , function(notification){
            
            var data = notification.data;

            /**
             * 1 - process datas that come from "task-form"
             * 2 - processes datas somewhere
             * 3 - notify listeners by updating data
            */
            this.updateData(data);
            
        }]
    },
    {
        name : 'list',
        view : {            
            anchor : 'anchor-list',
            template : function(){
                return `<ul id="todo-list" class="todo-list">
                        {{ #todo }}
                          <li class="{{ status }}" data-taskid="{{ id }}">
                            {{ task_label }}
                          </li>
                        {{ /todo }}
                    </ul>`;
            }
        },
        data : "component/data.json",
        init : function(){
            var list = document.getElementById(this.view.anchor);
                    list.addEventListener('click', function(ev) {
                    if (ev.target.tagName === 'LI') {
                      ev.target.classList.toggle('done');
                    }
                }, false);
        },
        listenTo : ['worker-that-processes-data' , function(notification){
            
           /**
            * get notification from "worker-that-processes-data"
            * data.todo is an array 
            * @see component/data.json file
            */

            this.data.todo.push(notification.data);

            // return true if we want to update list's view
            return true;
        }]
    }
];


Composite.addModule(MyModule);

