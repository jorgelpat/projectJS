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
        let[, , id] = now.split(":");
        const uri = this.getAtribute("uri");
        const type = uri.split(":")[1];
        this.type = type;
        this.id = id;
        this.shadowroot.innerHTML =`
            <iframe class="spotify-iframe" 
            width="100%" 
            height="100%" 
            src="https://open.spotify.com/embed/${this.type}/${this.id}" 
            frameborder="0" 
            allowtransparency="true" 
            allow="encrypted-media"></iframe>
        `;
        if (type == "track"){
            this.shadowRoot.innerHTML = `
                <iframe class="spotify-iframe" 
                width="70%" 
                height="400" 
                src="https://open.spotify.com/embed/${this.type}/${this.id}" 
                frameborder="0" 
                allowtransparency="true" 
                allow="encrypted-media"></iframe>
            `;
        }
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
    let url = 'https://potify23.p.rapidapi.com/search/?type=multi&offset=0&limit=10&numberOfTopResults=5';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '344560f223msh07d868d593e096bp1a2c08jsnaa43079d40fd',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };
    // se intenta usar los albumes
    try{
        const response = await fetch(url, options);
        const result = await response.json();
        const albums = result.albums.items;
        const dcAs = data.coverArt.sources;
        const dai = data.artists.items;
        const pn = profile.name;
        listAlbum.innerHTML = '';
        for (let i = 0; i<albums.length; i++){
            const getImage = albums[i]?.dcAs[i]?.url;
            const firstImage = albums[i]?.dcAs[0]?.url;
            const imagen = getImage ?? firstImage;
            const nombre = albums[i].data.name;
            const nombreArtista = albums[i].dai[i]?.pn ?? albums[i].dai[0]?.pn;
            const fecha = albums[i].data.date.year;
            const uri = albums[i].data.uri;

            const div = document.createElement("div");
            div.classList.add("album");
            div.innerHTML = `
                <div class="album_order" data-uri="${uri}">
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
            // let divClassAlbumes = document.querySelector(".albumes")
            divClassAlbumes.append(div);
            div.querySelector('album_order').addEventListener('click', async()=>{
                await reprFirstTrack(uri);
                lookingTracks(uri);
            });
        }
    } catch (error) {
        console.error(error)
    }
}


reprFirstTrack = async (albumUri) => {
    let albumId = albumUri.split(":")[2];
    let url = `https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '344560f223msh07d868d593e096bp1a2c08jsnaa43079d40fd',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const tracks = result.albums[0].tracks.items;
        const uri = tracks[0]?.uri; // URI del primer track
        const frame = document.querySelector("my-frame");
        frame.setAttribute("uri", uri); // Establecer la URI del primer track
    } catch(error){
        console.error(error);
    }
}



lookingTracks = async(albumUri){
    let albumId = albumUri.split[2];
    let url = `https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '344560f223msh07d868d593e096bp1a2c08jsnaa43079d40fd',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url,options);
        const result =await response.json();
        const tracks = result.albums[0].tracks.items;
        listarTrack.innerHTML = '';
        for (let i=0; i<tracks.length;i++){
            const track = tracks[i];
            const nombre = track.name;
            const nombreArtista = track.artists[0].name;
            const uri = track.uri;

            const div = document.createElement("div");
            div.classList.add("track");
            div.innerHTML = `
                <div class="trackOrder" data-id="${uri}">
                    <div class="info_track">
                        <h3>${nombre}</h3>
                        <p>${nombreArtista}</p>
                    </div>
                </div>

            `;
            listarTrack.append(div);
            div.querySelector('.trackOrder').addEventListener('click',()=>{
                const frame = document.querySelector("my-frame");
                frame.setAttribute("uri",uri);
            });
        }
    } catch(error){
        console.error(error);
    }
}


const listAlbum = document.querySelector('.albumes');
const listarTrack = document.querySelector('.listarTrack');


            // const albumes = document.createElement("div");
            // const elementoAlbumes = document.querySelector(".albumes")
            // div.classList.add("albumes");         // Buscar donde agregarlo
            // div.innerHTML = `
            //     <div class="album_order" data-id="${uri}">
            //         <div class="imagen_album">
            //             <img src="${imagen}" alt="" class="portada">
            //         </div>
            //         <div class="info_album">
            //             <h3>${nombre}</h3>
            //             <p>${nombreArtista}</p>
            //             <p>${fecha}</p>
            //         </div>
            //     </div>
            // `;
            // albumes.append(div);

//             const listaAlbum = document.createElement('div');
//             listaAlbum.innerHTML = `
//                 <div class="album_order" data-id="${uri}">
//                     <div class="imagen_album">
//                         <img src="${imagen}" alt="" class="portada">
//                     </div>
//                     <div class="info_album">
//                         <h3>${nombre}</h3>
//                         <p>${nombreArtista}</p>
//                         <p>${fecha}</p>
//                     </div>
//                 </div>
//             `;
//             const elementAlbum = document.querySelector('.albumes')
//             elementAlbum.append(listaAlbum);

//             div.querySelector('.album_order').addEventListener('click',()=>{
//                 const frame = document.querySelector("my.frame");
//                 frame.setAttribute("uri",uri);
//             })
//         }
//     } catch (error) {
//         console.error(error);
//     }
    
// };

// try {
// 	const response = await fetch(url, options);
// 	const result = await response.json();
//     let tracks = result.tracks.items
//     console.log(tracks)
//     for (let i = 0; i < 10; i++) {
//         const getImage = tracks[i]?.albums.images.url;
//         const firstImage = tracks[i]?.albums.images.url;
//         const imagen = getImage ?? firstImage;
//         const nombre = tracks[i].name;
//         const nombreArtista = tracks[i].artists.items[0].name
//         const uri = tracks[i].uri;

//         const div = document.createElement("div");
//         div.classList.add("trackRecomendations");           // Buscar donde agregarlo
//         div.innerHTML = `
//             <div class="track_order" data-id="${uri}">
//                 <div class="imagen_track">
//                     <img src="${imagen}" alt="" class="portada">
//                 </div>
//                 <div class="info_track">
//                     <h3>${nombre}</h3>
//                     <p>${nombreArtista}</p>
//                 </div>
//             </div>
//         `;
//     }
// } catch (error) {
// 	console.error(error);
// }
