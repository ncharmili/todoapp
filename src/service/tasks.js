const { executeQuery } = require('../utils/database');
const { getUserById } = require('../service/user');
const { getCategoryById } = require('../service/categories');

async function createTask(req, res) {
    let body = req.body;
    let validatedRequest = await validateRequest(req.params.id, body.category_id);
    if( !validatedRequest.valid) {
        return res.status(400).send({ message: validatedRequest.message }); 
    }
    let response = await executeQuery(`INSERT INTO tasks(user_id, title, description, status, parent_task_id, 
        category_id, due_date)
    values (${req.params.id}, '${body.title}', '${body.description}', '${body.status || 'Pending'}', ${body.parent_task_id || 0}, 
    ${body.category_id}, '${body.due_date}')`);
    if(response.error) {
        return res.status(500).send({ message: response.error });
    }
    res.status(201).send({ message: `Task successfully created` });
}

async function getUserTasks(req, res) {
    let validatedRequest = await validateRequest(req.params.id);
    if( !validatedRequest.valid) {
        return res.status(400).send({ message: validatedRequest.message }); 
    }

    let query = `select * from tasks where user_id = ${req.params.id}`;
    Object.keys(req.body).forEach( key => {
        switch(key) {
            case 'title':
            case 'description':
                query += ` and ${key} like '%${req.body[key]}%'`;
                break;
            case 'status':
                query += ` and status= '${req.body.status}'`
                break;
            case 'category_id':
            case 'parent_task_id':
                query += ` and ${key} = ${req.body[key]}`
                break;
            case 'due_date_from':
                query += ` and due_date >= ${req.body.due_date_from}`
                break;
            case 'due_date_to':
                query += ` and due_date <= ${req.body.due_date_to}`
                break;  
        }
    })
    let response = await executeQuery(query);
    if(response.error) {
        return res.status(500).send({ message: response.error });
    }
    const sortField = req.body.sortBy || 'Title';
    res.status(201).send({ response: response.sort((a, b) => (a[sortField] > b[sortField]) ? 1 : -1) });
}

async function validateRequest(user_id, category_id = null) {
    if(! await getUserById(user_id)) {
        return {
            valid: false,
            message: "User not found"
        }
    }
    if(category_id && ! await getCategoryById(category_id)) {
        return {
            valid: false,
            message: "Caategory not found"
        }
    }
    return {
        valid: true
    }
}

module.exports = {
    createTask,
    getUserTasks,
}