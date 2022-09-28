function isMatchStatus(liElement, filterStatus) {
  return filterStatus === "all" || liElement.dataset.status === filterStatus;
}
function isMatchSearch(liElement, searchTerm) {
  // if the search term is empty, then return all todo list
  if (searchTerm === "") return true;
  // else
  const todoTitle = liElement.querySelector("p.todo__title");
  if (!todoTitle) return false;
  return todoTitle.textContent.toLowerCase().includes(searchTerm.toLowerCase());
}
function isMatchAll(liElement, params) {
  return (
    isMatchStatus(liElement, params.get("status")) &&
    isMatchSearch(liElement, params.get("search"))
  );
}
function updateFinishButton(finishedButton, status) {
  // update text content for button
  finishedButton.textContent = status === "pending" ? "Finish" : "Reset";

  // update class name for button
  const newButtonClass = status === "completed" ? "btn-success" : "btn-dark";
  finishedButton.classList.remove("btn-success", "btn-dark");
  finishedButton.classList.add(newButtonClass);
}
function updateDivElement(newStatus, divElement) {
  const newAlertClass = newStatus === "completed" ? "alert-success" : "alert-secondary";
  divElement.classList.remove("alert-secondary", "alert-success");
  divElement.classList.add(newAlertClass);

  // update dataset status for li element
  divElement.querySelector("li");
}
function handleFinishButtonClick(todo, divElement, todoElement) {
  // find finished button element
  const finishedButton = todoElement.querySelector("button.mark-as-done");
  if (finishedButton) {
    // render text content first time
    finishedButton.textContent =
      todoElement.dataset.status === "pending" ? "Finish" : "Reset";
    // show class button first time
    todoElement.dataset.status === "completed"
      ? finishedButton.classList.add("btn-success")
      : finishedButton.classList.add("btn-dark");

    // add click event for button and update status for todo item
    finishedButton.addEventListener("click", () => {
      const newStatus =
        todoElement.dataset.status === "pending" ? "completed" : "pending";

      //update todo status todo element to localStorage
      const todoList = getTodoList();
      const index = todoList.findIndex((item) => item.id === todo.id);
      todoList[index].status = newStatus;
      console.log("newTodoList", todoList);

      //save todo list to localStorage
      localStorage.setItem("todo_list", JSON.stringify(todoList));

      //update classList for div element
      updateDivElement(newStatus, divElement);

      todoElement.dataset.status = newStatus;

      // update button
      updateFinishButton(finishedButton, todoElement.dataset.status);
    });
  }
}
function createTodoElement(todo, params) {
  if (!todo) return null;

  // find template element
  const todoTemplate = document.getElementById("todoTemplate");
  if (!todoTemplate) return null;

  // clone li element
  const todoElement = todoTemplate.content.firstElementChild.cloneNode(true);
  todoElement.dataset.id = todo.id;
  todoElement.dataset.status = todo.status;

  // render element status
  const divElement = todoElement.querySelector("div.todo");
  if (!divElement) return null;
  const alertClass = todo.status === "pending" ? "alert-secondary" : "alert-success";
  divElement.classList.add(alertClass);

  // update content where needed
  const todoTitle = todoElement.querySelector(".todo__title");
  if (todoTitle) todoTitle.textContent = todo.title;
  console.log(todo.title);

  // check if true then show it or hide
  if (params.get("search") && params.get("status")) {
    todoElement.hidden = !isMatchAll(todoElement, params);
  }

  // attach event
  // handleFinishButtonClick();
  handleFinishButtonClick(todo, divElement, todoElement);

  // find remove button element
  const removeButton = todoElement.querySelector("button.remove");
  if (removeButton) {
    removeButton.addEventListener("click", () => {
      console.log("remove");
      todoElement.remove();

      const todoList = getTodoList();
      console.log(todoElement.dataset.id);
      // filter todo list
      const newTodoList = todoList.filter((item) => item.id !== todo.id);

      //save todo list to localStorage
      localStorage.setItem("todo_list", JSON.stringify(newTodoList));
    });
  }

  // find edit button and add click event for it
  const editButton = todoElement.querySelector("button.edit");
  if (editButton) {
    editButton.addEventListener("click", () => {
      // TODO: lasted data from localStorage
      const todoList = getTodoList();
      // get todo item lasted need to be updated
      const lastedTodo = todoList.find((item) => item.id === todo.id);
      // function use set todo title to todo text input
      populateTodoForm(lastedTodo);
    });
  }

  return todoElement;
}

function populateTodoForm(todo) {
  // find form element
  const todoForm = document.getElementById("todoForm");
  if (!todoForm) return;

  todoForm.dataset.id = todo.id;

  // find todo text input element
  const todoInput = document.getElementById("todoText");
  if (!todoInput) return;
  todoInput.value = todo.title;

  // find checkbox element
  const checkbox = todoForm.querySelector("input[type='checkbox']");
  if (!checkbox) return;

  checkbox.checked = todo.status === "pending" ? false : true;
}

