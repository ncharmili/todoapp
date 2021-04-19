const express = require('express')
const app = express()
app.use(express.json());
const port = 3000
const user = require('./src/routes/user.js');
const tasks = require('./src/routes/tasks.js');
const categories = require('./src/routes/categories.js');
const { notify } = require('./src/service/notifications');

const { runMigrations } = require('./src/utils/database');
const cron = require('node-schedule');


runMigrations();

app.get('/health', (req, res) => {
  res.send('App healthy');
});

app.use('/users', user);
app.use('/tasks', tasks);
app.use('/categories', categories);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

cron.scheduleJob('* * * * *', async() => await notify());
