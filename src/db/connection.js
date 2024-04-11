import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import dotenv from "dotenv";


dotenv.config();

const uri = process.env.URI;


export async function connectToDatabase() {
    const client = new MongoClient(uri, {
        serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        }
    });

    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
}




export async function getAll() {
    let client = await connectToDatabase();
  
    try {
        const database = client.db('labDB');
        const collection = database.collection("recipes");
        
        const query = {};
        const cursor = await collection.find(query).toArray();
        return cursor;

    } finally {
        await client.close();
    }
}



export async function getRecipe(title) {
    let client = await connectToDatabase();

    try {
        const database = client.db('labDB');
        const collection = database.collection("recipes");

        const query = {title: title};
        const cursor = await collection.find(query).toArray();
        return cursor;

    } catch (err) {
        console.log("Something went wrong", err)
    }
    
    finally {
        await client.close();
    }
}

export async function newRecipe({title, ingredients, instructions, cookingTime}) {
    let client = await connectToDatabase();

    try {
        const database = client.db('labDB');
        const collection = database.collection("recipes");

        const doc = {
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            cookingTime: cookingTime
        };
        const cursor = await collection.insertOne(doc);
        return cursor;

    } catch (err) {
        console.error("Something went wrong", err)
    } finally {
        await client.close()
    }
}

export async function editRecipe(id, newTitle, newIngredients, newInstructions, newCookingTime, res) {
    let client = await connectToDatabase();

    try {
        const database = client.db('labDB');
        const collection = database.collection("recipes");

        const recipe = await collection.findOne({ _id: new ObjectId(id) });

        console.log(recipe)

        if (!recipe) {
            res.status(404).send("Recipe not found");
        }

        const doc = {
            title: newTitle || recipe.title,
            ingredients: newIngredients|| recipe.ingredients,
            instructions: newInstructions || recipe.instructions,
            cookingTime: newCookingTime || recipe.cookingTime
        };

        // console.log(doc)

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: doc }
        );

        return result;

    } catch (err) {
        console.error("Id does not exist.", err)
    } finally {
        await client.close()
    }
}


export async function deleteRecipe(id, res) {
    let client = await connectToDatabase();

    try {
        const database = client.db('labDB');
        const collection = database.collection("recipes");

        const recipe = await collection.findOne({ _id: new ObjectId(id) });

        if (!recipe) {
            res.status(404).send("Recipe not found");
        }

        const result = await collection.deleteOne(
            { _id: new ObjectId(id) }
        );

        return result;


    } catch (error) {
        console.log(error);
    }
}




