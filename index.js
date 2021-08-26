const express = require('express');
var app = express();
const mysql = require('mysql');
var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'scrap'
});
let arrayData = [];
async function hunted(){
        
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
        const rows = await dbcall("SELECT * FROM hunted");
        rows.forEach(async (row) => {
            arrayData.push(row.nombre);
        });
    } catch (error) {
        console.log(error);
    }
    
}

hunted();
app.get('/', (req,res) =>{
    res.send(arrayData);
});

app.listen(3000, () =>{
    console.log('server 3000');
});