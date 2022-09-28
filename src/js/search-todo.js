function getAllLiElements() {
  return document.querySelectorAll("ul#todoList > li");
}
function isMatchValue(liElement, searchTerm) {
  // if the search term is empty, then return all todo list
  if (searchTerm === "") return true;
  // else
  const todoTitle = liElement.querySelector("p.todo__title");
  if (!todoTitle) return false;
  return todoTitle.textContent.toLowerCase().includes(searchTerm.toLowerCase());
}
function searchTodo(searchTerm) {
  // for each element from todo element list
  for (const todoElement of getAllLiElements()) {
    // check if searchTerm matches with todo title so show that todo element
    const needToShow = isMatchValue(todoElement, searchTerm);
    todoElement.hidden = !needToShow;
  }
}
function initSearchInput() {
  // find input searchTerm
  const searchInput = document.getElementById("searchTerm");
  if (!searchInput) return;

  // add input event to searchInput
  searchInput.addEventListener("input", () => {
    window.location.href += searchTodo(searchInput.value);
  });
}
// main
(() => {
  // flow search
  // 1. find element and add input event
  // 2. for each element list and check searchTerm matches with todoElement'title
  // if true -> show todo element
  // else hidden todo element
  initSearchInput();
})();
