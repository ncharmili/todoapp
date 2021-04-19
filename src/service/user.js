
const { executeQuery } = require('../utils/database');

async function getAllUsers(req, res) {
    let response = await executeQuery(`select * from users`);
    if(response.error) {
        return res.status(500).send({ message: response.error });
    }
    res.status(200).send({ response});
}

async function createUser(req, res) {
    if(await userExists(req.body.username, req.body.email)) {
        return res.status(403).send({ message: "User with that email or username already exist" });
    }
    let response = await executeQuery(`INSERT INTO users(firstname, lastname, username, email)
    values ('${req.body.firstname}', '${req.body.lastname}', '${req.body.username}', '${req.body.email}')`);
    if(response.error) {
        return res.status(500).send({ message: response.error });
    }
    res.status(201).send({ message: `User ${req.body.username} successfully created` });
}

async function userExists(username, email) {
    let response = await executeQuery(`select * from users where username='${username}' or email = '${email}'`);
    return response.length > 0 ;
}

async function getUserById(userId) {
    let response = await executeQuery(`select * from users where user_id=${userId}`);
    return response.length > 0 ;
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById
}