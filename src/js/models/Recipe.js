import axios from "axios";
export default class Recipe {
  constructor(id) {
    this.id = id;
  }
  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );

      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.ingredients = res.data.recipe.ingredients;
      this.title = res.data.recipe.title;
      this.url = res.data.recipe.source_url;
    } catch (error) {
      console.log(error);
      alert("Fuck You Mother Fucker!");
    }
  }
  calcTime() {
    // Assum that each 3 ingredients take 15minutes to cook
    let numIng = this.ingredients.length;
    let periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServing() {
    this.serVing = 4;
  }
  parseRecipe() {
    // Change format : (tablespoons -> tbsp , ...vv)
    const unitLong = [
      "teaspoons",
      "teaspoon",
      "cups",
      "cup",
      "ounces",
      "ounce",
      "tablespoons",
      "tablespoon",
    ];
    const unitShort = ["tsp", "tsp", "cup", "cup", "oz", "oz", "tbsp", "tbsp"];
    const units = [...unitShort, "kg", "g"];
    //                                1 1/2 tbsp olive oil, divided
    const newIngredient = this.ingredients.map((el) => {
      let ingredient = el.toLowerCase();

      unitLong.forEach((unit, index) => {
        // Uniform Unit  ( "1 1/2 cups abcxyz" -> "1 1/2 cup abcxyz")
        ingredient = ingredient.replace(unit, unitShort[index]);
      });
      // 1-1/3 cup shortening -> ["1-1/3" , "cup" , "shortening"]
      // arrCount= ["1-1/3"]
      //
      //
      //
      // Remove parathensese ("abcxyz (cai dkm gi do )"  ->   "abcxyz")
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      const ingredientsSplit = ingredient.split(" ");

      const unitIndex = ingredientsSplit.findIndex((el2) =>
        units.includes(el2)
      );

      // "1 1/2 cups abcxyz"

      // "2 abcxyz"
      // "1-1/2 tsp abcxyz"
      let obj;
      if (unitIndex > -1) {
        // TH1: Have count Have unit Ingredients VD: "4 tsp abcxyz" "4 1/2 tsp abc" "4-1/2 cup abc"

        const arrCount = ingredientsSplit.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          /*  count = eval(arrCount[0].replace("-", "+")); */
          count = eval(ingredientsSplit[0].replace("-", "+"));
        } /* else if (arrCount.length > 1) {
          count = eval(arrCount.join("+"));
        } */ else {
          count = eval(ingredientsSplit.slice(0, unitIndex).join("+"));
        }
        obj = {
          count,
          unit: ingredientsSplit[unitIndex],
          /* ingredient: ingredientsSplit[unitIndex + 1].join(" "), */
          ingredient: ingredientsSplit.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(ingredientsSplit[0], 10)) {
        // TH2:  Number 1st Place , 0 unit , ingredients VD: "2 abcxyz" "3 abc xyz"
        obj = {
          count: eval(parseInt(ingredientsSplit[0], 10)),
          unit: " ",
          ingredient: ingredientsSplit.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // TH3 : 0 count 0 unit ingredient  VD:  "abcxyz" , "abc xyz mnd"
        obj = {
          count: 1,
          unit: " ",
          ingredient,
        };
      }

      return obj;
    });
    /* console.log(newIngredient); */
    this.ingredients = newIngredient;
    // Output : count: " " , unit: " " , ingredients: " "
  }
  updateServing(type) {
    const newServing = type === "dec" ? this.serVing - 1 : this.serVing + 1;
    this.ingredients.forEach((el) => {
      el.count = el.count * (newServing / this.serVing);
    });
    this.serVing = newServing;
  }
}
