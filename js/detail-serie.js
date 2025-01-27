/*  Capturo la query String, la paso a un objeto maniupulable, capturo el id*/
let qs = location.search;
let qsObj = new URLSearchParams(qs);
let idSerie = qsObj.get('idSerie');

/* api key y el endpoint de detalle de series y proveedores*/
let api_key = "a999f9c45003fc79555aea4968543ddf";
let serieDetalle = `https://api.themoviedb.org/3/tv/${idSerie}?api_key=${api_key}&language=en-US`;
let urlProveedores = `https://api.themoviedb.org/3/tv/${idSerie}/watch/providers?api_key=${api_key}`
let urlRecomendaciones = `https://api.themoviedb.org/3/tv/${idSerie}/recommendations?api_key=${api_key}&language=en-US&page=1`
let urlReviews = `https://api.themoviedb.org/3/tv/${idSerie}/reviews?api_key=${api_key}&language=en-US&page=1`
let urlTrailerSeries = `https://api.themoviedb.org/3/tv/${idSerie}/videos?api_key=${api_key}&language=en-US`

/* Capturo elementos */
let img = document.querySelector(".img-detalle-titulos");
let textoDetalleSerie = document.querySelector(".texto-detalle-serie");
let nombreDetalleSerie = document.querySelector(".nombre-detalle-serie")
let seccionReviews = document.querySelector(".seccionReviews")
let seccionTrailerSeries = document.querySelector(".seccionTrailerSeries")

let estreno = document.querySelector(".estreno")
let temporada = document.querySelector(".temporada")
let rating = document.querySelector(".rating")
let extra = document.querySelector(".extra")
let geneross = document.querySelector(".generos")
let botonagregarfav = document.querySelector(".botonagregarfav")
let botonrecomendacion = document.querySelector(".botonrecomendacion")
let ulverrecomendacionesSeries = document.querySelector(".ulverrecomendacionesSeries")
let listaPlataformas = document.querySelector(".lista_plataformas")


/*Fetch del detalle serie  */
fetch(serieDetalle)
    .then(function (respuesta) {
        return respuesta.json()
    }
    )
    .then(function (data) {
        let serie = data;
        console.log(serie);
        let infoGeneros = ""
        let generos = serie.genres
        for (let i = 0; i < generos.length; i++) {
            infoGeneros += `<a class="generosboton" href="./detail-genres.html?idGenero=${generos[i].id}"> ${generos[i].name}</a>`
        }

        nombreDetalleSerie.innerText = serie.name;
        img.src = `https://image.tmdb.org/t/p/w500${serie.poster_path}`
        estreno.innerText = serie.first_air_date;
        temporada.innerText = `temporadas ${serie.number_of_seasons}`
        rating.innerText = ` Rating: ${serie.vote_average}`;
        extra.innerText = serie.overview;
        geneross.innerHTML = `Géneros: ${infoGeneros}`
        /*botonagregarfav.innerHTML = `<a class="botonfav" href="./favorite.html?idSerie=${serie.id}"> Agregar a favoritos </a>`*/


    })
    .catch(function (error) {
        return error
    }
    )


/* Proveedores series mis cambios . */
fetch(urlProveedores)
    .then(function (respuesta) {
        return respuesta.json()
    })
    .then(function (data) {
        console.log(data.results);

        if (data.results.MX != undefined) {
            console.log(data.results.MX.buy);
            let arrayProveedores = data.results.MX.buy;
            let contenidoProveedores = ""

            for (let i = 0; i < arrayProveedores.length; i++) {
                contenidoProveedores += `<li class="liroveedor"> 
                                            <h3> ${arrayProveedores[i].provider_name}</h3>
                                            <img class="imagenesproveedores" src="https://image.tmdb.org/t/p/w500${arrayProveedores[i].logo_path}" alt="${arrayProveedores[i].provider_name}">
                                        </li>`
            }
            listaPlataformas.innerHTML = contenidoProveedores
        } else {
            listaPlataformas.innerText = "no hay proveedores";
        }

    })
    .catch(function (error) {
        return error
    })


/* Seccion de recomendaciones*/

