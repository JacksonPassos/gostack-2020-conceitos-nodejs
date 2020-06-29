const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.status(200).json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const index = repositories.findIndex(repository => repository.id === id)
  if(index < 0) {
    return response.status(400).send()
  }

  const repository = repositories.find(repository => repository.id === id)

  repository.title = title
  repository.url = url
  repository.techs = techs

  repositories[index] = repository

  return response.status(200).json(repository)


});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repository =  repositories.findIndex(repository => repository.id === id)
  if(repository < 0) {
    return response.status(400).json({ error: true, message: "Should not be able to delete a repository that does not exist." })
  }
  repositories.splice(repository, 1)
  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const index = repositories.findIndex(repository => repository.id === id)
  if (index < 0) {
    return response.status(400).json({ error: true, message: "should not be able to like a repository that does not exist" })
  }

  const repository = repositories.find(repository => repository.id === id)

  repository.likes += 1

  repositories[index] = repository

  return response.json(repository)

});

module.exports = app;
