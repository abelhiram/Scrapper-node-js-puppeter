const puppeteer = require('puppeteer');
const express = require('express');
const morgan = require('morgan');
var app = express();
const mysql = require('mysql');
const child_process = require('child_process');


var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'scrap'
});

app.use(morgan('tiny'));
app.set('view engine','ejs');

let todo = [];

async function scrapeLogs(){
    
    mysqlConnection.connect((err)=>{
        if(!err)
        console.log('ok');
        else
        console.log('no ok'+ JSON.stringify(err,undefined,2));
    });

    const dbcall = (query) => {
        return new Promise((resolve, reject) => {
            mysqlConnection.query(
                query,
                (error, rows, results) => {
                    if (error) return reject(error);
                    return resolve(rows);
                });
        });
    };

    try {
        const rows = await dbcall("SELECT * FROM scrap");
        rows.forEach(async (row) => {
            todo.push(row);
        });
    } catch (error) {
        console.log(error);
    }
    
}
    scrapeLogs();


app.get('/scrap', (req,res) =>{

    var len=0;
    let comando = child_process.spawn('cmd', ['/c', 'node scrap.js\n']);
    
    comando.stdout.on('data',function(data){
        console.log(data.toString());
    });
    comando.stderr.on('data',function(data){
        console.log(data.toString());
    });
    comando.on('exit',function(codigo){
        console.log(codigo.toString());
    });


    res.render('index.ejs', {todos: todo});
    
 
});

app.use(express.static('public'));

app.listen(3000, () =>{
    console.log('server 3000');
});