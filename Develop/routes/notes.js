const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");

const readFromFile = util.promisify(fs.readFile);

notes.get("/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

notes.get("/notes/:id", (req, res) => {
  const noteID = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteID);
      return result.length > 0
        ? res.json(result)
        : res.json("No note with that id found");
    });
});

notes.delete("/notes/:id", (req, res) => {
  const noteID = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== noteID);
      console.info(result);
      fs.writeFile("./db/db.json", JSON.stringify(result, null, 4), (err) =>
        err ? console.error(err) : console.info("No errors.")
      );
      res.json("deleted note successfull");
    });
});

notes.post("/notes", (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = { title, text, id: uuidv4() };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedData, null, 4),
          (err) => (err ? console.error(err) : console.info("No errors."))
        );
        res.json("Note saved");
      }
    });
  }
});
module.exports = notes;
