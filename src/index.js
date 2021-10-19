// Fichero src/index.js

// Importamos los dos módulos de NPM necesarios para trabajar
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

// Creamos el servidor
const server = express();

// Configuramos el servidor
server.use(cors());
server.use(express.json());
server.use(express.json({ limit: '50mb' }));
//motor de plantillas
server.set('view engine', 'ejs');

const db = new Database('./src/data/database.db', {
  verbose: console.log,
});

server.get('/card/:id', (req, res) => {
  const query = db.prepare(`SELECT * from card WHERE id=?`);
  const data = query.get(req.params.id);
  if (data) {
    res.render('card', data);
  }
});

//static server
const serverStaticPath = './public';
server.use(express.static(serverStaticPath));

// Arrancamos el servidor en el puerto 3000
const serverPort = process.env.PORT || 4001;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.post('/card', (req, res) => {
  const response = {};
  if (req.body.name === '') {
    response.error = 'debe indicar su nombre';
    response.success = false;
  } else if (req.body.job === '') {
    response.error = 'indica tu trabajo';
    response.success = false;
  } else {
    const query = db.prepare(
      'INSERT INTO card (palette,name,job,phone,photo,github,linkedin) VALUES (?,?,?,?,?,?,?)'
    );
    const result = query.run(
      req.body.palette,
      req.body.name,
      req.body.job,
      req.body.phone,
      req.body.photo,
      req.body.github,
      req.body.lindedin
    );

    response.success = true;
    if (req.hostname === 'localhost') {
      response.cardURL = `http://localhost:${serverPort}/card/${result.lastInsertRowid}`;
    } else {
      response.cardURL = `https://awesome-card-adalab.herokuapp.com/card/${result.lastInsertRowid}`;
    }
  }
  //
  res.json(response);
});
