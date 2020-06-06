export const Elements = {
  searchDOM: document.querySelector(".search"),
  search__fieldDOM: document.querySelector(".search__field"),
  results__list: document.querySelector(".results__list"),
  results: document.querySelector(".results"),
  results__pages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
};
export const ElementsString = {
  loader: "loader",
};
export const loader = (parent) => {
  const loader = `
    <div class="loader">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>

  `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${ElementsString.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};
