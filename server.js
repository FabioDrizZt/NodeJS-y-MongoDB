const express = require('express')
const { connectToMongoDB, disconnectFromMongoDB } = require('./src/mongodb.js')
const app = express()
const port = process.env.PORT ?? 3000

//Middleware
app.use(express.json())
// app.use((req, res, next) => {
//   res.header('Content-Type', 'application/json; chartset=utf-8')
//   next()
// })

//Ruta principal
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de frutas !')
})
//Obtener todas las frutas
app.get('/frutas', async (req, res) => {
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a la BD')
  }

  try {
    const db = client.db('frutasDB')
    const frutas = await db.collection('frutas').find().toArray()
    res.json(frutas)
  } catch (error) {
    res.status(500).send('Error al obtener las frutas')
  } finally {
    await disconnectFromMongoDB()
  }
})

//Obtener todas las frutas
app.get('/frutas/:id', async (req, res) => {
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a la BD')
  }

  try {
    const frutaId = parseInt(req.params.id) || 0
    const db = client.db('frutasDB')
    const fruta = await db.collection('frutas').findOne({ id: frutaId })
    if (fruta) {
      res.json(fruta)
    } else {
      res.status(404).send(`No se encontro la fruta con id ${frutaId}`)
    }
  } catch (error) {
    res.status(500).send('Error al obtener la fruta')
  } finally {
    await disconnectFromMongoDB()
  }
})

//Inicializamos el servidor
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
