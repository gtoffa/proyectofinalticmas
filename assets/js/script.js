//url base para la API
const urlApi = 'https://randomuser.me/api/?nat=es';
let currentSuggest;
var currenPage = 0;
let currenCv;
let listFF = [];



//al cargar la pagina traemos un usuario random y 3 user
loadPage();


function loadPage() {


    //Cagar Cv principal

    document.getElementById("loading").style.visibility = "inline";

    currenCv = JSON.parse(localStorage.getItem('currenCv')) ? JSON.parse(localStorage.getItem('currenCv')) : null;

    if (currenCv == null) {
        fetch(urlApi)
            .then(response => response.json())
            .then(data => setDataToCv(data.results[0]));


        //Carga de Cv sugeridos
    } else {
        setDataToCv(currenCv);
    }
    loadItemSugest(localStorage.getItem('page') ? localStorage.getItem('page') : 1);



}





function setDataToCv(resulData) {
    currenCv = resulData;


    //seteo de valores a las elementos html
    document.getElementById('name').innerHTML = currenCv.name.first;
    document.getElementById('lastname').innerHTML = currenCv.name.last;
    document.getElementById('dob').innerHTML = 'Edad ' + currenCv.dob.age;



    document.getElementById('cell').innerHTML = currenCv.cell;
    document.getElementById('cell').setAttribute("href", "tel:" + currenCv.cell);
    document.getElementById('email').innerHTML = currenCv.email;
    document.getElementById('email').setAttribute("href", "mailto:" + currenCv.email);

    document.getElementById('street').innerHTML = currenCv.location.street.name + " " + currenCv.location.street.number + " " + currenCv.location.city;
    document.getElementById('street').setAttribute("href", "http://maps.google.com/?q=" + currenCv.location.street.name + " " + currenCv.location.street.number + " " + currenCv.location.city);

    document.getElementById('image').src = currenCv.picture.large;


    document.getElementById("loading").style.display = "none";

    readFF();
    localStorage.setItem('currenCv', JSON.stringify(currenCv));


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

                if (pag >= 1) {
                    loadItemSugest(pag);
                }
                break;
            }
        case 'Siguiente':
            {
                const pag = currenPage + 1
                if (pag == 3) {
                    parentNode.setAttribute('class', 'page-item disabled');
                }
                if (pag <= 3) {

                    loadItemSugest(pag);
                }
                break;
            }
        default:


            loadItemSugest(el.innerText);
            break;
    }


}


function loadItemSugest(page) {
    localStorage.setItem('page', page);


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


function addFF() {
    listFF.push(currenCv);
    localStorage.setItem('favorites', JSON.stringify(listFF));
    loadFFMenu();

}

function removeFF() {

    listFF = listFF.filter(item => item.id.value !== currenCv.id.value);
    localStorage.setItem('favorites', JSON.stringify(listFF));
    loadFFMenu();


}

function readFF() {
    listFF = JSON.parse(localStorage.getItem('favorites')) ? JSON.parse(localStorage.getItem('favorites')) : [];
    loadFFMenu();

}



function loadFFMenu() {


    document.getElementById('menuff').innerHTML = '';



    listFF.forEach(element => {
        const itemSuggest = document.createElement("li");

        itemSuggest.innerHTML = createLinkFF(element);
        itemSuggest.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: 'smooth' }); setDataToCv(element); });
        document.getElementById('menuff').appendChild(itemSuggest);

    });

    vertificarButtonFF();
}

function createLinkFF(element) {

    return `<a class="dropdown-item" style="cursor: grab;" >
    <img src="${element.picture.large}"
    class="bd-placeholder-img rounded-circle" width="30" height="30"  
    alt="..."/>&nbsp
    ${element.name.last}  ${element.name.first}
    
    </a>`;

}

function vertificarButtonFF() {
    btnFF = document.getElementById("btnFF");

    if (listFF.filter(item => item.id.value == currenCv.id.value).length > 0) {
        btnFF.innerHTML = `<span> Favoritos <i class="material-icons">favorite</i> </span>`;
        btnFF.setAttribute('class', 'btn-flotante-ff');
        btnFF.onclick = function () { removeFF() }
    } else {
        btnFF.innerHTML = `Favoritos <I class="material-icons">favorite_border</I>`;
        btnFF.setAttribute('class', 'btn-flotante');
        btnFF.onclick = function () { addFF() }
    }
}