/* Fetch del Ver recomendaciones */
fetch(urlRecomendaciones)
    .then(function (respuesta) {
        return respuesta.json()

    })
    .then(function (data) {
        console.log(data.results)
        let seriesRecomendadas = data.results;
        let contenidoRecomendaciones = "";


        for (let i = 0; i < 4; i++) {
            contenidoRecomendaciones += `<li class="cada_titulo">
                                            <a href="./detail-serie.html?idSerie=${seriesRecomendadas[i].id}">
                                                <img class="imagenes_home" src="https://image.tmdb.org/t/p/w500${seriesRecomendadas[i].poster_path}" alt=" ${seriesRecomendadas[i].original_name}"   
                                                    height="250px">
                                                    <ul class="lista_anidada">
                                                    <li class="li_piedefoto"> ${seriesRecomendadas[i].original_name} </li>
                                                    <li class="li_piedefoto">Estreno: ${seriesRecomendadas[i].first_air_date} </li>
                                                    <li class="vermas"> Ver más </li>
                                                    </ul>
                                            </a>
                                        </li>`

        };
        ulverrecomendacionesSeries.innerHTML = contenidoRecomendaciones

    })
    .catch(function (error) {
        return error
    })


/*Botón ver recomendaciones (mostrar/ocultar) */
let muestraRecomendaciones = false;

botonrecomendacion.addEventListener('click', function (e) {

    console.log("CLIC")
    if (muestraRecomendaciones) {
        ulverrecomendacionesSeries.style.display = 'none';
        botonrecomendacion.innerText = 'Ver recomendaciones'
        muestraRecomendaciones = false;
    } else {
        ulverrecomendacionesSeries.style.display = 'flex';
        botonrecomendacion.innerText = 'Ocultar recomendaciones'
        muestraRecomendaciones = true;
    }
})



/* Favoritos*/

let favoritosSeries = [];
let recuperoStorage = localStorage.getItem("favoritosSeries");

if (recuperoStorage != null) {
    favoritosSeries = JSON.parse(recuperoStorage)
}
if (favoritosSeries.includes(idSerie)) {
    botonagregarfav.innerText = "Quitar de favoritos"
}

botonagregarfav.addEventListener("click", function (e) {
    e.preventDefault()
    if (favoritosSeries.includes(idSerie)) {
        let indice = favoritosSeries.indexOf(idSerie)
        favoritosSeries.splice(indice, 1)
        botonagregarfav.innerText = "Agregar a favoritos"
    } else {
        favoritosSeries.push(idSerie)
        botonagregarfav.innerText = "Quitar de favoritos"
    }

    let favToString = JSON.stringify(favoritosSeries)
    localStorage.setItem("favoritosSeries", favToString)

})


/*Fetch Reviews*/
fetch(urlReviews)
    .then(function (respuesta) {
        return respuesta.json()
    })
    .then(function (data) {
        console.log(data.results)
        let seriesReviews = data.results;
        let infoReviews = ""
        for (let i = 0; i < 3; i++) {
            infoReviews += ` <article class="reviews">
                                <h2 class="informacion"> ${seriesReviews[i].author} </h2>
                                <p class="sinopsis">  ${seriesReviews[i].content} </p>
                            </article>
                    `
        }
        seccionReviews.innerHTML = infoReviews;
    })
    .catch(function (error) {
        return error
    })

/*Fetch trailers */

fetch(urlTrailerSeries)
.then(function (respuesta) {
    return respuesta.json()
})
.then(function (data) {
    console.log(data.results)
    let seriesTrailer = data.results;
    let contenidoTrailer = "";

    if (seriesTrailer == undefined || seriesTrailer == null || seriesTrailer.length == 0) {
        contenidoTrailer = `<p class="informacion"> "No hay trailer disponible"</p>`
        seccionTrailerSeries.innerHTML = contenidoTrailer
    } 
    else {
        for (let i = 0; i < seriesTrailer.length; i++) {
            if (seriesTrailer[i].type == "Trailer") {
                contenidoTrailer = `<h2 class="titReviews">Trailer</h2>
                                        <iframe width="40%" height="315" src="https://www.youtube.com/embed/${pelisTrailer[i].key}"
                                        title="Youtube video player" frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowfullscreen></iframe>`
            }
        }
        if (contenidoTrailer == "") {
            contenidoTrailer = `<p class="informacion"> "No hay trailer disponible"</p>`
        }
    }
    seccionTrailerSeries.innerHTML = contenidoTrailer
    return data
})
.catch(function (error) {
})





