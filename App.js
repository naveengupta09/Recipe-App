const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const recipeDetails = document.querySelector(".recipe-details");
const recipeOverlay = document.querySelector(".recipe-overlay");

// Function to get recipes
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML =
    '<div class="spinner"></div><h2>Fetching Recipes...</h2>';

  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    recipeContainer.innerHTML = "";

    if (!response.meals) {
      recipeContainer.innerHTML = `<h2>No recipes found for "${query}". Try another search!</h2>`;
      return;
    }

    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <h3>${meal.strMeal}</h3>
                        <p><span>${meal.strArea}</span> Dish</p>
                        <p>Category: <span>${meal.strCategory}</span></p>
                    `;

      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = `<div class="error-message"><h2>Error in Fetching Recipes</h2><p>Please check your internet connection and try again.</p></div>`;
    console.error("Error:", error);
  }
};

// Function to fetch Ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient && ingredient.trim()) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
                <h2 class="recipeName">${meal.strMeal}</h2>
                <div class="recipe-tags">
                    <span class="tag"><i class="fas fa-globe"></i> ${
                      meal.strArea
                    }</span>
                    <span class="tag"><i class="fas fa-utensils"></i> ${
                      meal.strCategory
                    }</span>
                </div>
                <h3><i class="fas fa-list"></i> Ingredients:</h3>
                <ul class="ingredientList">${fetchIngredients(meal)}</ul>
                <div class="recipeInstructions">
                    <h3><i class="fas fa-clipboard-list"></i> Instructions:</h3>
                    <p>${meal.strInstructions}</p>
                </div>
                ${
                  meal.strYoutube
                    ? `
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${meal.strYoutube}" target="_blank" style="color: #fff; background-color: #f44336; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
                            <i class="fab fa-youtube"></i> Watch Video Tutorial
                        </a>
                    </div>
                `
                    : ""
                }
            `;
  recipeDetails.classList.add("show");
  recipeOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
};

const closeRecipePopup = () => {
  recipeDetails.classList.remove("show");
  recipeOverlay.classList.remove("show");
  document.body.style.overflow = "auto";
};

recipeCloseBtn.addEventListener("click", closeRecipePopup);
recipeOverlay.addEventListener("click", closeRecipePopup);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && recipeDetails.classList.contains("show")) {
    closeRecipePopup();
  }
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Please type a meal name in the search box.</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

window.addEventListener("load", () => {
  const randomSearches = ["chicken", "pasta", "beef", "cake", "soup"];
  const randomSearch =
    randomSearches[Math.floor(Math.random() * randomSearches.length)];
  fetchRecipes(randomSearch);
});