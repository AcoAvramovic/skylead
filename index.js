var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyparser = require('body-parser');

var app = express();

app.use(cors());
app.use(bodyparser.json());

app.listen('3000', ()=>{
    console.log('server is running');
})


//mysql connection

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'tasks'
});

db.connect((err)=>{
    if (err) throw err;
    else{
        console.log('database connect')
    }
})

app.get('/api',(req,res)=>{
    res.send('Api working');
});

//CREATE TASK

app.post('/api/createTask',(req,res)=>{
    
    let sql = ` insert into tasks.task (title, description, idS, idU) values('${req.body.title}', '${req.body.description}', 
                (select s.idS from status s where s.opisStatus='${req.body.opisStatus}'), (select u.idU from user u where u.ime='${req.body.ime}'));`;
    db.query(sql,(err,result)=>{
            if(err) throw err;
            res.send('data inserted');
    });        


});

//GET TASK

app.get('/api/getTask',(req,res)=>{
    let sql = `SELECT * FROM tasks.task;`;
    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    });
})

//EDIT TASK

app.put('/api/update/:id',(req,res)=>{
   
    let sql = `UPDATE tasks.task set idS=(select s.idS from status s where s.opisStatus='${req.body.opisStatus}') where idT='${req.params.id}'`;
 
    db.query(sql,(err,result)=>{
            if(err) throw err;
            res.send('data updated');
    })            
})

//DELETE TASK

app.delete('/api/delete/:id',(req,res)=>{

        let sql = `DELETE from tasks.task where idT='${req.params.id}'`;

        db.query(sql,(err,result)=>{
            if(err) throw err;
            res.send('data deleted');
        }); 
        
});