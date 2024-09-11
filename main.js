const btn = document.getElementById("btnfetch");
const url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'
buscarKey();
cargarSelect();
obtenerPagina();

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
                numeracionPag(dataId);
                mostrarTarjetas(dataId, 0, 20);
                console.log("Data obtenida: ", dataId);
            })


        console.log("Palabra clave: " + keyWord)
        console.log("Locacion: " + locationWord)
    })

}

function numeracionPag(ids) {
    let cantidadPag = ids.length / 20
    /*   if (cantidadPag >= 1) {
          for (var i = 1; i < cantidadPag; i++) {
              document.querySelector("#paginas").innerHTML = document.querySelector("#paginas").innerHTML + `  <button id="btnP${i}"> ${i}</button>`
              let btnP = document.getElementById("btnP${i}");
              btnP.addEventListener("click", () => {console.log(btnP)})
          }
      } */

    let paginasElement = document.querySelector("#paginas");
    paginasElement.innerHTML = '';

    for (let i = 1; i <= cantidadPag; i++) {
        let button = document.createElement("button");
        button.id = `btnP${i}`;
        button.textContent = i;


        paginasElement.appendChild(button);


        button.addEventListener("click", () => {
            console.log(`Button ${i} clicked`);
            const inicio = (i - 1) * 20;
            const final = inicio + 20;
            document.querySelector("#tarjetas").innerHTML = ""
            mostrarTarjetas(ids, inicio, final)
        });
    }
}



function mostrarTarjetas(tarjetas, inicio, fin) {

    console.log(tarjetas)

    let card = tarjetas.slice(inicio, fin)
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

