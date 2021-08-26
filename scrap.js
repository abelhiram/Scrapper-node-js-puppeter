const puppeteer = require('puppeteer');
const express = require('express');
const morgan = require('morgan');
var app = express();
const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'scrap'
});


async function scrapeLogs(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    
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
        
        let arrayData = [];
        try {
            const rows = await dbcall("SELECT * FROM hunted");
            rows.forEach(async (row) => {
                arrayData.push(row.nombre);
            });
        } catch (error) {
            console.log(error);
        }


    for (const value of arrayData) {
        await page.goto("https://mediviastats.info/characters.php?name="+value);

    const [el] = await page.$x('/html/body/div[1]/center/div[1]/h2[1]/a');
    const txt = await el.getProperty('textContent');
    const nombre = await txt.jsonValue();

    const [el2] = await page.$x('/html/body/div[1]/center/div[1]/table[1]/tbody/tr[6]/td');
    const txt1 = await el2.getProperty('textContent');
    const lastLogin = await txt1.jsonValue();

    const [el3] = await page.$x('/html/body/div[1]/center/div[1]/table[1]/tbody/tr[7]/td');
    const txt2 = await el3.getProperty('textContent');
    const status = await txt2.jsonValue();

    const [el4] = await page.$x('/html/body/div[1]/center/div[1]/table[1]/tbody/tr[5]/td');
    const txt3 = await el4.getProperty('textContent');
    const residencia = await txt3.jsonValue();

    const [el5] = await page.$x('/html/body/div[1]/center/div[1]/table[1]/tbody/tr[2]/td');
    const txt4 = await el5.getProperty('textContent');
    const profesion = await txt4.jsonValue();

    const [el6] = await page.$x('/html/body/div[1]/center/div[1]/table[1]/tbody/tr[3]/td');
    const txt5 = await el6.getProperty('textContent');
    const nivel = await txt5.jsonValue();

    var res = residencia;
    if (res == "Ab'dendriel")
    res = 'Ab dendriel';
    else
    res = residencia;
   
    var sql = "INSERT INTO scrap (nombre, nivel, profesion, estatus, lastlogin, residencia) VALUES ('"+nombre+"', '"+nivel+"', '"+profesion+"', '"+status+"', '"+lastLogin+"', '"+res+"')";  

    mysqlConnection.query(sql, function (err) {  
        if (err) throw err;  
        console.log(nombre);  
    });  
    
    }

    

}
    scrapeLogs();


