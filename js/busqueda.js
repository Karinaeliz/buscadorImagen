const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () =>{
    formulario.addEventListener('submit', validarFormulario);


}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
     mostrarAlerta('Agrega un término de búsqueda');
     return;
    }
    buscarImagenes();
}

function mostrarAlerta(mensaje){
    const existeAlerta = document.querySelector('.existe_alerta');
    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('existe_alerta');
    
        alerta.innerHTML= `
        <strong class= "aler">ERROR</strong>
        <span class="mensaje">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(()=>{
            alerta.remove();
        }, 3000);
    }
   
}
function buscarImagenes(){
    const termino = document.querySelector('#termino').value;

    const key='29800678-d136d124b91a52629b3352844';
    const url= `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    console.log(url);

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            mostrarImagenes(resultado.hits);
        })
}

//Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total){
    for(let i =1; i <= total; i++){
        yield i;

    }
}
function calcularPaginas(total){
    return parseInt(Math.ceil( total / registrosPorPagina));
}

function mostrarImagenes(imagenes){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
    //Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const{previewURL, likes, views, largeImageURL} = imagen;
        resultado.innerHTML += `
        <div class="container_img">
            <div class="container_resultado">
                <img class="imagenes" src="${previewURL}">
                <div class="caracteristica">
                    <p class="likes"> ${likes}<span >Me Gusta</span></p>
                    <p class="views"> ${views}<span >Vistas</span></p>

                    <a class="link_img" href="${largeImageURL}" tareget="_blank" rel="noopener noreferrer">Ver Imagen</a>
                </div>
            </div>
            
        </div>
        `
        
    });
    //Limpiar el paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    // Generamos el nuevo HTML

    imprimirPaginador();

}
function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    while(true){
        const{ value, done} = iterador.next();
        if(done) return;

        //Caso contrario, genera un botón por cada elemento en el generador
        const boton= document.createElement('a');
        boton.href= '#';
        boton.dataset.pagina= value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'uppercase', 'rounded');
        boton.onclick = ()=> {
            paginaActual = value;
            buscarImagenes();

        }
        paginacionDiv.appendChild(boton);
    }

}