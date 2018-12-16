const express = require('express');
const pg = require('pg');


//Connect Express Server to Postgress
const config = {
  user: 'postgres',
  database: 'json2',
  password: 123456,
  port: 5432,
}
// Query postgress using pool
const pool = new pg.Pool(config);


//creates routes for different requests
const router = express.Router()



router.get('/products', (req, res) => {
  pool.connect()
    .then(() => {
      const sql = 'SELECT * FROM products;'
      return pool.query(sql)
    })
    .then(data => {
      res.send(data.rows)
    })
})


router.post('/orders', (req, res) => {
  const {name, email, order_items} = req.body.orders;
  pool.connect()
    .then(() => {
      const sql = 'INSERT INTO orders(name, email) VALUES ($1, $2), INSERT INTO order_items(product_id, qty) VALUES ($3, $4);'
      order_items.forEach(data => {
        const params = [name, email, data.product_id, data.qty]
        return pool.query(sql, params)
      })
    })
})





module.exports = router;