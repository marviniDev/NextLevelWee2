const Database = require('./db')
const createProffy = require('./createProffy')

Database.then(async(db) => {
    //consultar dados

    proffyValue = {

        name: "Diego Fernandes",
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
        whatsapp: "989444479",
        bio: "Entusiasta das melhores tecnologias de química avançada.<br/><br/>Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",

    }

    classValue = {
        subject: 1,
        cost: "20",
        // O proffy_id vira pelo banco de dados
    }

    classScheduleValues = [
        // Class_id vira pelo banco de dados após cadastrar a aula
        {        
            weekday: 1,
            time_from: 720,
            time_to: 1220,
        },
        {        
            weekday: 0,
            time_from: 520,
            time_to: 1220,
        }
    ]

    // Adciona usuarios na tabela
    await createProffy(db, {proffyValue,classValue,classScheduleValues})

    // Consultar todos os dados inseridos
    // Todos os proffys

    const selectedProffys = await db.all("SELECT * FROM proffys")
    //console.log(selectedProffys)

    // Consultar as classes de um determinado professor
    // E trazer juntos os dados dos professores
    const selectedClassesAndProffys = await db.all(`
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE classes.proffy_id = 1;
    `)
    //console.log(selectedClassesAndProffys)

    // O horário que essa pessoa trabalha por exemplo, é das 8h - 18h
    // O horário do time_from (8h) precisa ser maior ou igual ao horário solicitado
    // O time_to precisa ser menor que (18h) 
    const selectedClassSchedules = await db.all(`
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = 1
        AND class_schedule.weekday = 0
        AND class_schedule.time_from <= 620
        AND class_schedule.time_to > 520;
    `)
    console.log(selectedClassSchedules)

})

