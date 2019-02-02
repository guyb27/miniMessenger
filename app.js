//Modules
let express = require("express");
let http = require("http");
let socketio = require("socket.io");
let morgan = require("morgan")
let config = require("./config")

//Variables Globales
const app = express();
const server = http.Server(app);
const io = socketio(server);
const port = config.express.port;
const options = {
    root: __dirname+"/views"
}
let usernames = [];

//Middlewares
app.use(express.static(options.root))
app.use(morgan("dev"))

//Routes
app.get("/", (req, res) =>{
    res.redirect("/home")
})

app.use((req, res, next) => {
    console.log("URL : " + req.path)
    next();
})

app.get("/home", (req, res) => {
    res.sendFile("index.html", options)
});

app.get("/params/:name", (req, res) => {
    res.send(req.params.name)  
  });

  //IO
  io.on("connection", function(socket) {
      console.log("a user connected : "+socket.id)

      //Traitement pour l'assignation d'un username
      socket.on("setUsername", (usernameWanted) => {
          //Traitement de la chaine de caractere
          usernameWanted = usernameWanted.trim();

          //Verification de l unicite de l username
          let usernameTaken = false;
          usernames.map((username) => {//map parcour le tableau "usenames" comme un for (username in usernames)
              if (username == usernameWanted)
                usernameTaken = true;
          })

          //Traitement final
          if (usernameTaken) {
              //event de refus
              socket.emit("rejectUsername")
          }
          else {
              //event de succes
              usernames.push(usernameWanted);
          }

      })
//Deconnection de l utilisateur
      socket.on("disconnect", () => {
          console.log("disconnected : "+socket.id)
      })
  })

  //Lancement de l'application
server.listen(port, () => console.log("Server started on port " + port));