const alasql = require('alasql');

const executeQuery = async (query) => {
    return alasql.promise(query)
    .then( data => { 
        console.log(data);
        return data 
    })
    .catch( err => {
        console.log(err);
        return { error: err } 
    } );
}

const runMigrations = async () => {
    await executeQuery(`CREATE TABLE users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username STRING,
        firstname STRING,
        lastname STRING,
        email STRING)`);

    await executeQuery(`CREATE TABLE tasks (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title STRING,
        description STRING,
        status STRING,
        parent_task_id INTEGER,
        category_id STRING,
        due_date DATE )`);
        
    await executeQuery(`CREATE TABLE categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name STRING)`);

    //Load some dummy data
    
    await executeQuery(`INSERT INTO users(firstname, lastname, username, email)
        values ('charmili', 'narra', 'cnarra', 'charmili.narra@gmail.com')`);
    await executeQuery(`INSERT INTO categories(name)
        values ('shopping'), ('travel'), ('cooking'), ('projects')`);
    await executeQuery(`INSERT INTO tasks(user_id, title, description, status, parent_task_id, 
        category_id, due_date)
        values (1, 'Buy groceries', 'Buy chicken, veggies', 'Pending', 0, 
        3, '2021-04-19 20:00:00'),(1, 'Book flight tickets', 'Book flight tickets to Hawaii', 'Pending', 0, 
        2, '2021-04-19 17:00:00'),(1, 'Complete testing and deployment of todo app', 'Test, deploy and notify of the deployment', 'Pending', 0, 
        4, '2021-04-22 00:00:00'),(1, 'Buy groceries', 'Buy chicken, veggies', 'Pending', 0, 
        3, '2021-05-01 00:00:00'),(1, 'Book rental car', 'Book rental cars to Hawaii', 'Pending', 0, 
        2, '2021-06-01 00:00:00')`);
}

const getMySQLFriendlyDate = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = {
    runMigrations,
    executeQuery,
    getMySQLFriendlyDate
}