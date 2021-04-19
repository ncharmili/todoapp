
const { executeQuery } = require('../utils/database');

async function getAllCategories(req, res) {
    let response = await executeQuery(`select * from categories`);
    if(response.error) {
        return res.status(500).send({ message: response.error });
    }
    res.status(200).send({ response});
}

async function createCategory(req, res) {
    if(await categoryExists(req.body.name)) {
        return res.status(403).send({ message: "Category already exist" });
    }
    let response = await executeQuery(`INSERT INTO categories(name)
    values ('${req.body.name}')`);
    if(response.error) {
        return res.status(500).send({ message: response.error });
    }
    res.status(201).send({ message: `Category ${req.body.name} successfully created` });
}

async function categoryExists(name) {
    let response = await executeQuery(`select * from categories where name='${name}'`);
    return response.length > 0 ;
}

async function getCategoryById(categoryId) {
    let response = await executeQuery(`select * from categories where category_id=${categoryId}`);
    return response.length > 0 ;
}

module.exports = {
    getAllCategories,
    createCategory,
    getCategoryById
}