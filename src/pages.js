
const Database = require('./database/db')

const { subjects, weekdays, getSubject, convertHoursToMinutes } = require('./utils/format')

function pageLanding (req, res){
    return res.render("index.html")
}

async function pageStudy (req, res) {
    // Armazena dados recebidos via get por meio dos names
    // retorna as paginas renderizados e envia parametros
    const filters = req.query
    
    if (!filters.subject || !filters.weekday || !filters.time ) {
        return res.render("study.html", { filters, subjects, weekdays })
    }

    //converter horas em minutos
    const timeToMinutes = convertHoursToMinutes(filters.time)


    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}'
    `
    // Caso haja erro na hora do banco de dados
    try {
        const db = await Database
        const proffys =  await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render("study.html", { proffys, filters, subjects, weekdays})
    } catch (error) {
        console.log(error)
    }

    //WHERE classes.proffy_id = 1;
    
    
    
    //return res.render("study.html", { proffys, filters, subjects, weekdays})
}

function pageGiveClasses (req, res) {
    // Armazena dados recebidos via get por meio dos names
    
    /*const date = req.bory
    // Verifica se existe algo
    const isNotEmpty = Object.keys(date).length > 0
    // Se tiver dados
    if (isNotEmpty) {

        date.subject = getSubject(date.subject)
        // Adcionar dados a lista de proffys
        proffys.push(date)

        return res.redirect("/study")
    }*/
    // retorna as paginas renderizados e envia parametros
    return res.render("give-classes.html", {subjects, weekdays})
}

async function saveClasses(req, res) {
    const createProffy = require('./database/createProffy')
    
    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }

    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }

    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHoursToMinutes(req.body.time_from [index]),
            time_to: convertHoursToMinutes(req.body.time_to [index])
        }

    })

    try {
        const db = await Database
        await createProffy(db, {proffyValue, classValue, classScheduleValues})

        let queryString = "?subject=" + req.body.subject
        queryString += "&weekday=" + req.body.weekday[0]
        queryString += "&time=" + req.body.time_from[0]
        
        return res.redirect("/study" + queryString)

    } catch (error) {
        console.log(error)
    }
  
}

module.exports = {
    pageLanding,
    pageStudy,
    pageGiveClasses,
    saveClasses
}