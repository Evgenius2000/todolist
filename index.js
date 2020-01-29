var toDoList = new toDoList();
var activeItem = null;
var sortUp = false;
//************************************************** block of initializations ******************************** */
function toDoList(){// конструктор глобального листа задач
    return {};    
}
function task(){ // конструктор задачи
    
    this.id = null;
    this.date = '';
    this.priority = 0;
    this.description = '';
    this.done = false;
}
function nodeTaskHTML(obj){
    let dateDay = moment(obj.date).format('DD.MM.YYYY');
    let dateTime = moment(obj.date).format('HH:mm');
    return `
    <div id="task${obj.id}" class="d-flex flex-row">
        <div id="date" class="d-flex flex-column taskcol timeDiv">
            <div>${dateDay}</div>
            <div>${dateTime}</div>
        </div>
        <div id="priority"class="d-flex flex-row taskcol priority">${obj.priority}</div>
        <div id="priorityBtns"class="d-flex flex-row taskcol flex-column" onclick=priority(event)>
         <img id="prioUp" src="img/priorityup.png">
         <img id="prioDown"src="img/prioritydown.png">
        </div>
        <div id="description"class="d-flex flex-row description ${obj.done ? "done" : ""}">${obj.description}</div>
        <img src="img/edit.png" class="taskcol" onclick=editShowModal()>
        <img src="img/${obj.done ? "done.png" : "inprocess.png"}" class="taskcol" onclick=changeStatus()>
        <img id="status" src="img/delete.png" class="taskcol" onclick=deleteModalShow()>
    </div>
    `;
}
function init(){
    addEvents();
    getList();
    showTodoList();
}
function getList(){ // читаю массив toDoList из LocalStorage
    if (localStorage.getItem("toDoList") == null) return;
    toDoList = JSON.parse(localStorage.getItem("toDoList"));
}
function putList(){// записываю массив toDoList в LocalStorage
    localStorage.setItem("toDoList",JSON.stringify(toDoList));
}
function addEvents(){
    // добавил разрешение проверку на Enter в поле для ввода тасков
    document.getElementById('taskInput').addEventListener('keydown',
         function(event){
        if(event.keyCode == 13) addTask()
        addLimitForNewTask("taskInput");    
    })
    document.getElementById('editTaskArea').addEventListener('keydown',
    function(event){
        if(event.keyCode == 13) addTask()    
        addLimitForNewTask('editTaskArea');    
    })
}
function addLimitForNewTask(source){
    let limit = 100;
    if (document.getElementById(source).value.length > limit) {
            document.getElementById(source).value = document.getElementById(source).value.slice(0,99);
            alert(`You are excead limit for task. Limit is ${limit} symbols`)
        };
}
function showTodoList (arr){
    let mainDiv = document.getElementById('main');
    let content = ''; 
    if(arr == undefined) arr =  Object.values(toDoList) 
    arr.forEach(i => content += nodeTaskHTML(i)); 
    mainDiv.innerHTML = content;
}
// ************************************************** Create tasks block************************************
function addTask(){
    if (document.getElementById('taskInput').value.trim() == "") return;
    createTask();
    showTodoList ();
}
function createTask(){
    let obj = new task();
     // получение миллисекунд
    let date = Date.now();
    // поиск последнего ID
    let newId = 0;
    for(i in toDoList) if (toDoList[i].id > newId) newId = toDoList[i].id;
    //заполняю новый объект данными
    newId++;
    obj.id = newId;
    obj.date = date;
    obj.priority = 0;
    obj.description = document.getElementById('taskInput').value;
    obj.done = false;
    // записываю новывй объект в localStorage
    toDoList[newId] = obj;
    putList();
    document.getElementById('taskInput').value = "";
}
//************************************ Modal functions block **********************************************
function closeModals(){
    document.getElementById("modalFormEdit").style.display = "none";
    document.getElementById("modalFormDelete").style.display = "none";
}
function editShowModal(){
    document.getElementById('modalFormEdit').style.display = "block";
    let currentNode = event.target;
    activeItem = parseInt(currentNode.parentNode.id.match(/\d+/)); 
    document.getElementById("editTaskArea").value = toDoList[activeItem].description;
}
function saveEditedTask(){
    toDoList[activeItem].description =  document.getElementById("editTaskArea").value;
    closeModals();
    putList();
    showTodoList();
}
function deleteModalShow(){ 
    document.getElementById('modalFormDelete').style.display = "block";
    let currentNode = event.target;
    activeItem = parseInt(currentNode.parentNode.id.match(/\d+/)); 
    document.getElementById("deletedTask").innerHTML = toDoList[activeItem].description;        
}
function deleteTask(){
    delete toDoList[activeItem];
    localStorage.clear();
    closeModals();
    putList();
    showTodoList()
}
//*********************************** Priority/Done functions block ***********************************
function priority(){
    let incDec = 0;
    let currentNode = event.target;
    if (currentNode.id == "prioUp") incDec++;
    if (currentNode.id == "prioDown") incDec--;
    let i = parseInt(currentNode.parentNode.parentNode.id.match(/\d+/)); 
    if (incDec == 1 && toDoList[i].priority < 10) toDoList[i].priority += 1
    if (incDec == -1 && toDoList[i].priority > 0) toDoList[i].priority -= 1
    putList();
    showTodoList()
}
function changeStatus(){
    let currentNode = event.target;
    let i = parseInt(currentNode.parentNode.id.match(/\d+/)); 
    toDoList[i].done = !toDoList[i].done;
    putList();
    showTodoList();
}
//******************************************** sortBlock ******************************************/
function sortPriority(){
    let arr =  Object.values(toDoList);
    sortUp ? arr.sort((a, b) => a.priority - b.priority) : arr.sort((a, b) => b.priority - a.priority) ;
    sortUp = !sortUp;
    showTodoList(arr);
}
function sortDate(){
    let arr =  Object.values(toDoList);
    sortUp ? arr.sort((a, b) => a.date - b.date) : arr.sort((a, b) => b.date - a.date) ;
    sortUp = !sortUp;
    showTodoList(arr);
}
function sortStatus(){
    let arr =  Object.values(toDoList);
    sortUp ? arr.sort((a, b) => a.done - b.done) : arr.sort((a, b) => b.done - a.done) ;
    sortUp = !sortUp;
    showTodoList(arr);
}
function search(){
    let searchStr = document.querySelector('#search').value;
    let arr = [];
    if (searchStr.trim() != ""){
        for (i in toDoList){        
        if (toDoList[i].description.indexOf(searchStr) > -1) arr[i] = toDoList[i];
        }
        showTodoList(arr);
    }
    else showTodoList();
}