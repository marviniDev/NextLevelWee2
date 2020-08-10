// Procurar o botao
document.querySelector("#add-time").addEventListener('click', cloneField)
// Quando clicar no botao

// Executar uma ação
function cloneField(){
    // Duplicar campos. Que campos?
    const newFieldContainer = document.querySelector(".schedule-item").cloneNode(true)
    // Limpar os campos
    const fields = newFieldContainer.querySelectorAll('input')
    
    // Para campo, limpar
    fields.forEach(function(field){
        // Pega o field do momento e limpa ele
        field.value = ""
    })

    // Coloca na página. Onde?
    document.querySelector("#schedule-items").appendChild(newFieldContainer)
}
// Duplicar os campos
//  Colocar na pagina