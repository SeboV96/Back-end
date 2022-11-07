// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
 server.use(express.json()); // si vamos a trabajar con req.body (recibir info por body) NO NOS PODEMOS OLVIDAR DE
 // ACTIVAR EL MIDDLEWARE de express.json() !

const PATH = '/posts'
let id = 1
// TODO: your code to handle requests
server.post(PATH, (req, res) => {
    const {author, title, contents} = req.body
    if (!author || !title || !contents) {
      return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post",})
    }
    const post = {
        author,
        title,
        contents,
        id: id++
    }
   posts.push(post)


    res.status(200).json(post)
})

server.post(`${PATH}/author/:author`, (req, res) => {
   let {author} = req.params
   let {title, contents} = req.body


   if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post",})
  }

  const post = {
    author,
    title,
    contents,
    id: id++
}
posts.push(post)


res.status(200).json(post)

})

server.get(PATH, (req, res) => {
    let { term } = req.query
    if (term){
        const term_posts = posts.filter(p => p.title.includes(term) || p.contents.includes(term))
        return res.json(term_posts)
    }
    res.json(posts) // por default esto manda un status 200
})

server.get(`${PATH}/:author`, (req, res) => {
    let {author} = req.params
    //filter que devuelva un nuevo arreglo con la coincidencia de author
    const posts_author = posts.filter(p => p.author === author)
    if (posts_author.length > 0) {
        res.json(posts_author)
    } else {
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado",})
    }
})

server.get(`${PATH}/:author/:title`, (req, res) => {
    let {author, title} = req.params

    const new_posts = posts.filter(p => p.author === author && p.title === title )
    if (new_posts.length > 0){
        res.json(new_posts)
    } else {
         res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado",})
    }
})

server.put(PATH, (req, res) =>{
    let {id, title, contents} = req.body
    if (id && title && contents){
        // find -> devuelve el primer elemento que coincida
        //como el id es unico, deberia de encontrar un unico elemento con el id pasado por body
        // por el tanto ---> puedo usar find que me va a devolver lo que espero
        let post = posts.find(p => p.id === parseInt(id))
        if(post){
            post.title = title
            post.contents = contents
            res.json(post)
        } else {
             res.status(STATUS_USER_ERROR).json({error: "No se encuentra el ID necesario",})
        }


    } else {
         res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post",})
    }
})

server.delete(PATH, (req, res) => {
    let {id} = req.body
    const post = posts.find(p => p.id === parseInt(id))
    if(!id || !post){
       return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error",})
    }

    posts = posts.filter(p => p.id !== parseInt(id))
     res.json({ success: true })
})

server.delete('/author', (req, res) => {
    let {author} = req.body
    const author_found = posts.find(p => p.author === author)
    if(!author || !author_found){
        return res.status(STATUS_USER_ERROR).json({error: "No existe el autor indicado",})
    }
    let delete_authors = []
    // opcion 1
    delete_authors = posts.filter(p => p.author === author)
    posts = posts.filter(p => p.author !== author)
  return res.json(delete_authors)
    //opcion 2
    // posts = posts.filter(p => {
//          if (p.author !== author){
   //          return true
//} else {
// delete_ authors.push(p)
//}
  //  })
})

module.exports = { posts, server };
