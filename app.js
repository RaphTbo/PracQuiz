const express = require('express')
const mysql= require('mysql2');
const app = express()
const port = 3000




const dbConnect=mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"root",
    database:"node_mysql",
});

dbConnect.connect((error)=>{
    if(error){
        throw error
    }
    console.log("Online")
});

app.get('/db', (req, res) => {
    console.log("Access DB Route page");
    let sql = 'CREATE DATABASE if not exists node_mysql';
    dbConnect.query(sql, (error, result) => {
        if (error) {
            console.log(error.message);
            throw error;
        }
        console.log(result);
        res.send('A new database was created!');
    });
});

app.get('/users',(req,res)=>{
  console.log('Accessing')
  let name='Rapha'
  let email='rapha@email.com'
  const sql='INSERT INTO users (name,email)VALUES(?,?)';
  console.log('executing sql query:',sql);
  console.log('with values:',[name,email]);
  dbConnect.query(sql,[name,email],(err,result)=>{
    if(err){
      console.error(err);
    }
    console.log(result);
    res.send("User was added");
  });
});


app.listen(port,()=>{
  console.log('Express App Server listening on port ${port} and the local server URL: http://localhost:3000/');
});

app.get('/selectall',(req,res)=>{
  const sql='SELECT * FROM users ';
  dbConnect.query(sql,(err,records)=>{
    if(err){
      throw err;
    }
    console.log(records);
    res.send('All users')
  });
});

app.get('/select/:id', (req, res) => {
  const sql = `SELECT * FROM users WHERE id= ${req.params.id}`;
  // Creating queries 
  dbConnect.query(sql, (err, record) => {
      if (err) {
          throw err;
      }
      console.log(record);
      res.send('One user');
  });
});

app.get('/update/:id',(req,res)=>{
  let name='Bastien'
  const sql=`UPDATE users SET name= '${name}' WHERE id= ${req.params.id}`;
  dbConnect.query(sql,(err,record)=>{
    if(err){
      throw err;
    }
    console.log(record);
    res.send('Updated');
  });
});

app.get('/delete/:id',(req,res)=>{
  const sql=`DELETE FROM users WHERE id=${req.params.id}`;
  dbConnect.query(sql,(err,result)=>{
    if(err){
      throw err;
    }
    console.log(result);
    res.send('User was deleted')
  })
})