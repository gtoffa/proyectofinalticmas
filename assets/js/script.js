//url base para la API
const urlApi = 'https://randomuser.me/api/?nat=es';
let currentSuggest;
var currenPage = 0;
//al cargar la pagina traemos un usuario random y 3 user
loadPage();


function loadPage() {


    //Cagar Cv principal
    document.getElementById("loading").style.visibility = "inline";
    fetch(urlApi)
        .then(response => response.json())
        .then(data => setDataToCv(data.results[0]));


    //Carga de Cv sugeridos
    loadItemSugest(1);




}




function setDataToCv(resulData) {

    const user = resulData;

    //seteo de valores a las elementos html
    document.getElementById('name').innerHTML = user.name.first;
    document.getElementById('lastname').innerHTML = user.name.last;
    document.getElementById('dob').innerHTML = 'Edad ' + user.dob.age;

    document.getElementById('cell').innerHTML = user.cell;
    document.getElementById('email').innerHTML = user.email;
    document.getElementById('street').innerHTML = user.location.street.name + " " + user.location.street.number + " " + user.location.city;

    document.getElementById('image').src = user.picture.large;


    document.getElementById("loading").style.display = "none";

}

//Carga la pagina
function setPage(el) {
    
    const parentNode = el.parentNode;

    let btsPagination = document.getElementsByClassName("page-item");
    for (var i = 0; i < btsPagination.length; i++) {
        btsPagination[i].setAttribute('class', 'page-item');
    }



    switch (el.innerText) {
        case 'Previo':
            {
                const pag = currenPage - 1
                if (pag == 1) {
                    parentNode.setAttribute('class', 'page-item disabled');
                }

                loadItemSugest(pag);
                break;
            }
        case 'Siguiente':
            {
                const pag = currenPage + 1
                if (pag == 3) {
                    parentNode.setAttribute('class', 'page-item disabled');
                }

                loadItemSugest(pag);
                break;
            }
        default:


            loadItemSugest(el.innerText);
            break;
    }


}


function loadItemSugest(page) {

    //se muestra el div de carga
    document.getElementById("loadingSuggest").style.visibility = "visible";


    //se almacena en la variable global en numero de pagina
    currenPage = parseInt(page);

    //se obtienen todos los botones con la clase PAGE-ITEM 
    let btsPagination = document.getElementsByClassName("page-item");


    //se recorrien todos los botones  seteneado la clase ACTIVE al que corresponde con el numero e pagina
    for (var i = 0; i < btsPagination.length; i++) {
        if (btsPagination[i].firstChild.innerText == currenPage) {
            btsPagination[i].setAttribute('class', 'page-item active');
            break;
        }
    }




    // se trae de la Api el numero de pagina #{i} con un total de 3 resultados y la semilla gtoffa,
    // cuando termina se carga el cv del primer item 
    fetch(urlApi + `&page=${page}&results=3&seed=gtoffa`)
        .then(response => response.json())
        .then(data => createItemSugest(data.results));


}

function createItemSugest(data) {

    document.getElementById('suggest').innerHTML = '';



    data.forEach(element => {
        const itemSuggest = document.createElement("div");
        itemSuggest.setAttribute('class', 'col-lg-4');
        itemSuggest.setAttribute('style', 'cursor: pointer;');
        itemSuggest.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: 'smooth' }); setDataToCv(element); });
        itemSuggest.innerHTML = createDivSuggest(element);
        document.getElementById('suggest').appendChild(itemSuggest);

    });
    document.getElementById("loadingSuggest").style.visibility = "hidden";

 
    
}

function createDivSuggest(element) {

    return `<img src="${element.picture.large}"
        class="bd-placeholder-img rounded-circle" width="140" height="140" class="img-fluid "
        alt="...">
    <h2 class="fw-normal">${element.name.last}  ${element.name.first} </h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..</p>`

}

