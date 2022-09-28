function getAllLiElements() {
  return document.querySelectorAll("ul#todoList > li");
}
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
function handleFilterChange(filterName, filterValue) {
  // set query params to url
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  window.history.pushState({}, "", url);

  // for each element from todo element list
  for (const todoElement of getAllLiElements()) {
    // check if all conditon true
    const needToShow = isMatchAll(todoElement, url.searchParams);
    todoElement.hidden = !needToShow;
  }
}

function initFilterStatus(params) {
  // find filter selector
  const filterTodos = document.getElementById("filterTodos");
  if (!filterTodos) return;

  //check exist filter status and set selector value
  if (params.get("status")) {
    filterTodos.value = params.get("status");
  }

  // add change event to filterTodos
  filterTodos.addEventListener("change", () => {
    // set status param to url if event be actived
    handleFilterChange("status", filterTodos.value);
  });
}
function initSearchInput(params) {
  // find input searchTerm
  const searchInput = document.getElementById("searchTerm");
  if (!searchInput) return;

  //check exist searchTerm and set input value
  if (params.get("search")) {
    searchInput.value = params.get("search");
  }

  // add input event to searchInput
  searchInput.addEventListener("input", () => {
    // set search param to url if event be actived
    handleFilterChange("search", searchInput.value);
  });
}
// main
(() => {
  // get query params from url
  const params = new URLSearchParams(window.location.search);

  // flow filter
  // similar flow search input
  initFilterStatus(params);
  initSearchInput(params);
})();
