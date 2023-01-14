//url base para la API
const urlApi = 'https://randomuser.me/api/?nat=es';


//al cargar la pagina traemos un usuario random y 3 user
window.addEventListener('load', function () {
    loadCv();
});


function loadCv() {

    document.getElementById("loading").style.visibility = "inline";
    fetch(urlApi + '&results=3')
        .then(response => response.json())
        .then(data => setDataToCv(data));

}

function loadMultipleCv() {

    document.getElementById("loading").style.visibility = "inline";
    fetch(urlApi + '?nat=es')
        .then(response => response.json())
        .then(data => setDataToCv(data.results[0]));

}


function setDataToCv(resulData) {

    const user = resulData.results[0];
    const refFirst = resulData.results[1];
    const refSecon = resulData.results[2];

    document.getElementById('name').innerHTML = user.name.first;
    document.getElementById('lastname').innerHTML = user.name.last;
    document.getElementById('dob').innerHTML = 'Edad ' + user.dob.age;

    document.getElementById('cell').innerHTML = user.cell;
    document.getElementById('email').innerHTML = user.email;
    document.getElementById('street').innerHTML = user.location.street.name + " " + user.location.street.number + " " + user.location.city;

    document.getElementById('image').src = user.picture.large;

    setReference('refFirst', refFirst);
    setReference('refSecon', refSecon);







    document.getElementById("loading").style.display = "none";


}


function setReference(el, data) {
    document.getElementById(el).innerHTML =
        `${data.name.last}  ${data.name.first} 
        <br />
        <br />
        <span >Director Marix Media ltd.</span>
        <br />
        <span >Phone: ${data.cell}</span>"`;

}