function renderTodoList(todoList, ulElementId, params) {
  if (!Array.isArray(todoList) || todoList.length === 0) return;

  // find ulElementId
  const ulElement = document.getElementById(ulElementId);
  if (!ulElement) return;
  for (const todo of todoList) {
    const liElement = createTodoElement(todo, params);
    // add li element to ul element
    ulElement.appendChild(liElement);
  }
}

function handleSubmitTodoForm(event, params) {
  event.preventDefault();

  // get todo list from localStorage
  const todoList = getTodoList();

  // find todo input
  const todoInput = document.getElementById("todoText");
  if (!todoInput || todoInput.value === "") return;

  // check action is edit or add new todo
  //find todo form
  const todoForm = document.getElementById("todoForm");

  // find checkbox element
  const checkbox = todoForm.querySelector("input[type='checkbox']");
  if (!checkbox) return;

  const isEditAction = Boolean(todoForm.dataset.id);

  if (isEditAction) {
    // edit action
    // find index of todo item with id = todoForm.dataset.id
    const index = todoList.findIndex(
      (item) => item.id.toString() === todoForm.dataset.id
    );

    // update tittle and status
    if (!todoInput.value || todoInput.value.toString() === "") return;
    todoList[index].title = todoInput.value;
    todoList[index].status = checkbox.checked ? "completed" : "pending";

    // save todo to localStorage
    localStorage.setItem("todo_list", JSON.stringify(todoList));

    // update DOM
    // find li element with data.id = dataset.id
    const todoElement = document.querySelector(
      `ul#todoList > li[data-id="${todoForm.dataset.id}"]`
    );
    if (todoElement) {
      // update dataset status for li element
      todoElement.dataset.status = todoList[index].status;

      // render element status
      const divElement = todoElement.querySelector("div.todo");
      if (!divElement) return null;

      // handleFinishButtonClick
      console.log("todoList[index]", todoList[index]);
      handleFinishButtonClick(todoList[index], divElement, todoElement);

      // update divElement
      updateDivElement(todoList[index].status, divElement);

      // update finish button
      // find finish button element
      const finishButton = todoElement.querySelector("button.mark-as-done");
      if (finishButton) {
        updateFinishButton(finishButton, todoList[index].status);
      }

      // update todoText to li.todo__title element
      const todoText = todoElement.querySelector("p.todo__title");
      todoText.textContent = todoInput.value;
    } else {
      console.log("not find todo");
    }
  } else {
    // create new todo
    const newTodo = {
      id: Date.now(),
      title: todoInput.value,
      status: "pending",
    };

    // set status of new todo
    newTodo.status = checkbox.checked ? "completed" : "pending";

    // add todo item to todoList
    todoList.push(newTodo);

    // update todo list to localStorage
    localStorage.setItem("todo_list", JSON.stringify(todoList));

    // find ul element
    const ulElement = document.getElementById("todoList");
    if (!ulElement) return;

    // update todo to UI
    const newTodoElement = createTodoElement(newTodo, params);
    ulElement.appendChild(newTodoElement);
  }
  delete todoForm.dataset.id;

  // update default false status to completed checkbox
  checkbox.checked = false;

  // reset todo input to empty string
  todoInput.value = "";
}

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem("todo_list")) || [];
  } catch {
    return [];
  }
}

// main function
(() => {
  // set query params to url
  const url = new URL(window.location);
  url.searchParams.set("search", "");
  window.history.pushState({}, "", url);
  url.searchParams.set("status", "all");
  window.history.pushState({}, "", url);

  // get query params from url
  const params = new URLSearchParams(window.location.search);

  const todoList = getTodoList();
  renderTodoList(todoList, "todoList", params);

  // register submit event for form todo
  const todoForm = document.getElementById("todoForm");
  todoForm.addEventListener("submit", (event) => {
    handleSubmitTodoForm(event, params);
  });

  // find reset button and add click event for it
  const resetButton = document.querySelector("button.btn.btn-danger");
  resetButton.addEventListener("click", () => {
    // find ul element
    const ulElement = document.getElementById("todoList");
    if (!ulElement) return;

    // remove all children from ul element
    ulElement.textContent = "";

    // set todoList to localStorage
    localStorage.setItem(
      "todo_list",
      JSON.stringify([
        { id: 1, title: "Javascript", status: "pending" },
        { id: 2, title: "ReactJS", status: "completed" },
        { id: 3, title: "NextJS", status: "pending" },
      ])
    );

    // render todoList
    renderTodoList(getTodoList(), "todoList", params);
    console.log("params", params);

    // replace todo text input bt empty value
    const todoText = document.getElementById("todoText");
    if (todoText) {
      todoText.value = "";
    }
  });
})();
