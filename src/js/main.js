function addClickEventListenerForButton(status, finishedButton, divElement) {
  status === "completed"
    ? (finishedButton.textContent = "Completed")
    : (finishedButton.textContent = "Pending...");
  finishedButton.addEventListener("click", () => {
    if (status === "completed") {
      divElement.classList.remove("alert-success");
      divElement.classList.add("alert-secondary");
      status = "pending";
      finishedButton.textContent = "Pending...";
    } else {
      divElement.classList.remove("alert-secondary");
      divElement.classList.add("alert-success");
      status = "completed";
      finishedButton.textContent = "Completed";
    }
  });
  return status;
}
function createTodoElement(todo) {
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

  // attach event
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
      const newAlertClass =
        newStatus === "completed" ? "alert-success" : "alert-secondary";
      divElement.classList.remove("alert-secondary", "alert-success");
      divElement.classList.add(newAlertClass);

      todoElement.dataset.status = newStatus;

      // update text content for button
      finishedButton.textContent =
        todoElement.dataset.status === "pending" ? "Finish" : "Reset";

      // update class name for button
      const newButtonClass =
        todoElement.dataset.status === "completed" ? "btn-success" : "btn-dark";
      finishedButton.classList.remove("btn-success", "btn-dark");
      finishedButton.classList.add(newButtonClass);
    });
  }
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

  return todoElement;
}
function renderTodoList(todoList, ulElementId) {
  if (!Array.isArray(todoList) || todoList.length === 0) return;

  // find ulElementId
  const ulElement = document.getElementById(ulElementId);
  if (!ulElement) return;
  for (const todo of todoList) {
    const liElement = createTodoElement(todo);
    // add li element to ul element
    ulElement.appendChild(liElement);
  }
}

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem("todo_list")) || [];
  } catch {
    return [];
  }
}
function handleSubmitTodoForm(event) {
  event.preventDefault();

  // get todo list from localStorage
  const todoList = getTodoList();

  // find todo input
  const todoInput = document.getElementById("todoText");
  if (!todoInput || todoInput.value === "") return;

  // create new todo object
  const newTodo = {
    id: Date.now(),
    title: todoInput.value,
    status: "pending",
  };

  // add todo item to todoList
  todoList.push(newTodo);

  // update todo list to localStorage
  localStorage.setItem("todo_list", JSON.stringify(todoList));

  // reset todo input to empty string
  todoInput.value = "";

  // find ul element
  const ulElement = document.getElementById("todoList");
  if (!ulElement) return;

  // update todo to UI
  const newTodoElement = createTodoElement(newTodo);
  ulElement.appendChild(newTodoElement);
}

// main function
(() => {
  const todoList = getTodoList();
  renderTodoList(todoList, "todoList");

  // register submit event for form todo
  const todoForm = document.getElementById("todoForm");
  todoForm.addEventListener("submit", handleSubmitTodoForm);

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
    renderTodoList(todoList, "todoList");
  });
})();
