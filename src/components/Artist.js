import { useState, useId, useEffect} from 'react';
import { useParams, Link } from "react-router";
import Navbar from './Navbar';
import axios from 'axios';

function ArtistSearchBar({searchText, setSearchText, setSearchResults, setNewArtistModal})
{
    const searchInputId = useId();
    return (
        <div className="App-Artists-SearchBar">
            <form onSubmit={(e)=>e.preventDefault()}>
                <div className="SearchBarElement">
                    <label htmlFor={searchInputId}>Artist Search</label>
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
                            axios.get(`http://localhost:3000/artists/startingWith/${e.target.value}`)
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
                <div className="SearchBarElement">
                    <button
                        className="App-Button App-Button-Submit"
                        onClick={()=>{
                            setNewArtistModal(true);
                        }}
                    >
                        Add new Artist
                    </button>
                </div>
            </form>
        </div>
    );
}



function ArtistSearchResult({artist, setArtist, setSearchText, setSearchResults})
{
    let artistLink = `/artists/${encodeURIComponent(artist.name)}/${artist.idArtist}`;
    return (
        <Link to={artistLink}><div
            data-id-artists={artist.idArtist}
            className="App-SearchResult" onClick={(e)=>{
                setSearchText("");
                setSearchResults([]);
        }}>
            {artist.name}
        </div></Link>
    );
}

function ArtistSearchResults({searchResults, setSearchResults, setArtist, setSearchText})
{
    const rows = [];
    if(!searchResults)
    {
        return;
    }
    searchResults.forEach((artist)=>{
        if(artist)
        {
            rows.push(
                <ArtistSearchResult key={artist.idArtist} artist={artist} setArtist={setArtist} setSearchText={setSearchText} setSearchResults={setSearchResults} />
            );
        }
    });

    return (<div className="App-SearchResults-Container"><div className="App-SearchResults">
        {rows}
    </div></div>);
}

function ArtistGenre({genre, artist, isEditMode})
{
    return (
        <span
            data-id-genre={genre.idGenre}
            data-id-artist={artist.idartist}
            className="App-Artists-Genre"
            onClick={(e)=>{
                if(isEditMode)
                {
                    artist.genres = artist.genres.filter((genre)=>{
                        return parseInt(genre.idGenre) !== parseInt(e.target.dataset.idGenre)
                    });
                    e.target.style.display="none";
                }
                else
                {

                }
            }}>
            {genre.name}{(isEditMode)?" ⓧ":""}
        </span>);
}

function ArtistControls({artist, isEditMode, setIsEditMode})
{
    let editButtonText = isEditMode?"Save":"Edit";
    return (<div>
        <button className="App-Button App-Button-Edit" onClick={(e)=>{
            setIsEditMode(!isEditMode);
            if(isEditMode)
            {
                axios.patch(
                    "http://localhost:3000/artists",
                    artist,
                    { headers: { 'Content-Type': 'application/json'}}
                ).then(()=>{
                    setIsEditMode(false);
                });
            }
        }}>
            {editButtonText}
        </button>
        <button
            className="App-Button App-Button-Delete"
            onClick={(e)=>{
                axios.delete(
                    "http://localhost:3000/artists/" + artist.idartist
                ).then((result)=>{
                    window.location.href=(`/artists/`);
                });
            }}
        >
            Delete
        </button>
    </div>);
}

function ArtistField({artist, fieldName, fieldValue, isEditMode})
{
    const [field, setField] = useState(fieldValue);

    if(isEditMode)
    {
        return (<div>
            <input value={field} onChange={(e)=>{
                artist[fieldName] = e.target.value;
                setField(e.target.value);
            }}/>
        </div>);
    }
    else
    {
        return (<div>{fieldValue}</div>);
    }
}

function ArtistGenreAdd({artist, modal, setModal})
{
    return (<span className="App-Artists-Genre" onClick={(e)=>{
            setModal(!modal);
        }}>Add new genre ⊕</span>);
}

