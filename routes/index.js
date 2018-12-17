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
  const sql1 = 'INSERT INTO orders(name, email) VALUES ($1, $2) RETURNING id'
  const sql2 = 'INSERT INTO order_items(order_id, product_id, qty) VALUES ($1, $2, $3)'

  pool.connect((err, pool, done) => {
    const shouldAbort = (err) => {
      if(err) {
        console.error('Error in transaction', err.stack)
        pool.query('ROOLBACK', (err) => {
          if(err) {
            console.error('Error rolling back client', err.stack)
          }
          done()
        })
      }
      return !!err
    }
    pool.query('BEGIN', (err) => {
      if(shouldAbort(err)) return
      pool.query(sql1, [name, email], (err, res) => {
        if(shouldAbort(err)) return

        const id = res.rows[0].id
        order_items.forEach(data => {
          return pool.query(sql2, [id, data.product_id, data.qty], (err, res) => {
            if(shouldAbort(err)) return
            pool.query('COMMIT', (err) => {
              if(err) {
                console.error('Error committing transaction', err.stack)
              }
              done()
            })
          })
        })
      })
    })
  })
})



// router.post('/orders', (req, res) => {
//   const {name, email, order_items} = req.body.orders;
//   const {id} = req.params.id;
//   console.log(id) 
//   pool.connect()
//     .then((err, client) => {
//       if(err) return cb(err);
//       const sql1 = 'INSERT INTO orders(name, email) VALUES ($1, $2) RETURNING id' 
//       const sql2 = 'INSERT INTO order_items(order_id, product_id, qty) VALUES ($1, $2, $3)'
//       pool.query(sql1, params1, (err, results) => {
//         if(err) {
//           return cb(err)
//         }
//         const params1 = [name, email]
//       })
//       order_items.forEach(data => {
//         const params = [name, email]
//         return pool.query(sql, params)
//       })
//     })
//     .then(() => {
//       const sql = 'INSERT INTO order_items(order_id, product_id, qty) VALUES ($1, $2, $3);'
//       order_items.forEach(data => {
//         const params = [id, data.product_id, data.qty]
//         return pool.query(sql, params)
//       })
//     })
//     .then(data => {
//       console.log(data)
//     })
// })






module.exports = router;