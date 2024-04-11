import { Router } from "express";
import { getAll, getRecipe, newRecipe, editRecipe, deleteRecipe } from "../db/connection.js";


// console.log(getAll());

const recipeRouter = Router();

recipeRouter.get('/recipes', async (req, res) => {
    try {
        const documents = await getAll();
        res.json(documents)
    } catch (error) {
        console.error(error)
    }
});

recipeRouter.get('/recipes/:title', async (req, res) => {
    try {
        //  params: { title: 'Cheesecake' },
        const document = await getRecipe(req.params.title);
        if (document.length === 0) {
            res.send(`Recipe: ${req.params.title} does not exist.`);
            return;
        } 
        res.json(document);

    } catch (err) {
        console.error('Error retrieving recipe', err);
        res.status(500).send("Error retrieving recipe.");
    }
})

recipeRouter.post('/recipes/', async (req, res) => {
    try {
        const recipes = await getAll();
        
        const recipeExists = recipes.some(recipe => recipe.title === req.body.title);

        if (recipeExists) {
            // res.send("This recipe already exists. ")
            res.status(409).send("409 Conflict. Recipe already exists.")
            return;
        } 

        const result = await newRecipe(req.body);
          
        res.status(201).json({ message: "201 Created. Recipe was added successfully.", recipe: req.body, result})

    } catch (err) {
        console.error(err)
        res.status(500).send("Internal Server error");
    }
})

recipeRouter.put('/recipes/:id', async (req, res) => {
    const newData = req.body;
    // console.log(newData)
    const id = req.params.id
    console.log(id)

    try {
        
        const updateData = await editRecipe(id, newData.title, newData.ingredients, newData.instructions, newData.cookingTime, res)
        // console.log(updateData)

        res.json(updateData)

    } catch (error) {
        console.error("Internal server error.",error);
        
    }
})

recipeRouter.delete('/recipes/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteDoc = await deleteRecipe(id, res);

        // res.json(`Document has been deleted. ${deleteDoc.title}`)
        res.status(204).end();

    } catch (error) {
        console.error("Internal server error", error)
    }
})


export default recipeRouter