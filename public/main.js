const btn = document.getElementById("btnfetch");
const url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'
busqueda();
cargarSelect();



async function traducir(texto) {

    return new Promise((resolve, reject) => {

        fetch("/traducir", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: (texto)
        })
            .then((response) => {
                if (response.ok) {

                    return response.json();
                }
                reject("No se a podido acceder a este recurso " + response.status)
                return;
            }).then(respuesta => resolve(respuesta.traduccion))
            .catch(err => reject(err))

    })
}

function cargarSelect() {


    const departamentos = document.getElementById("departamentos");
    if (!departamentos) {
        return;
    }

    let option = document.createElement("option");
    option.value = 0;
    option.text = "Todos los Departamentos";
    departamentos.appendChild(option);

    fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments')
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);

            const traducciones = data.departments.map(departamento =>
                traducir(departamento.displayName)
            );

            return Promise.all(traducciones).then((traducciones) => {

                for (let i = 0; i < traducciones.length; i++) {
                    let option = document.createElement("option");
                    option.value = data.departments[i].departmentId;
                    option.text = traducciones[i];
                    departamentos.appendChild(option);
                    console.log(option);
                }
            });
        })
        .catch(err => console.error("Error al obtener departamentos o traducir:", err));

}

function busqueda() {
    if (!btn) {
        return
    }
    btn.addEventListener("click", () => {

        document.querySelector("#tarjetas").innerHTML = ""
        document.querySelector("#imagenesAd").innerHTML = ""

        let keyWord = key.value
        console.log("palabraclave" + keyWord)
        if (!keyWord) {
            keyWord = "*";
        }

        let locationWord = "";
        if (ubicacion.value) {
            locationWord = `&geoLocation=${ubicacion.value}`;
        }

        let department = "";

        if (departamentos.value) {
            if (departamentos.value > 0) {

                department = `&departmentId=${departamentos.value}`
            }
            //console.log(department)

        }
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyWord}${locationWord}${department}`)
            .then((response) => response.json())
            .then((data) => {
                let dataId = data.objectIDs;
                if (dataId && dataId.length > 0) {
                    numeracionPag(dataId);
                    mostrarTarjetas(dataId, 0, 20);
                    console.log("Data obtenida: ", dataId);
                } else {
                    console.log("No se encontro obras")
                    let error = document.createElement("h1")
                    error.textContent = "No se encontraron obras"
                    let tarjetas = document.getElementById("tarjetas")
                    tarjetas.appendChild(error)
                    document.querySelector("#paginas").innerHTML = ""
                }


            })

    })

}


function numeracionPag(ids) {

    let cantidadPag = ids.length / 20
    let aumentoBotones = 20;
    let pagina = 20;
    let i = 1;

    console.log("cantidad de paginas " + cantidadPag)

    if (cantidadPag > 20) {
        console.log("entro al if")
        mostrarBotones(ids, i, 20);

        let botonMasPaginas = document.createElement("button");
        botonMasPaginas.textContent = "..."
        let paginasElement = document.querySelector("#paginas");
        paginasElement.appendChild(botonMasPaginas);
        botonMasPaginas.className = "botonesPaginas";

        botonMasPaginas.addEventListener("click", () => {
            let botonMenosPaginas = document.createElement("button");
            botonMenosPaginas.textContent = "..."
            botonMenosPaginas.id = "menos"
            botonMenosPaginas.className = "botonesPaginas";

            botonMenosPaginas.onclick = function menosPaginas() {
                i = i - 20;
                pagina = pagina - 20;
                // console.log(i +" pagina "+ pagina)
                numeracionPag(ids)
            }
            cantidadPag = cantidadPag - 20;
            console.log("cantidad de paginas restada" + cantidadPag)
            if (cantidadPag > 20) {

                i = i + aumentoBotones;
                pagina = pagina + aumentoBotones;

                mostrarBotones(ids, i, pagina)
                let primerBoton = document.getElementById(i);
                paginasElement.appendChild(botonMasPaginas);
                paginasElement.insertBefore(botonMenosPaginas, primerBoton)
            }else{
                numeracionPag(ids);
            }
        });


    } else {
        mostrarBotones(ids, i, cantidadPag);

    }

}
function mostrarBotones(ids, i, cantidadPag) {
    let paginasElement = document.querySelector("#paginas");
    paginasElement.innerHTML = '';

    for (i; i <= cantidadPag; i++) {
        console.log("i " + i)
        let boton = document.createElement("button");
        boton.id = i;
        boton.textContent = i;
        boton.className = "botonesPaginas";

        boton.addEventListener("click", () => {
            document.querySelector("#imagenesAd").innerHTML = ""
            let borrar = document.querySelector(".botonElegido")
            if (borrar) {
                borrar.classList.remove('botonElegido')
            }
            const inicio = (boton.id - 1) * 20;
            const final = inicio + 20;
            console.log("inicio y final " + inicio + " " + final)
            boton.className = "botonElegido"
            document.querySelector("#tarjetas").innerHTML = ""
            mostrarTarjetas(ids, inicio, final)

        });
        paginasElement.appendChild(boton);
    }

}
function mostrarTarjetas(tarjetas, inicio, fin) {

    // console.log("metodo mostrar tarjetas " + inicio + "  " + fin)

    let card = tarjetas.slice(inicio, fin)

    for (let item of card) {
        fetch(url + item)
            .then(async (response) => {
                if (response.ok) {
                    crearTarjetas(await response.json())
                } else {
                    throw new Error('Something went wrong');
                }
            })

            .catch((error) => {
                console.log(error)
            });

    }
}
async function crearTarjetas(objeto) {
    let imagen = objeto.primaryImage;
    let imagenesAdicionales = objeto.additionalImages
    let boton
    if (!imagen) {
        imagen = "https://bocashop.vteximg.com.br/arquivos/ids/163215-1000-1000/not-available-es.png?v=637443433440730000"
    }

    imagen = encodeURI(imagen)
    console.log("imagenes adicionales" + imagenesAdicionales)

    boton =
        `
     <button class="masImagenes"  id="btnImagenes${objeto.objectID}">
                 Mas imagenes
             </button>

    `


    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta';

    const fechaObra = document.createElement('h5');
    fechaObra.className = 'fechaObra';
    fechaObra.textContent = objeto.objectDate;
    tarjeta.appendChild(fechaObra);


    const img = document.createElement('img');
    img.className = 'imgb';
    img.src = imagen;
    img.alt = objeto.title;
    tarjeta.appendChild(img);

    const tituloObra = document.createElement('h2');
    tituloObra.className = 'tituloObra';
    tituloObra.textContent = await traducir(objeto.title);
    tarjeta.appendChild(tituloObra);

    if (objeto.dynasty != "") {
        const dinastia = document.createElement('h2');
        dinastia.className = 'dinastiaObra';
        dinastia.textContent = "Dinastia: " + await traducir(objeto.dynasty);
        tarjeta.appendChild(dinastia);
    }

    if (objeto.culture != "") {
        const cultura = document.createElement('h2');
        cultura.className = 'culturaObra';
        cultura.textContent = "Cultura: " + await traducir(objeto.culture);
        tarjeta.appendChild(cultura);
    }

    if (imagenesAdicionales && imagenesAdicionales.length > 0 && imagenesAdicionales[0] !== "") {

        const botonElemento = document.createElement('div');
        botonElemento.innerHTML = boton;
        tarjeta.appendChild(botonElemento);
        // console.log(imagenesAdicionales + " imagenes adicionales dentro del boton")

        let imagenesAdd = document.getElementById("imagenesAd")
        if (imagenesAdd) {
            botonElemento.addEventListener("click", () => {
                document.querySelector("#imagenesAd").innerHTML = ""
                //console.log(imagenesAdicionales)
                carruselAdicionales(imagenesAdicionales);
            })
        }

    }

    document.getElementById('tarjetas').appendChild(tarjeta);


}
function carruselAdicionales(imagenesAdicionales) {
    var elemento = document.getElementById('imagenesAd');
    if (elemento) {

        elemento.innerHTML = '';
        document.getElementById('gallery-navigation').innerHTML = "";

        const galleryItems = imagenesAdicionales.map(src => {
            const img = document.createElement('img');
            surce = src.replace("original", "web-large");
            img.src = surce;

            img.style.display = "none";
            img.className = "imageneAdicional";
            elemento.appendChild(img);
            elemento.style.height = '100%';
            return img;
        });

        let currentIndex = 0;

        const prevButton = document.createElement('button');
        prevButton.className = 'prev-button';
        prevButton.textContent = "Anterior";
        const nextButton = document.createElement('button');
        nextButton.className = 'next-button';
        nextButton.textContent = "Posterior"
        const container = document.getElementById('gallery-navigation');
        const salir = document.createElement('button');
        salir.textContent = "X";
        salir.className = "salirAdicionales"
        const salirCarr = document.getElementById("salirCarrusel")
        salirCarr.appendChild(salir);
        if(galleryItems.length>1){
        container.appendChild(prevButton);
        container.appendChild(nextButton);}
        document.querySelector('.salirAdicionales').addEventListener('click', () => {
            document.getElementById('gallery-navigation').innerHTML = "";
            elemento.innerHTML = ''
            salirCarr.innerHTML = ""
            elemento.style.height = "0%";
        });
        if (galleryItems.length > 0) {
            galleryItems[currentIndex].style.display = "block";
        }


        document.querySelector('.prev-button').addEventListener('click', () => {
            navigate(-1);
        });

        document.querySelector('.next-button').addEventListener('click', () => {
            navigate(1);
        });

        function navigate(direccion) {
            galleryItems[currentIndex].style.display = "none";
            currentIndex = (currentIndex + direccion + galleryItems.length) % galleryItems.length;
            galleryItems[currentIndex].style.display = "block";
        }
    }
}
