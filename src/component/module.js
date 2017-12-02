MyModule = [
    {  
        name : 'head',
        view : "src/component/head.html",
        parent : 'component-1',
        data : {
                title : "Barber Todo List",
                message : "One Task at a Time"
            },
        eventHandler : function(barber) {

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
        data : "src/component/data.json",
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


Barber.addModule(MyModule);

