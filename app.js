import express from 'express';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();
const port = 3000;

server.listen(port);

server.use(express.static(
   path.join(__dirname, 'public'),
));

server.use(express.json());

const getData = () => {
   const data = fs.readFileSync('./data/db.json');
   const dataParsed = JSON.parse(data);
   return dataParsed;
}

server.get('/', (req, res) => {
   const filename = 'index.html';
   res.sendFile(filename, {
      root: path.join(__dirname, 'public')
   });
});

server.get('/data', (req, res) => {
   const data = getData();
   res.send(data);
});

server.post('/newEntry/:id', (req, res) => {
   const { id, title, content } = req.body;
   const data = getData();

   const newEntry = {
      id,
      title,
      content,
   }
   
   const updatedDataArr = [];
   data.entries.forEach(entry => updatedDataArr.push(entry));
   updatedDataArr.push(newEntry);
   const updatedData = JSON.stringify({entries: updatedDataArr}, null, 2);

   fs.writeFile('./data/db.json', updatedData, () => null);
});