const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
app.use(bodyParser.json())

let conn = null

const connectMySQL = async () => {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employee_management',
      port: 8889
    })
  }
  app.get('/users', async (req,res) => {
    const results = await conn.query('SELECT * FROM employees')
    res.json(results[0])
  })
  app.post('/users', async (req, res) => {
    try{ 
        let user = req.body
        const results = await conn.query('INSERT INTO employees SET ?',user )
        
        res.json({
            message: 'insert ok',
            data: results[0]
        })

    }catch(error){
        console.error('error message', error.message)
        res.status(500).json({
           message: 'something wrong',
        //    errorMessage: error.mssage  ใช้สำหรับตอนdev
        })
    }
  })
  app.get('/users/:id', async (req, res) => {
    try{
        let id = req.params.id
        const results = await conn.query('SELECT * FROM employees WHERE id = ?', id)
        
        if (results[0].length == 0) {
            throw { statusCode: 404, message: 'not Found'}
        // }else{
            // throw new Error('not found')
            // res.status(404),json ({
            //     message: 'not found'
            // })
        }
        res.json(results[0][0])
    } catch (error) {
      console.error('error message', error.message)
      let statusCode = error.statusCode || 500
      res.status(statusCode).json({
        message: 'something wrong',
        errorMessage: error.message
      })
    }
  })
  app.put('/users/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const updateUser =req.body;
        const [results] = await conn.query(
            'UPDATE employees SET ? WHERE id = ?',
            [updateUser, id]
        )
        res.json({
            message: 'Update successful',
            data: results
        });
    } catch (error) {
        console.error('Error message:', error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
app.delete('/users/:id', async (req, res) => {
 try{
    const id = req.params.id
    const results = await conn.query('DELETE FROM employees WHERE id = ?',id)
    res.json({
        message: 'delete ok',
        data: results[0]
    })
 }catch (error) {
    console.error('error message', error.message)
    res.status(500).json({
        message: 'something wrong'
    })
 }
})

app.listen(8000, async () => {
    await connectMySQL()
    console.log('Server started on port 8000')
  })