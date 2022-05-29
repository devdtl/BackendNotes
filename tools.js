const { redirect } = require("express/lib/response");
const fs = require("fs"); //importamos fs para escribir y leer archivos
const { request } = require("http"); 
const { title } = require("process");
const { stringify } = require("querystring");

const addNote = function (id,title, body) {
  //creacion de addNote para formar la estructura del archivo
  const notes = loadNotes();
  const duplicateNote = notes.find((note) => note.id === id); //si la nota está duplicada se muestra una bandera
  if (!duplicateNote) {
    notes.push(     
      { id: id, title: title, body: body });//agregamos los valores que recibe yargs
    saveNotes(notes); //validación si existe o no una nota con el mismo titulo
  } else {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    id= maxId+1;
    console.log("ultimo id",id);
    id2= String(id);
    console.log(typeof id2);
    notes.push({ id: id, title: title, body: body });//agregamos los valores que recibe yargs
    saveNotes(notes); //validación si existe o no una nota con el mismo titulo
  }
};
const saveNotes = function (notes) { // metodo para guardar las notas que agregamos,
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataJSON); //agrega la nota en el documento en formato Json
};
  const loadNotes = function () {
  try {
    const dataBuffer = fs.readFileSync("notes.json"); //obtiene el archivo de notas
    const dataJSON = dataBuffer.toString(); //lo muestra como cadena
    return JSON.parse(dataJSON); //devuelve la  lista
  } catch (e) {
    return []; //devuelve lista vacía
  }
};
  const listNotes = function () {
  const notes = loadNotes();

  notes.forEach((note) => {
    console.log(
      "titulo de la nota: ",
      note.title,
      "cuerpo de la nota: ",
      note.body
    );
  });
};
  const removeNote = function (id) {
  const notes = loadNotes();
  const notesToKeep = notes.filter((note) => note.id != id);
  saveNotes(notesToKeep);
};

const readOneNote = function (id) {
  const notes = loadNotes();
  const note = notes.find((note) => note.id === id);
  if(note){
    console.log("nota encontrada");
    console.log(note.id,note.title, note.title);

    return note
  }else{
    console.log("nota no encontrada");
    return false
  }

};

const updateNote = function (id, updateTitle, updateBody) {
  const notes = loadNotes();
  console.log("el id llegando",id);
  let ids= Number(id)
  console.log("el id despues de maquillado",ids);
  let note = notes.findIndex((note) =>note.id === ids);
  console.log("holi",note);
  newnote =
  notes.splice(note, 1, {id:ids, title: updateTitle, body: updateBody});
  console.log("esto que es_ ",notes);
  saveNotes(notes);
  console.log("Nota modificada");

};
const patchNote = function (id,body){
  const notes = loadNotes();
  const body1 = body;
  const note2modify= notes.find((notes)=>notes.id === id)
  note2modify.body=body1;
  const titile =note2modify.title;
  const found_id = note2modify.id;
  if(notes){
    const removeNote = notes.filter((notes)=>notes.id===id)
    saveNotes(removeNote)
    removeNote.push(
      {
        id:found_id,
        title:title,
        body:body1
      }
    )
    saveNotes(removeNote)
  }else{
    console.log("nota no encontrada");
  }
}

module.exports = {
  readOneNote: readOneNote,
  addNote: addNote,
  loadNotes: loadNotes,
  saveNotes: saveNotes,
  removeNote: removeNote,
  listNotes: listNotes,
  updateNote: updateNote,
  patchNote: patchNote
};