import { Elements } from "./base";

export const getInput = () => Elements.search__fieldDOM.value;
export const clearInput = () => {
  Elements.search__fieldDOM.value = "";
};
export const clearResults = () => {
  Elements.results__list.innerHTML = "";
  Elements.results__pages.innerHTML = "";
};
export const highlightedResult = (id) => {
  const resultArr = Array.from(document.querySelectorAll(".results__link"));
  resultArr.forEach((res) => {
    res.classList.remove("results__link--active");
  });

  document
    .querySelector(`a[href*="#${id}"]`)
    .classList.add("results__link--active");
};
export const renderResult = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = resPerPage * page;
  recipes.slice(start, end).forEach(renderRecipe);
  const numOfPage = Math.ceil(recipes.length / resPerPage);
  renderButton(page, numOfPage);
};

const createButton = (type, page) => {
  let button = `   <button class="btn-inline results__btn--${type}" data-goto=${page}>
    <span>Page ${page}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === "next" ? "right" : "left"
        }"></use>
    </svg>
</button>`;
  return button;
};
export const renderButton = (page, numOfPage) => {
  let button;
  if (page === 1 && numOfPage > 1) {
    // Create only next button
    button = createButton("next", 2);
    Elements.results__pages.insertAdjacentHTML("afterbegin", button);
  } else if (page === numOfPage && numOfPage > 1) {
    // Create only prev button
    button = createButton("prev", numOfPage - 1);
    Elements.results__pages.insertAdjacentHTML("afterbegin", button);
  } else if (page < numOfPage && page > 1) {
    // Create Both prev and next button

    button = `${createButton("prev", page - 1)} ${createButton(
      "next",
      page + 1
    )}`;
    Elements.results__pages.insertAdjacentHTML("afterbegin", button);
  }
};

const renderRecipe = (recipe) => {
  const markUp = `<li>
    <a class="results__link " href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
  Elements.results__list.insertAdjacentHTML("beforeend", markUp);
};
// Pasta with pesco cream sauce

/* 
[pasta , with , pesco , cream , sauce]
 5 : [pasta]
 9: [pasta , with]
 14: [pasta , with , pesco]
 14 + 5 = 19
*/
const limitRecipeTitle = (title, limit = 17) => {
  const newArr = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= 17) {
        newArr.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newArr.join(" ")} ...`;
  }

  return title;
};
