### What It Is
Composite.js is a framework (as basic structure underlying a system rather than a toolbox) for Component-Based FrontEnd Development. Its implementation is based on **Mediator** design pattern and uses **jQuery** and **Mustache.js**
 
 ### Basic Usage with 2 files : index.html and my_app.js
 
 #### index.html
 ```html
 <!DOCTYPE html>
<html>
<head>
   <title>Composite Usage</title>
 
    <!-- include jQuery.js -->
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    
    <!-- include Mustache.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.js"></script>
                    
    <!-- include Composite.js -->
    <script src="path/to/composite.js"></script>        
 </head>
 
 <body>
  <div id="anchor-form"><!-- component will be inserted here --></div>            
  <div id="anchor-list"><!-- component will be inserted here --></div>
 </body>
 
 <!-- my_app.js -->
 <script src="path/to/my_app.js"></script>
 
 </html>
 
```
 
 #### my_app.js file
 
 ```js
 // 1 - define first component
 var task_form = {
    name : "task-form", // component-name (required)
    view : {
        anchor : 'anchor-form', // where to append the component in index.html
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
                if(!this.elements['task_label'].value){return;}
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
        }]
    };
    
// 3 - Register components
 Composite.addModule([task_form , task_list]);
 
 ```
 ### voila, you can now open index.html in browser
 
 
 ### 2 - For advanced usage take a look at **demo/** folder

 In the demo app the templates and data are loaded dynamically, therefore to avoid getting the "cross origin requests" error you need to load the demo by a webserver.

##### With built-in php server
```bash
$ cd demo/
$ php -S localhost:8383
```
and opening http://localhost:8383 address should display something like this

![Todo Demo](/demo/demo.png?raw=true "Todo List")
