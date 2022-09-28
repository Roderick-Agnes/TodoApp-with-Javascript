function getAllLiElements() {
  return document.querySelectorAll("ul#todoList > li");
}
function isMatchValue(liElement, filterValue) {
  // if filterValue is 'all', then return all todo list
  if (filterValue === "all") return true;
  // else
  if (!liElement) return false;
  return liElement.dataset.status.toLowerCase().includes(filterValue.toLowerCase());
}
function filterTodo(filterValue) {
  // for each element from todo element list
  for (const todoElement of getAllLiElements()) {
    // check if filterValue matches with todo title so show that todo element
    const needToShow =
      filterValue === "all" || todoElement.dataset.status === filterValue;
    todoElement.hidden = !needToShow;
  }
}
function initFilterInput() {
  // find filter selector
  const filterTodos = document.getElementById("filterTodos");
  if (!filterTodos) return;

  // add change event to filterTodos
  filterTodos.addEventListener("change", () => {
    filterTodo(filterTodos.value);
    console.log(filterTodos.value);
  });
}
// main
(() => {
  // flow filter
  // similar flow search input
  initFilterInput();
})();
