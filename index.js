const express = require("express");
const app = express();
const tools = require("./tools.js");
const bodyParser = require("body-parser");
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);//ruta para llegar a la raiz del proyecto

app.get("/", (request, response) => {
  response.send("Home de backend notes ");
});
//cargar las todas las notas disponibles
app.get("/api/notes", (request, response) => {
  let notes = tools.loadNotes();

  if (notes.length > 0) {
    response.json(notes);
  } else {
    response.status(204).end();
  }
});
//agregar una nueva nota 
app.post("/api/notes", (request, response) => {
  console.log("funcion para crear nota post");
  const note = request.body;
  const notes = tools.loadNotes();
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  note.id = maxId + 1;
  tools.addNote(note.id, request.body.title, request.body.body);
});
//busca y mostrar una sola nota 
app.get("/api/notes/:id", (request, response) => {
  id = Number(request.params.id);
  let oneNote = tools.readOneNote(id);

  if (oneNote) {
    response.json(oneNote);
  } else {
    response.status(204).end();
  }
});

//actualizar una nota 
app.put("/api/notes/:id", (request, response) => {
  id = Number(request.params.id);
  ntitle = request.body.title;
  nbody = request.body.body;
  console.log("id correcto?: ", id);
  const result = tools.updateNote(id, ntitle, nbody);

  if (result) {
    response.status(200).end();
  } else {
    response.status(204).send("not found!");
  }
});
//actualizar una fragmento de una nota 
app.patch("/api/notes/:id", (request, response) => {
  id = Number(request.params.id);
  nbody = request.body.body;
  console.log("id correcto?: ", id);
  const result = tools.patchNote(id, nbody);
  if (result) {
    response.status(200).end();
  } else {
    response.status(204).send("not found!");
  }
});
//borrar una nota 
app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  tools.removeNote(id);
  response.send("nota removida").end();
});

//configurar puerto de entrada 
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
