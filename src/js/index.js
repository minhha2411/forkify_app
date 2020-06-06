// Global app controller
import Search from "./models/Search";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { Elements, loader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";

/* 
 State: 
    1. Search Object
    2. Recipe Object
    3. Shoppinglist Object
    4. Like Object

*/
const state = {};

/* ----------  Search ------------------  */
const SearchController = async () => {
  //1 . get Input from the view
  const query = searchView.getInput();

  if (query) {
    //2. add search object to the state
    state.Search = new Search(query);
    try {
      //3. Prepare for the UI
      searchView.clearInput();
      searchView.clearResults();
      loader(Elements.results);
      //4. get result
      await state.Search.getResult();
      //5. render the result to the UI
      clearLoader();
      searchView.renderResult(state.Search.result, 1);
    } catch (error) {
      alert("Searching processing went wrong :( ");
      clearLoader();
    }
  }
};

Elements.searchDOM.addEventListener("submit", (e) => {
  e.preventDefault();
  SearchController();
});
Elements.results__pages.addEventListener("click", (e) => {
  let button = e.target.closest(".btn-inline");

  if (button) {
    let goToPage = parseInt(button.dataset.goto);
    clearLoader();
    searchView.clearResults();
    searchView.renderResult(state.Search.result, goToPage);
  }
});

/* ---------- End Of Search ------------------  */

/* ---------- Recipe ------------------  */
/* const r = new Recipe(2803);
r.getRecipe();
console.log(r); */
//
const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  if (id) {
    // UI prepare
    if (state.Search) searchView.highlightedResult(id);
    recipeView.clearRecipe();
    loader(Elements.recipe);
    // Create a recipe object , add to the state
    state.Recipe = new Recipe(id);
    try {
      // Get recipe
      await state.Recipe.getRecipe();

      state.Recipe.parseRecipe();

      // Calc Serving and Time
      state.Recipe.calcTime();
      state.Recipe.calcServing();

      // Render recipe to the UI
      clearLoader();

      recipeView.renderRecipe(state.Recipe);
      console.log(state.Recipe);
    } catch (error) {
      console.log(error);

      alert("Recipe processing went wrong :(");
    }
  }
};
["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, controlRecipe);
});
// Button inc or dec Event Handller
Elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease , .btn-decrease *")) {
    if (state.Recipe.serVing > 1) {
      state.Recipe.updateServing("dec");
      recipeView.updateServingView(state.Recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.Recipe.updateServing("inc");
    recipeView.updateServingView(state.Recipe);
  }
});

/* ---------- End Of Recipe------------------  */
/* ---------------- List  --------------------  */
window.l = new List();

/* ---------------- End of List  --------------------  */
