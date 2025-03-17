import {useState, useEffect, useId} from 'react';
import { useParams, Link } from "react-router";
import Navbar from './Navbar';
import axios from 'axios';

function AlbumSearchBar({searchText, setSearchText, setSearchResults, setNewArtistModal})
{
    const searchInputId = useId();
    return (
        <div className="App-Albums-SearchBar">
            <form onSubmit={(e)=>e.preventDefault()}>
                <div className="SearchBarElement">
                    <label htmlFor={searchInputId}>Album Search</label>
                </div>
                <div className="SearchBarElement">
                    <input type="text"
                           id={searchInputId}
                           value={searchText}
                           autoComplete="off"
                           onChange={(e)=>{
                               if(e.target.value)
                               {
                                   setSearchText(e.target.value);
                                   axios.get(`http://localhost:3000/albums/startingWith/${e.target.value}`)
                                       .then(res => {
                                           setSearchResults(res.data);
                                       });
                               }
                               else {
                                   setSearchResults([]);
                                   setSearchText("");
                               }
                           }}/>
                </div>
            </form>
        </div>
    );
}


function AlbumSearchResult({album, setSearchText, setSearchResults})
{
    let albumLink = `/albums/${encodeURIComponent(album.name)}/${album.idAlbum}`;
    return (
        <Link to={albumLink}><div
            data-id-albums={album.idAlbum}
            className="App-SearchResult" onClick={(e)=>{
            setSearchText("");
            setSearchResults([]);
        }}>
            {album.name}
        </div></Link>
    );
}

function AlbumSearchResults({searchResults, setSearchResults, setArtist, setSearchText})
{
    const rows = [];
    if(!searchResults)
    {
        return;
    }
    searchResults.forEach((album)=>{
        if(album)
        {
            rows.push(
                <AlbumSearchResult key={album.idAlbum} album={album} setSearchText={setSearchText} setSearchResults={setSearchResults} />
            );
        }
    });

    return (<div className="App-SearchResults-Container"><div className="App-SearchResults">
        {rows}
    </div></div>);
}

function AlbumSong({song})
{
    return (<div className="App-Row">{song.name}</div>);
}

function AlbumSongs({album})
{

    let songs = [];
    album.songs.forEach((song)=>{
        songs.push(<AlbumSong key={song.idSong} song={song}/>);
    });

    return (
        <div>{songs}</div>
    );
}

function AlbumDetails({album, isEditMode, setIsEditMode, modal, setModal})
{
    let artistLink = `/artists/${encodeURIComponent(album.artist)}/${album.idArtist}`;
    return (
        <div>
            <div className="App-Row">
                <div>Album Name:</div>
                <div>{album.name}</div>
            </div>
            <div className="App-Row">
                <div>Artist:</div>
                <div>
                    <Link to={artistLink}>{album.artist}</Link>
                </div>
            </div>
            <div className="App-Row">
                <div>Release Year:</div>
                <div>{album.releaseYear}</div>
            </div>
            <div className="App-Row">
                <div>Number of listens:</div>
                <div>{album.numberListens}</div>
            </div>
        </div>
    );
}

function Album({album, isEditMode, setIsEditMode, modal, setModal})
{
    return(
        <div>
                <h3>Album:</h3>
                <AlbumDetails album={album} isEditMode={isEditMode} setIsEditMode={setIsEditMode} modal={modal} setModal={setModal}/>
                <h3>Songs:</h3>
                <AlbumSongs album={album} />

        </div>
    );
}

function AlbumComponent({album, setAlbum})
{
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modal, setModal] = useState(false);

    if(!album) return;

    return (<div className="App-Album-Component">
        <div className="App-Container">
            <div className="App-Search-Container">
                <AlbumSearchBar searchText={searchText} setSearchText={setSearchText} setSearchResults={setSearchResults} />
                <AlbumSearchResults searchResults={searchResults} setAlbum={setAlbum} setSearchText={setSearchText} setSearchResults={setSearchResults} />
            </div>
            <Album album={album} isEditMode={isEditMode} setIsEditMode={setIsEditMode} setModal={setModal} modal={modal}  />
        </div>
    </div>);
}

function Container()
{
    const {id} = useParams();
    const [album, setAlbum] = useState('');
    useEffect(() => {
        if(!id) return;
        (async () => {
            axios.get(`http://localhost:3000/albums/${id}`)
                .then(res => {
                    setAlbum(res.data);
                }).catch(err => {
                console.log(err)
            });
        })();
    }, [id]);

    return (<div className="App">
        <header className="App-header">
            <div>
                <Navbar />
                <AlbumComponent album={album} setAlbum={setAlbum}/>
            </div>
        </header>
    </div>);
}

export default Container;