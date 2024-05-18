class Myframe extends HTMLElement{
    
    constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.id = '';
        this.type = '';
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
        `;
    }
    static get observedAttributes(){
        return ["uri"];
    }
    attributeChangedCallback(name,old,now){
        let[, , id] = now.split(":");
        const uri = this.getAttribute("uri");
        const type = uri.split(":")[1];
        this.type = type;
        this.id = id;
        this.shadowRoot.innerHTML =`
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
customElements.define("my-frame",Myframe);

const listAlbum = document.querySelector('.albumes');   // falta agregar al html
const listarTrack = document.querySelector('.listarTrack');
const listarPlaylist = document.querySelector('#playlist'); 

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
    let url = `https://spotify23.p.rapidapi.com/search/?q=${codeAlbum}&type=albums&offset=0&limit=10&numberOfTopResults=5`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '916a4690aamshc6c4dcba7679598p145052jsn21e15646bc4c',
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
            // 'Content-Type': 'application/json'
        }
    };
    // se intenta usar los albumes
    try{
        const response = await fetch(url, options);
        const result = await response.json();
        const albums = result.albums.items;
        // const dcAs = data.coverArt.sources;
        // const dai = data.artists.items;
        // const pn = profile.name;
        listAlbum.innerHTML = '';
        for (let i = 0; i<albums.length; i++){
            const getImage = albums[i]?.data.coverArt.sources[i]?.url;
            const firstImage = albums[i]?.data.coverArt.sources[0]?.url;
            const imagen = getImage ?? firstImage;
            const nombre = albums[i].data.name;
            const nombreArtista = albums[i].data.artists.items[i]?.profile.name ?? albums[i].data.artists.items[0]?.profile.name;
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
            listAlbum.append(div);
            div.querySelector('.album_order').addEventListener('click', async()=>{
                await playFirstTrack(uri);
                lookingTracks(uri);
            });
        }
    } catch (error) {
        console.error(error);
    }
}


const playFirstTrack = async (albumUri) => {
    let albumId = albumUri.split(":")[2];
    let url = `https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '916a4690aamshc6c4dcba7679598p145052jsn21e15646bc4c',
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



const lookingTracks = async(albumUri)=>{
    let albumId = albumUri.split[2];
    let url = `https://spotify23.p.rapidapi.com/albums/?ids=${albumId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '916a4690aamshc6c4dcba7679598p145052jsn21e15646bc4c',
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





const urlRecom = `https://spotify23.p.rapidapi.com/recommendations/?limit=20&seed_tracks=0c6xIDDpzE81m2q797ordA&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry`;
const optionsRecom = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '916a4690aamshc6c4dcba7679598p145052jsn21e15646bc4c',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
};


try {
    const response = await fetch(urlRecom, optionsRecom);
    const result = await response.json();
    const tracks = result.tracks;
    // let ai = album.images;
    for (let i = 0;i<10;i++){
        const img = tracks[i]?.album.images[0]?.url;
        const img2 = tracks[i]?.album.images[i]?.url;
        const imagen = img ?? img2;
        const nombre = tracks[i].name;
        const nombreArtista = tracks[i].artists[0].name;
        const uri = tracks[i].uri;

        const div = document.createElement("div");
        div.classList.add("track_Recommendations");
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
        listarTrack.append(div);
        div.querySelector('.track_order').addEventListener('click',()=>{
            const frame = document.querySelector("my-frame");
            frame.setAttribute("uri",uri);
        });
    }
} catch (error){
    console.error(error);
}

const urlPlaylists = 'https://spotify23.p.rapidapi.com/playlist_tracks/?id=37i9dQZF1DX4Wsb4d7NKfP&offset=0&limit=100';
const optionsPlaylists = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '916a4690aamshc6c4dcba7679598p145052jsn21e15646bc4c',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
};

try{
    const response = await fetch(urlPlaylists, optionsPlaylists);
    const result = await response.json();
    const playlist = result.items;
    for (let i=0;i<10;i++){
        const img = playlist[i]?.track.album?.images[0].url;
        const imagen = img;
        const nombre = playlist[i].track.album.name;
        const uri = playlist[i].track.album.uri;

        const div = document.createElement("div");
        div.classList.add("playlist");
        div.innerHTML = `
            <div class="track_order" data-id="${uri}">
                <div class="imagen_playlist">
                    <img src="${imagen}" alt="" class="portada">
                </div>
                <div class="info_track">
                    <h3>${nombre}</h3>
                </div>
            </div>
        `;
        listarPlaylist.append(div);
        div.querySelector('.track_order').addEventListener('click', () => {
            const frame = document.querySelector("my-frame");
            frame.setAttribute("uri", uri);
        });
    }
} catch (error) {
    console.error(error);
}

