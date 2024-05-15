class myframe extends HTMLElement{
    id
    constructor(id){
        super();
        this.attachShadow({mode: "open"});
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = /*html*/`
            <iframe class="spotify-iframe" 
            width="454" 
            height="690" 
            src="https://open.spotify.com/embed/album/${this.id}" 
            frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media"></iframe>
        `
    }
    static get observedAttributes(){
        return ["uri"];
    }
    attributeChangedCallback(name,old,now){
        let[nameUri, album, id] = now.split(":")
        this.id = id;
    }
}
customElements.define("my-frame",myframe);

// let listAlbum = document.querySelector("#listAlbum");
let searchInput = document.querySelector("#searchInput");
let searchButton = document.querySelector("#searchButton");

let codeAlbum = "%3CREQUIRED%3E";
document.addEventListener('DOMContentLoaded',() =>{
    verAlbum(codeAlbum);
});

// Se busca album con evento de escucha onclick
searchButton.addEventListener('click',() =>{
    const query = searchInput.value.trim();
    if (query){
        codeAlbum = query.replace(" ","%20");
        verAlbum(codeAlbum);
    };
});

// se busca con evento de escucha Enter
searchInput.addEventListener('keypress',(e) =>{
    if (e.key === 'Enter'){
        const query = searchInput.value.trim();
        if (query){
            codeAlbum = query.replace(" ","%20");
            verAlbum(codeAlbum);
        };
    };
});

const verAlbum = async (codeAlbum) => {
    let url = 'https://spotify23.p.rapidapi.com/search/?type=multi&offset=0&limit=10&numberOfTopResults=5';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '344560f223msh07d868d593e096bp1a2c08jsnaa43079d40fd',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
            // 'Content-Type': 'application/json'
        }
    };
    try{
        const response = await fetch(url, options);
        const result = await response.json();
        const albums = result.albums.items;
        const dcAs = data.coverArt.sources;
        listAlbum.innerHTM = '';
        for (let i = 0; i<albums.length; i++){
            const getImage = albums[i]?.dcAs[i]?.url;
            const firstImage = albums[i]?.dcAs[0]?.url;
            const imagen = getImage ?? firstImage;
            const nombre = albums[i].data.name;
            const nombreArtista = albums[i].data.artists.items[i]?.profile.name ?? albums[i].data.artists.items[0]?.profile.name;
            const fecha = albums[i].data.date.year;
            const uri = albums[i].data.uri;

            const div = document.createElement("div");
            div.classList.add("albumes");         // Buscar donde agregarlo
            div.innerHTML = `
                <div class="album_order" data-id="${uri}">
                    <div class="imagen_album">
                        <img src="${imagen}" alt="" class="portada">
                    </div>
                    <div class="info_album">
                        <h3>${nombre}</h3>
                        <p>${nombreArtista}</p>
                        <p>${fecha}</p>
                    </div>
                </div>
            `;
            listAlbum.append(div);
            div.querySelector('.album_order').addEventListener('click',()=>{
                const frame = document.querySelector("my.frame");
                frame.setAttribute("uri",uri);
            })
        }
    } catch (error) {
        console.error(error);
    }
    
};








// try {
// 	const response = await fetch(url, options);
// 	const result = await response.text();
// 	console.log(result);
// } catch (error) {
// 	console.error(error);
// }

try {
	const response = await fetch(url, options);
	const result = await response.json();
    let tracks = result.tracks.items
    console.log(tracks)
    for (let i = 0; i < 10; i++) {
        const getImage = tracks[i]?.albums.images.url;
        const firstImage = tracks[i]?.albums.images.url;
        const imagen = getImage ?? firstImage;
        const nombre = tracks[i].name;
        const nombreArtista = tracks[i].artists.items[0].name
        const uri = tracks[i].uri;

        const div = document.createElement("div");
        div.classList.add("trackRecomendations");           // Buscar donde agregarlo
        div.innerHTML = `
            <div class="track_order" data-id="${uri}">
                <div class="imagen_track">
                    <img src="${imagen}" alt="" class="portada">
                </div>
                <div class="info_track">
                    <h3>${nombre}</h3>
                    <p>${nombreArtista}</p>
                </div>
            </div>
        `;
    }
} catch (error) {
	console.error(error);
}


// try {
// 	const response = await fetch(url, options);
// 	const result = await response.json();
//     let va = result.tracks.items
//     console.log(tracks)
//     for(let i = 0; i < 1000; i++){
//         fetch (url)
//         .then(response => response.json())
//         .then(data => mostrarAlbum(data))
//         let imagen = va[i]?.data.coverArt.sources[i]?.url ?? va[i]?.data.coverArt.sources[0]?.url;
//         let nombre = va[i].data.name
//         let nombreArtista = va[i].data.artists.items[i]?.profile.name ?? va[i].data.artists.items[0]?.profile.name;
//         let fecha = va[i].data.date.year
        
//         const mostrarAlbum = async() => {
//             const div = document.createElement("div");
//             div.classList.add("album")
//             div.innerHTML = `
//             <div class="album">
//                 <div class="album_order">
//                     <div class="imagen_album">
//                         <img src="${imagen}" alt="" class="portada">
//                     </div>
//                     <div class="info_album">
//                         <h3>${nombre}</h3>
//                         <p>${nombreArtista}</p>
//                         <p>${fecha}</p>
//                     </div>
//                 </div>
//             </div>`;
//             listAlbum.append(div);
//         }
//         if(imagen){
//         }
//     }
// } catch (error) {
// 	console.error(error);
// }