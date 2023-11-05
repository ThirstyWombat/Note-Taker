const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");
const readFromFile = util.promisify(fs.readFile);

notes.get("/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

notes.post("/notes", (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = { title, text, noteId: uuidv4() };
    console.log(newNote);
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedData, null, 4),
          (err) => (err ? console.error(err) : console.info("Note Saved"))
        );
      }
    });
  }
});
module.exports = notes;
