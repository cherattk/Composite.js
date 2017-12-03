MyModule = [
    {  
        name : 'head',
        view : "demo/component/head.html",
        parent : 'component-1',
        data : {
                title : "Todo List",
                message : "One Task at a Time"
            },
        eventHandler : function(Composite) {

            //console.log(this.name + ' update his data');    
        }

    },
    {  
        name : 'list',
        view : function(){
            return `<ul id="todo-list" class="todo-list">
                    {{ #todo }}
                      <li class="{{ status }}" data-taskid="{{ id }}">
                        {{ label }}
                      </li>
                    {{ /todo }}
                </ul>`;
        },
        data : "demo/component/data.json",
        parent : 'component-2',
        eventHandler : function(){
            var list = document.getElementById(this.parent);
                    list.addEventListener('click', function(ev) {
                    if (ev.target.tagName === 'LI') {
                      ev.target.classList.toggle('done');
                    }
                }, false);
        },
        observable : ['head']

    }
];


Composite.addModule(MyModule);

