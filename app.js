//JUST FOR FUN ALERTS
function hideAlert() {
  const el = $('.alert');
  if (el)
  el.parent().children('.alert').remove();
}

function showAlert(type, msg) {
  hideAlert();
  const markup = `<div class='alert alert--${type}'>${msg}</div>`;
  $('body').after(markup);
  window.setTimeout(hideAlert, 1500);
}

//Define UI Vars
const form = $("#task-form");
const taskList = $(".collection");
const clearBtn = $(".clear-tasks");
const filter = $("#filter");
const taskInput = $("#task");

//Load all event listeners
loadEventListeners();

function loadEventListeners() {
  // DOM load event
  $(document).on('DOMContentLoaded', getTasks);
  // Add task event
  form.on('submit', addTask);
  // Remove task event
  taskList.on('click', removeTask);
  // Remove whole list
  clearBtn.on('click', removeList);
  // Filter search tasks
  filter.on('input', filterTask);
}

//_________________Get tasks from LStorage__________
function getTasks() {
  let tasks;
  if (localStorage.getItem('tasks') == null) {
    tasks = [];
  } else {
    //store in list as JS object/array
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function (task) {
    // Create li elem
    const li = $(`<li class='collection-item'>${task}</li>`);
    //create link/icon elem
    const link = $("<a class='delete-item secondary-content'></a>");
    link.html("<i class='material-icons'>delete</i>");
    //append elem to each other
    li.append(link);
    taskList.append(li);
  });
}

// _________________Add Task_________________
function addTask(e) {
  if (taskInput.val() != '') {
    // Create li elem
    const li = $(`<li class='collection-item'>${taskInput.val()}</li>`);
    //create link/icon elem
    const link = $("<a class='delete-item secondary-content'></a>");
    //append elem to each other
    link.html("<i class='material-icons'>delete</i>");
    li.append(link);
    taskList.append(li);
    //alert msg
    showAlert('add', 'Task added');

    //Store in local storage
    storeTaskInLocalStorage(taskInput.val());

    //remove text from input field
    taskInput.val('');

    e.preventDefault(); //prevent default behaviour
  }
}

// _________________Store Task In Local Storage_________________
function storeTaskInLocalStorage(task) {
  let tasks;
  if (localStorage.getItem('tasks') == null) {
    tasks = []
  } else {
    //store in list as JS object/array
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  //store task in array
  tasks.push(task);

  //add to local storage as a string
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// _________________Remove Task_________________
function removeTask(e) {
  // if user clicks on i/icon elem
  if (e.target.parentElement.classList.contains('delete-item')) {
    $(e.target).parent().parent().remove(); // (i -> a -> li) so remove li
    showAlert('del', 'Task deleted')
    //Remove from L.S
    removeTaskFromLocalStorage(e.target.parentElement.parentElement);
  }
}

// _________________Remove From Storage_________________
function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  if (localStorage.getItem('tasks') == null) {
    tasks = []
  } else {
    //store in list as JS object/array
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  // if deleted text matches to any in array then delete it
  tasks.forEach(function (task, indx) {
    // replace the delete word as it is for icon
    if (taskItem.textContent.replace('delete', '') == task)
      tasks.splice(indx, 1);  //start at task indx and delete 1 elem
  });

  // set new array/tasks again to local strore
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// _________________Remove Whole Tasks_________________
function removeList() {
  // taskList.html(''); one way

  //Faster way
  let tasks = document.querySelector('.collection');
  while (tasks.firstChild) {
    tasks.removeChild(tasks.firstChild);
    showAlert('del', 'All Tasks deleted')
  }
  // clear whole tasks from LStorage if user clicks clearTasks
  localStorage.clear();
}

// _________________Filter Tasks_________________
function filterTask(e) {
  // get text from filter input field
  const text = e.target.value.toLowerCase();

  //iterate through li's/tasks array using 'jQuery each'
  $.each($('.collection-item'), function (indx, task) {
    //remove delete word from item text
    const item = $(task).text().replace('delete', '');
    // if word found in list then display else dont
    if (item.toLowerCase().indexOf(text) != -1) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  });
}