function ArtistAddGenreModal({artist, modal, setModal})
{
    const [genres, setGenres] = useState("");

    if(!modal)
    {
        return;
    }

    return(<div className="App-Modal">
        <div className="App-Modal-Content">
            <div className="App-Modal-Title">
                Add Genre(s) to {artist.name}
            </div>
            <div className="App-Modal-Body">
                <div>
                    Enter a comma separated list:
                </div>
                <div>
                    <input
                        value={genres}
                        onChange={(e)=>{
                            setGenres(e.target.value)
                        }}/>
                </div>
            </div>
            <div className="App-Modal-Foot">
                <button
                    className="App-Button-Submit App-Button"
                    onClick={(e)=>{
                        if(genres) {
                            let pendingGenres = genres.split(',');
                            artist.pendingGenres = artist.pendingGenres?artist.pendingGenres:[];
                            let i = artist.pendingGenres.length > 0 ? artist.pendingGenres[artist.pendingGenres.length - 1].idGenre : 0;
                            for (let pendingGenre of pendingGenres) {
                                i++;
                                artist.pendingGenres.push({idGenre: i, pending:true, name: pendingGenre.trim()});
                            }
                        }
                        setModal(false);
                        setGenres("");
                    }}
                >Done</button>
            </div>
        </div>
    </div>);
}

function PendingGenre({artist, genre, isEditMode})
{
    return (
        <span
            data-id-genre={genre.idGenre}
            data-id-artist={artist.idartist}
            className="App-Artists-Genre"
            onClick={(e)=>{
                if(isEditMode)
                {
                    artist.pendingGenres = artist.pendingGenres.filter((genre)=>{
                        return parseInt(genre.idGenre) !== parseInt(e.target.dataset.idGenre)
                    });
                    e.target.style.display="none";
                }
                else
                {

                }
            }}>
            {genre.name}{(isEditMode)?" ⓧ":""}
        </span>);
}

function Artist({artist, isEditMode, setIsEditMode, modal, setModal})
{
    if(artist) {
        let artistGenres = [];
        artist.genres.forEach(genre=>{
            artistGenres.push(
                <ArtistGenre key={genre.idGenre} genre={genre} artist={artist} isEditMode={isEditMode}/>
            );
        });
        if(artist.pendingGenres) {
            artist.pendingGenres.forEach(genre => {
                artistGenres.push(
                    <PendingGenre key={"p"+genre.idGenre} genre={genre} artist={artist} isEditMode={isEditMode}/>
                );
            });
        }
        if(isEditMode)
        {
            artistGenres.push(
                <ArtistGenreAdd key="-1" artist={artist} modal={modal} setModal={setModal}/>
            );
        }


        return (<div className="App-Container">
            <div className="App-Row">
                <div>Artist Name:</div>
                <ArtistField artist={artist} fieldName="name" fieldValue={artist.name} isEditMode={isEditMode} />
            </div>
            <div className="App-Row">
                <div>Monthly Listeners:</div>
                <ArtistField artist={artist} fieldName="monthlyListeners" fieldValue={artist.monthlyListeners} isEditMode={isEditMode} />
            </div>
            <div className="App-Row">
                <div>Genres:</div>
                <div>{artistGenres}</div>
            </div>
            <ArtistControls artist={artist} isEditMode={isEditMode} setIsEditMode={setIsEditMode} modal={modal} setModal={setModal} />
            <ArtistAddGenreModal artist={artist} modal={modal} setModal={setModal} />
        </div>);
    }

}

function ArtistDetails({artist, isEditMode, setIsEditMode, modal, setModal})
{
    if(!artist) return;
    return(
        <div>
            <h3>Artist:</h3>
            <Artist artist={artist} isEditMode={isEditMode} setIsEditMode={setIsEditMode} modal={modal} setModal={setModal}/>
        </div>
    );
}


function AlbumName({album})
{
    return (<div className="App-Album-Name">
        <Link to={`/albums/${encodeURIComponent(album.name)}/${album.idAlbum}`}>{album.name}</Link>
    </div>);
}

