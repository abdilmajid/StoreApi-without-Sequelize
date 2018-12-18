const express = require('express');
const pg = require('pg');
const { Pool, Client} = require('pg')



//Connect Express Server to Postgress
// const config = {
//   user: 'postgres',
//   database: 'json2',
//   password: 123456,
//   port: 5432,
// }

const config = {
  host: 'localhost',
  port: 5432,
  database: 'json2',
  user: 'postgres',
  password: 123456,
  max: 1000
}

const pool = new Pool(config);
const client = new Client(config)

// Query postgress using pool
// const pool = new pg.Pool(config);


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


router.post('/orders', async(req, res) => {
  const {name, email, order_items} = req.body.orders;
  const sql1 = 'INSERT INTO orders(name, email) VALUES ($1, $2) RETURNING id'
  const sql2 = 'INSERT INTO order_items(order_id, product_id, qty) VALUES ($1, $2, $3)'
  const sql3 = 'SELECT orders.id, orders.name, orders.email, order_items.qty, products.price, products.image FROM order_items INNER JOIN orders ON order_items.order_id = orders.id INNER JOIN products ON order_items.product_id = products.id ORDER BY orders.id'
  
  pool.connect((err, client, done) => {
    const shouldAbort = (err) => {
      if(err) {
        console.error('Error in transaction', err.stack)
        client.query('ROOLBACK', (err) => {
          if(err) {
            console.error('Error rolling back client', err.stack)
          }
          done()
        })
      }
      return !!err
    }

    client.query('BEGIN', (err) => {
      if(shouldAbort(err)) return
      client.query(sql1, [name, email], (err, res) => {
        if(shouldAbort(err)) return

        const id = res.rows[0].id
        order_items.forEach(data => {
          return client.query(sql2, [id, data.product_id, data.qty], (err, res) => {
            if(shouldAbort(err)) return
            client.query('COMMIT', (err) => {
              if(err) {
                console.error('Error committing transaction', err.stack)
              }
              done()
            })
          })
        })
      })
    })
    client.query(sql3)
      .then(data => {
        res.json(data)
      })
      .catch(err => res.status(400).json('Something Went Wrong'))
  })
  
  // (async () => {
  //   const client = await pool.connect()
  //   try {
  //     await client.query('BEGIN')
  //     const { rows } = await client.query(sql3)
  //     await client.query('COMMIT')
  //   } catch(err) {
  //     await client.query('ROLLBACK')
  //     throw err
  //   } finally {
  //     // res.send(rows)
  //     console.log(rows)
  //     client.release()
  //   }
  // })().catch(err => console.error(err.stack))
})



router.get('/order/:id', (req, res) => {
  const { id } = req.params
  console.log(req.params.id)
})


module.exports = router;