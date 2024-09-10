const btn = document.getElementById("btnfetch");
const url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'
buscarKey();
cargarSelect();

function cargarSelect() {
    const departamentos = document.getElementById("departamentos")
    var option = document.createElement("option")
    option.value = 0;
    option.text = "Todos los Departamentos"
    departamentos.appendChild(option);
    fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments')
        .then((response) => response.json())
        .then((data) => {
            console.log(data)

            for (var i = 0; i < data.departments.length; i++) {
                var option = document.createElement("option");
                option.value = data.departments[i].departmentId;
                option.text = data.departments[i].displayName;
                departamentos.appendChild(option);
                console.log(option)
            }
        }
        )
}


function buscarKey() {
    btn.addEventListener("click", () => {

        document.querySelector("#tarjetas").innerHTML = ""

        let keyWord = key.value
        if (!keyWord) {
            keyWord = "*";
        }

        let locationWord = "";
        if (ubicacion.value) {
            locationWord = `&geoLocation=${ubicacion.value}`;
        }

        let department = "";

        if (departamentos.value) {
            if (departamentos.value == 0) {
                department = `&departmentId=*`
            }
            else {
                department = `&departmentId=${departamentos.value}`
            }
            console.log(department)

        }
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyWord}${locationWord}${department}`)
            .then((response) => response.json())
            .then((data) => {
                dataId = data.objectIDs;

                cards(dataId);
                console.log("Data obtenida: ", dataId);
            })
       

        console.log("Palabra clave: " + keyWord)
        console.log("Locacion: " + locationWord)
    })

}

function cards(tarjetas) {

    console.log(tarjetas)

    let card = tarjetas.slice(0, 10)
    for (let item of card) {
        fetch(url + item)
            .then((response) => response.json())
            .then((data) => crearTarjetas(data));

    }
}

function crearTarjetas(objeto) {
    let imagen = objeto.primaryImage;
    if (!imagen) {
        imagen = "https://bocashop.vteximg.com.br/arquivos/ids/163215-1000-1000/not-available-es.png?v=637443433440730000"
    }
    imagen = encodeURI(imagen)

    let cad2 = `
    <div id="tarjeta">
      
    
    <img class= "imgb"
       src=${imagen} alt=${objeto.title}> 
    <h2 id="tituloObra"> ${objeto.title}</h2>
   
     </div>

     
       `

    document.querySelector("#tarjetas").innerHTML = document.querySelector("#tarjetas").innerHTML + cad2
    console.log("cad2: " + cad2)


}

function crearNumerosPag(arreglo) {

    let cantidadPag = arreglo.length / 20


}

function obtenerPagina(pagina = 1) {
    const corteDeInicio = (paginaActual - 1) * elementosPorPagina;
    const corteDeFinal = corteDeInicio + elementosPorPagina;
    return baseDeDatos.slice(corteDeInicio, corteDeFinal);
}