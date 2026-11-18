
const url = "http://127.0.0.1:3000/api/activites"

async function getData() {

    const rsp = await axios.get(url)
    const data = rsp.data
    console.log(data)
    stockeNom(data);
    ajouter()
}

getData();

let Id = 3
function generateId() {
    return Id++
}

function convertirTime(time) {
    return time.split('T')[0];
}


function stockeNom(data) {
    const btnnom = document.getElementById('btnsinscrire')
    const msg = document.getElementById('spanmsg')
    const localname = localStorage.getItem('nom_complet')

    if (localname) {
        affichage(data)
    }
    else {
        btnnom.addEventListener("click", (e) => {
            e.preventDefault()
            const nomcomplet = document.getElementById('nominput')
            const nomvalue = nomcomplet.value.trim()

            if (nomvalue === "") {
                msg.textContent = "Ecrire votre nom complet"
            } else if (nomvalue.indexOf(" ") === -1) {
                msg.textContent = "Ecrire votre nom et prénom"
            } else {
                localStorage.setItem("nom_complet", nomvalue)
                affichage(data)
            }
        })
    }
}




////////////////////////////////////////////////////////////////////

function createCard(element, time) {
    const create = (tag, classes = "", text = "") => {
        const el = document.createElement(tag);
        if (classes) el.className = classes;
        if (text) el.textContent = text;
        return el;
    };
    const createButton = (title, iconClass) => {
        const a = create("a", "btn btn-primary");
        a.href = "#";
        a.title = title;
        a.appendChild(create("i", iconClass));
        return a;
    };
    const card = create("div", "card");
    const body = create("div", "card-body");
    const title = create("h5", "card-title", element.titre);
    const timeP = create("p", "card-text");
    timeP.append(create("small", "text-muted", time), document.createElement("br"), create("small", "text-muted", `Duree : ${element.duree}min`));
    const theme = create("p", "card-text", `Theme : ${element.theme}`);
    const description = create("p", "card-text", element.description);
    const authorP = create("p", "card-text");
    authorP.appendChild(create("small", "text-muted", element.auteur));
    const editPartial = createButton("Modification partielle", " fa-solid fa-pen ");
    const remove = createButton("Supprimer", "fa-solid fa-trash-can");

    body.append(title, timeP, theme, description, authorP, editPartial, remove);
    card.appendChild(body);

    return card;
}


function affichage(data) {
    const cardcDiv = document.getElementById('cardDiv');
    const SinscrireDiv = document.getElementById('sinscrireDiv');

    SinscrireDiv.innerHTML = "";
    cardcDiv.innerHTML = "";

    data.forEach(element => {
        const time = convertirTime(element.createdAt);
        cardcDiv.appendChild(createCard(element, time));
    });
}


async function chargerActivites() {
    const rsp = await axios.get(url)
    const data = rsp.data
    affichage(data)
}
//////////////////////////////////////////////////////////////////////


const ajouterForm = document.forms.ajouterForm

function ajouter(data) {
    const btnajouter = document.getElementById('btnajouter');
    const localname = localStorage.getItem('nom_complet')

    btnajouter.addEventListener("click", async (e) => {
        e.preventDefault()
        const titre = ajouterForm.titre.value
        const themeselecte = ajouterForm.themeselecte.value
        const objectif = ajouterForm.objectif.value
        const duree = Number(ajouterForm.duree.value)
        const description = ajouterForm.description.value

        const obj = {
            titre: titre,
            theme: themeselecte,
            objectifs: objectif,
            duree: duree,
            description: description,
            auteur: localname
        }
        await postElement(obj)
        chargerActivites()
    })

}


async function postElement(element) {
    try {
        const ajout = await axios.post(url, element)
        alert("Activitee Ajoute avec succes")
        document.getElementById('btnfermer').click()
    } catch (error) {
        // alert("Ereur : " + error.message) 
        console.log(error.response?.data);
        const data = error.response?.data;
        const msg = data?.message || data?.error || JSON.stringify(data) || error.message;
        alert("Erreur lors de l'ajout : " + msg);
    }
}



async function supprimer(id) {
    try {
        const adresse = url + "/" + id
        await axios.delete(adresse)
        await chargerActivites()
    } catch (error) {
        console.log(error.response?.data);
        const data = error.response?.data;
        const msg = data?.message || data?.error || JSON.stringify(data) || error.message;
        alert("Erreur lors de la suppression : lors de l'ajout : " + msg);
    }
}













































// function affichage(data) {
//     const cardcDiv = document.getElementById('cardDiv');
//     const SinscrireDiv = document.getElementById('sinscrireDiv');

//     SinscrireDiv.innerHTML = "";
//     data.forEach(element => {
//         const time = convertirTime(element.createdAt)
//         cardcDiv.innerHTML += `
//           <div class="card" >
//                 <div class="card-body ">
//                     <h5 class="card-title">${element.titre}</h5>
//                     <p class="card-text"><small class="text-muted">${time}</small><br> <small class="text-muted">Duree : ${element.duree}min</small></p>
//                     <p class="card-text">Theme : ${element.theme}</p>
//                     <p class="card-text">${element.description}</p>
//                     <p class="card-text"><small class="text-muted">${element.auteur}</small></p>
//                     <a href="#" class="btn btn-primary" title="Modification partielle"><i
//                             class="fa-solid fa-pen"></i></a>
//                     <a href="#" class="btn btn-primary" title="Modification complète"><i
//                             class="fa-solid fa-file-pen"></i></a>
//                     <a href="#" class="btn btn-primary" title="Supprimer"><i class="fa-solid fa-trash-can"></i></a>
//                 </div>
//             </div>
//          `
//     });
// }
