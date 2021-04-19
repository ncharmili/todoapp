const { executeQuery, getMySQLFriendlyDate } = require('../utils/database');
let alreadyNotifiedUserTaks = {};
const nodemailer = require('nodemailer');

async function notify() {
    const currentDate = new Date();
    const nexttOneHour = new Date(currentDate);
    nexttOneHour.setHours(currentDate.getHours() + 24);
    let tasks = await executeQuery(`select task_id, title, description, firstname, email, due_date
     from tasks t join users u  on t.user_id = u.user_id
     where due_date between '${getMySQLFriendlyDate(currentDate)}' and '${getMySQLFriendlyDate(nexttOneHour)}'`);
    console.log(tasks);
    tasks.forEach( task => {
        if(!alreadyNotifiedUserTaks[task.task_id]) {
            sendMail(task.email, `You have a todo item ${task.title} due by ${task.due_date}`);
            alreadyNotifiedUserTaks[task.task_id] = true;
        }
    });
}

function sendMail(email, subject) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'email',
          pass: 'password'
        }
      });
      
    const mailOptions = {
        from: 'email',
        to: email,
        subject: subject,
        text: subject
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    notify
}