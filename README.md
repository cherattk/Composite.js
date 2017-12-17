### What It Is
Composite.js is a framework (as basic structure underlying a system rather than a toolbox) for Component-Based FrontEnd Development. Its implementation is based on **Mediator** design pattern and uses **jQuery** and **Mustache.js**
 
 ##### Usage
 See todo list in **demo/** folder

 In the demo the templates and data are loaded dynamically, therefore to avoid getting the "cross origin requests" error you need to load the demo with a webserver.

##### With built-in php server
```bash
$ cd demo/
$ php -S localhost:8383
```
and opening http://localhost:8383 address should display something like this

![Todo Demo](/demo/demo.png?raw=true "Todo List")