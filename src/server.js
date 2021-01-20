const { pageLanding, pageStudy, pageGiveClasses, saveClasses } = require('./pages')

// Servidor
const express = require('express')
const server = express()

// Configurar nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure('src/views', {
    express: server,
    noCache: true,

})


// Iniciar configurações do servidor
server
// Receber dados do req.body
.use(express.urlencoded({ extended: true }))
// Configurar arquivos estáticos (css, scripts, imagens)
.use(express.static('public'))

    // Rotas da aplicaçao
    // Funcionalidades
    .get("/", pageLanding )
    .get("/study", pageStudy)
    .get("/give-classes", pageGiveClasses)
    .post("/save-classes", saveClasses)
    // Porta do servidor
    .listen(process.env.PORT)
