import {useState, useEffect, useId} from 'react';
import { useParams, Link } from "react-router";
import axios from 'axios';

function AlbumSearchBar({searchText, setSearchText, setSearchResults})
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

function AlbumSearchResults({searchResults, setSearchResults, setSearchText})
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
    let songURL = `http://localhost:3030/songs/${encodeURIComponent(song.name)}/${song.idSong}`;
    return (
        <div className="App-Row"><Link to={songURL}>{song.name}</Link></div>
    );
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

function AlbumField({album,  fieldName, isEditMode})
{
    const fieldValue = album[fieldName];
    const [field, setField] = useState(fieldValue);


    if(isEditMode)
    {
        return (<div>
            <input value={field} onChange={(e)=>{
                album[fieldName] = e.target.value;
                setField(e.target.value);
            }}/>
        </div>);
    }
    else
    {
        return <div>{fieldValue}</div>
    }
}

function AlbumControls({album, setAlbum, isEditMode, setIsEditMode}) {
    const editText = isEditMode?"Update Album":"Edit Album";
    return (<div>
        <button
            className="App-Button App-Button-Submit"
            onClick={(e) => {
                if (isEditMode) {
                    axios
                        .patch(
                            `http://localhost:3000/albums/${album.idalbum}`,
                            album
                        )
                        .then((res)=>{
                            setAlbum(res.data);
                            setIsEditMode(false);
                        });
                }
                else
                {
                    setIsEditMode(true);
                }

            }}
        >
            {editText}
        </button>
        <button
            className="App-Button App-Button-Delete"
            onClick={(e) => {
                axios.delete(
                    `http://localhost:3000/albums/${album.idalbum}`
                ).then((res)=>{
                    window.location.href=(`/albums/`);
                });
            }}
        >
            Delete Album
        </button>
    </div>);
}

function AlbumDetails({album, setAlbum, isEditMode, setIsEditMode})
{
    let artistLink = `/artists/${encodeURIComponent(album.artist)}/${album.idArtist}`;
    let [artistName, setArtistName] = useState(album.artist);

    let artistNameField = isEditMode?
        (<input
            value={artistName}
            onChange={(e)=>{
                setArtistName(e.target.value);
                album.artist = e.target.value;
            }}
        />):
        (<Link to={artistLink}>{album.artist}</Link>);

    return (
        <>
            <div className="App-Row">
                <div>Album Name:</div>
                <AlbumField album={album} isEditMode={isEditMode} fieldName="name"/>
            </div>
            <div className="App-Row">
                <div>Artist:</div>
                <div>
                    {artistNameField}
                </div>
            </div>
            <div className="App-Row">
                <div>Release Year:</div>
                <AlbumField album={album} isEditMode={isEditMode} fieldName="releaseYear"/>
            </div>
            <div className="App-Row">
                <div>Number of listens:</div>
                <AlbumField album={album} isEditMode={isEditMode} fieldName="numberListens"/>
            </div>
            <AlbumControls album={album} isEditMode={isEditMode} setIsEditMode={setIsEditMode} setAlbum={setAlbum}/>
        </>
    );
}

function AddSongModal({album, setAlbum, modal, setModal})
{
    const [name, setName] = useState("");
    const [releaseYear, setReleaseYear] = useState("");

    if(!modal)
    {
        return;
    }

    return(<div className="App-Modal">
        <div className="App-Modal-Content">
            <div className="App-Modal-Title">
                Add Song(s) to {album.name}
            </div>
            <div className="App-Modal-Body">
                <div className="App-Modal-Row">
                    <div>Name</div>
                    <div>
                        <input
                            value={name}
                            onChange={(e)=>{
                                setName(e.target.value);
                            }}
                            />
                    </div>
                </div>
                <div className="App-Modal-Row">
                    <div>Release Year:</div>
                    <div>
                        <input
                            value={releaseYear}
                            onChange={(e)=>{
                                setReleaseYear(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="App-Modal-Foot">
                <button
                    className="App-Button-Submit App-Button"
                    onClick={(e)=>{
                        axios.post('http://localhost:3000/songs/addSong', {
                            idAlbum:album.idalbum,
                            name,
                            releaseYear
                        }).then((res)=>{
                            let idSong = res.data.idSong;
                            album.songs.push({name, idSong});
                            setAlbum(album);
                            setModal(false);
                        });
                    }}
                >Done</button>
            </div>
        </div>
    </div>);
}

function Album({album, setAlbum, isEditMode, setIsEditMode, modal, setModal})
{
    return(
        <>
            <div>
                    <h3>Album:</h3>
                    <AlbumDetails album={album} isEditMode={isEditMode} setIsEditMode={setIsEditMode} modal={modal} setModal={setModal} setAlbum={setAlbum}/>
                    <h3>Songs:</h3>
                    <AlbumSongs album={album} />
                    <div>
                        <button
                            className="App-Button App-Button-Submit"
                            onClick={(e)=>{
                                setModal(true);
                            }}
                        >
                            Add song
                        </button>
                    </div>
            </div>
            <AddSongModal modal={modal} setModal={setModal} album={album} setAlbum={setAlbum}/>
        </>
    );
}



function AlbumComponent({album, setAlbum})
{
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modal, setModal] = useState(false);

    let albumNode = album?(<Album album={album} setAlbum={setAlbum} isEditMode={isEditMode} setIsEditMode={setIsEditMode} setModal={setModal} modal={modal}  />):"";

    return (<div className="App-Album-Component">
        <div className="App-Container">
            <div className="App-Search-Container">
                <AlbumSearchBar searchText={searchText} setSearchText={setSearchText} setSearchResults={setSearchResults} />
                <AlbumSearchResults searchResults={searchResults} setAlbum={setAlbum} setSearchText={setSearchText} setSearchResults={setSearchResults} />
            </div>
            {albumNode}
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

                });
        })();
    }, [id]);

    return (<AlbumComponent album={album} setAlbum={setAlbum}/>);
}

export default Container;