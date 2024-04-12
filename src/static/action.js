
async function logRecipes() {
    const response = await fetch("/api/recipes");
    const recipes = await response.json();
    return recipes;
    // console.log(recipes);
}


document.addEventListener("DOMContentLoaded", () => {
    logRecipes()
        .then(data => {
            console.log(data)
            const table = document.querySelector('.table');
            table.innerHTML = '';
    
    
            data.forEach(recipe => {
                const row = table.insertRow();
                row.classList.add("row")
                const titleCell  = row.insertCell(0);
                const ingredientsCell = row.insertCell(1);
                let instructionsCell = row.insertCell(2);
                const cookingTimeCell = row.insertCell(3);
                const editButtonCell = row.insertCell(4);
                const deleteButtonCell = row.insertCell(5);

                const id = recipe._id;

                const titleInput = document.createElement("input");
                titleInput.type = "text";
                titleInput.value = recipe.title;
                titleCell.appendChild(titleInput);

                const ingredientsInput = document.createElement("textarea");
                ingredientsInput.classList.add("small-area")
                ingredientsInput.type = "text";
                ingredientsInput.value = recipe.ingredients;
                ingredientsCell.appendChild(ingredientsInput);

                const instructionsInput = document.createElement("textarea");
                instructionsInput.classList.add("large-area")
                instructionsInput.type = "text";
                instructionsInput.value = recipe.instructions;
                instructionsCell.appendChild(instructionsInput);

                const cookingTimeInput = document.createElement("input");
                cookingTimeInput.type = "text";
                cookingTimeInput.value = recipe.cookingTime;
                cookingTimeCell.appendChild(cookingTimeInput);


    
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete")
                deleteButton.textContent = "Delete"
                const editButton = document.createElement("button");
                editButton.classList.add("edit")
                editButton.textContent = "Edit"
    
                editButtonCell.appendChild(editButton);
                deleteButtonCell.appendChild(deleteButton);


                


                editButton.addEventListener("click", async () => {
                    console.log("Attempting to edit...")
                    
                    const newTitle = titleInput.value;
                    const newIngredients = ingredientsInput.value;
                    const newInstructions = instructionsInput.value;
                    const newCookingTime = cookingTimeInput.value;

                    const updatedData = {
                        title: newTitle || recipe.title,
                        ingredients: newIngredients || recipe.ingredients,
                        instructions: newInstructions || recipe.instructions,
                        cookingTime: newCookingTime || recipe.cookingTime
                    };

                    try {
                        const response = await fetch(`/api/recipes/${id}`, {
                            // `http://localhost:5000/api/recipes${id}`
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updatedData)
                        });

                        const updatedRecipe = await response.json();
                        console.log('Recipe updated successfully:', updatedRecipe);

                    } catch (error) {
                        console.log(error)
                    }
                })

                deleteButton.addEventListener("click", async () => {
                    const confirmed = window.confirm("Do you want to delete this recipe?");

                    if (confirmed) {
                        console.log("Attempting to delete...")
                        try {
                            const response = await fetch(`/api/recipes/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            })
                            
                            if (response.ok) {
                                console.log('Recipe deleted successfully');
                                window.location.reload();
                                alert("Recipe was deleted")
                            } else {
                                console.error("Failed to delete.")
                            }
    
                        } catch (error) {
                            console.error(error)
                        }
                    }


                })
            })
            addRecipe()

            function addRecipe() {
                const title = document.createElement("input");
                title.type = "text";
                title.placeholder = "Add Title"
                // title.value = "";
                // titleCell.appendChild(title);

                const ingredients = document.createElement("textarea");
                ingredients.classList.add("small-area")
                ingredients.type = "text";
                ingredients.placeholder = "Add Ingredients";
                // ingredients.value = "";
                // ingredientsCell.appendChild(ingredients);

                const instructions = document.createElement("textarea");
                instructions.classList.add("large-area")
                instructions.placeholder = "Add instructions";
                // instructions.type = "text";

                const cookingTime = document.createElement("input");
                cookingTime.type = "text";
                cookingTime.placeholder = "Add CookingTime"
                // cookingTime.value = "";
                // titleCell.appendChild(title);

                const add = document.querySelector(".add");
                add.appendChild(title)
                add.appendChild(ingredients)
                add.appendChild(instructions)
                add.appendChild(cookingTime)

                const submit = document.createElement("button");
                submit.textContent = "Submit";

                add.appendChild(submit)

                submit.addEventListener('click', async () => {

                    // const tiInput = title.value;
                    // const ingInput = ingredients.value;
                    // const insInput = instructions.value;
                    // const cookInput = cookingTime.value;

                    const newDoc = {
                        title: title.value,
                        ingredients: ingredients.value,
                        instructions: instructions.value,
                        cookingTime: cookingTime.value
                    }

                    try {
                        const response = fetch(`/api/recipes/`, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newDoc)
                        })

                        const added = (await response).json();
                        window.location.reload()
                        console.log("Recipe was added successfully", added)
                        

                    } catch {

                    }
                })

            }

        })
        .catch(error => {
            console.error(error)
        })
})