function AlbumNames({artist})
{
    if(!artist) return;
    let albums = [];
    artist.albums.forEach(album => {
        albums.push(
            <AlbumName key={album.idAlbum} album={album}/>
        );
    });
    return (
        <div className="App-Album-Names">
            <h3>Albums:</h3>
            {albums}
        </div>
    );
}

function NewArtistModal({newArtistModal, setNewArtistModal, setArtist})
{
    const [newArtistName, setNewArtistName] = useState("");
    const [artistGenreString, setArtistGenreString] = useState("");
    const [monthlyListeners, setMonthlyListeners] = useState("");

    if(!newArtistModal) return;


    return(<div className="App-Modal">
        <div className="App-Modal-Content">
            <div className="App-Modal-Title">
                New Artist
            </div>
            <div className="App-Modal-Body">
                <div className="App-Modal-Row">
                    <div>
                        Band Name:
                    </div>
                    <div>
                        <input
                            value={newArtistName}
                            onChange={(e)=>{
                                setNewArtistName(e.target.value);
                            }}/>
                    </div>
                </div>
                <div className="App-Modal-Row">
                    <div>Monthly Listeners:</div>
                    <div>
                        <input
                            value={monthlyListeners}
                            onChange={(e)=>{
                                setMonthlyListeners(e.target.value);
                            }}/>
                    </div>
                </div>
                <div className="App-Modal-Row">
                    <div>Genres:</div>
                    <div>
                        <input
                            value={artistGenreString}
                            onChange={(e)=>{
                                setArtistGenreString(e.target.value);
                            }}/>
                    </div>
                </div>
            </div>
            <div className="App-Modal-Foot">
                <button
                    className="App-Button-Submit App-Button"
                    onClick={(e)=>{
                        let genres = [];
                        artistGenreString.split(',').forEach(genre=>{
                            genres.push({name:genre.trim()});
                        });
                        let artist = {
                            name:newArtistName,
                            genres,
                            monthlyListeners
                        };
                        axios.post(
                            'http://localhost:3000/artists',
                            artist
                        ).then(res=>{
                            window.location.href=(`/artists/${encodeURIComponent(artist.name)}/${res.data.idArtist}`);
                        });
                    }}>
                    Done
                </button>
                <button
                    className="App-Button-Delete App-Button"
                    onClick={(e)=>{
                        setNewArtistModal(false);
                    }}>
                    Cancel
                </button>
            </div>
        </div>
    </div>);
}


function ArtistComponent({artist, setArtist})
{
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [genresModal, setGenresModal] = useState(false);
    const [newArtistModal, setNewArtistModal] = useState(false);


    return (<div className="App-Author-Component">
        <div className="App-Search-Container">
            <ArtistSearchBar searchText={searchText} setSearchText={setSearchText} setSearchResults={setSearchResults} newArtistModal={newArtistModal} setNewArtistModal={setNewArtistModal} />
            <ArtistSearchResults searchResults={searchResults} setArtist={setArtist} setSearchText={setSearchText} setSearchResults={setSearchResults} />
        </div>
        <ArtistDetails artist={artist} isEditMode={isEditMode} setIsEditMode={setIsEditMode} modal={genresModal} setModal={setGenresModal}/>
        <AlbumNames artist={artist}/>
        <NewArtistModal newArtistModal={newArtistModal} setNewArtistModal={setNewArtistModal} setArtist={setArtist}/>
    </div>);
}

function Container()
{
    const {id} = useParams();
    const [artist, setArtist] = useState(null);

    useEffect(() => {
        if(!id)
        {
            setArtist(null);
            return;
        }
        (async () => {
            axios.get(`http://localhost:3000/artists/${id}`)
                .then(res => {
                    console.log(res.data);
                    setArtist(res.data);
                }).catch(err => {
                    console.log(err)
                });
        })();
    }, [id]);



    return (<div className="App">
        <header className="App-header">
            <div>
                <Navbar />
                <ArtistComponent artist={artist} setArtist={setArtist}/>
            </div>
        </header>
    </div>);
}

export default Container;