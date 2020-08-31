const express = require('express');
const shortid = require('shortid');

const server = express();

server.use(express.json())

let users = [
    {
        id: shortid.generate(),
        name: "Joe Idelson",
        bio: "29 year old male"
    },
    {
        id: shortid.generate(),
        name: "Conis Linares",
        bio: "34 year old female"
    },
    {
        id: shortid.generate(),
        name: "Laiah Idelson",
        bio: "33 year old female"
    }
]

server.get('/api/users', (req, res) => {
    if(!users){
        res.status(500).json({ errorMessage: "The users information could not be retrieved."})
    }
    else {
        return res.status(200).json({ data: users })

    }
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    const user = users.find(u => u.id === id)
    if(!user.id) {
        (res.status(404).json({ message: "The user with the specified ID does not exist."}))
    } else if (!user) {
        res.status(500).json({ errorMessage: "The users information could not be retrieved"})
    }
    else {
        return (res.status(200).json({ data: user }))
    }
})

server.post('/api/users', (req, res) => {
    const user = req.body;

   if(!user.name || !user.bio) {
       res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
   }
   else if (!user) {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database"})
   }
   else {
       user.id = shortid.generate();
       users.push(user)
       res.status(201).json({ data: user })
   }
})

server.delete('/api/users/:id', (req, res) => {
    try{
        const deletedUser = users.filter( u => u.id === req.params.id);
        if (deletedUser.length > 0){
            users = users.filter(u => u.id !== req.params.id)
            res.status(200).json(deletedUser)
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist."})
        }
    } catch {
        res.status(500).json({ errorMessage: "The user could not be removed" })
    }
})

server.put('/api/users/:id', (req, res) => {
    try{
        const user = users.find(u => u.id === req.params.id);
        const newUser = req.body;

        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
        else if (!newUser.name || !newUser.bio) {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        }
        else {
            users = users.map(user => user.id === req.params.id ? newUser : user);
            res.status(200).json({ data: users })
        }
    }
    catch{
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    }
})



const port = 8000;
server.listen(port, () => console.log("server is running..."));