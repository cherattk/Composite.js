// 1 - define first component
var task_form = {
    name : "task-form", // component-name (required)
    view : {
        anchor : 'anchor-form', // (required for view attribute) where to append the component in index.html
        template : function(){
            return `<form id="task-form">
                        <input type="text" name="task_label" placeholder="your task here"/>
                        <input type="submit" value="save"/>
                    </form>`;
        }
    },
    init : function(){    
         var self = this;
         document.getElementById('task-form').onsubmit = function(e){
                e.preventDefault();
                
                if(!this.elements['task_label'].value){
                    window.alert('Sorry, i can\'t add an empty value to the list');
                    return;
                }
                var data = {
                    "task_label" : this.elements['task_label'].value
                };
                this.elements['task_label'].value = '';
                
                // 2 - notify listeners by updating data
            self.updateData(data);
       }
    }
 }
    
 // 2 - define second component 
 var task_list = {
        name : "list", // component-name (required)
        view : {            
            anchor : 'anchor-list', // where to append the component in index.html
            template : function(){
                return `<ul>
                            {{ #todo }}
                            <li>
                                {{ task_label }}
                            </li>
                            {{ /todo }}
                        </ul>`;
            }
        },
        data : {
            "todo" : [
                        {
                            "task_label": "First Task"
                        }
                    ]
        },
        listenTo : ['task-form' , function(notification){
 
           /**
            * the {list} component will be notified by {task-form} when the form is submitted
            */
 
            // update view data
            this.data.todo.push(notification.data);
            
            // return true if we want to update list's view
            return true;
        }]
    };
    
 // 3 - Register components
 Composite.addModule([task_form , task_list]);