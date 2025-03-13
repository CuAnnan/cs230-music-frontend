import { useState, useId} from 'react';
import axios from 'axios';

function ArtistSearchBar({searchText, setSearchText, setSearchResults})
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
            </form>
        </div>
    );
}

function ArtistSearchResult({artist, setArtist, setSearchText, setSearchResults})
{
    return (
        <div
            data-id-artists={artist.idArtist}
            className="App-Artists-SearchResult"
            onClick={(e)=>{
                axios.get(`http://localhost:3000/artists/${artist.idArtist}`)
                    .then(res=>{
                       setArtist(res.data);
                       setSearchText("");
                       setSearchResults([]);
                    });
            }}>
                {artist.name}
        </div>
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

    return (<div className="App-Artists-SearchResults-Container"><div className="App-Artists-SearchResults">
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
                    console.log(artist);
                });
            }
        }}>
            {editButtonText}
        </button>
        <button className="App-Button App-Button-Delete">Delete</button>
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

function Artist({artist, isEditMode, setIsEditMode})
{
    if(artist) {
        let artistGenres = [];
        artist.genres.forEach(genre=>{
            artistGenres.push(
                <ArtistGenre key={genre.idGenre} genre={genre} artist={artist} isEditMode={isEditMode}/>
            );
        });


        return (<div className="App-Artist">
            <div className="App-Artist-Row">
                <div>Artist Name:</div>
                <ArtistField artist={artist} fieldName="name" fieldValue={artist.name} isEditMode={isEditMode} />
            </div>
            <div className="App-Artist-Row">
                <div>Monthly Listeners:</div>
                <ArtistField artist={artist} fieldName="monthlyListeners" fieldValue={artist.monthlyListeners} isEditMode={isEditMode} />
            </div>
            <div className="App-Artist-Row">
                <div>Genres:</div>
                <div>{artistGenres}</div>
            </div>
            <ArtistControls artist={artist} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
        </div>);
    }

}


function ArtistComponent()
{
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [artist, setArtist] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    return (<div className="App-Author-Component">
        <div className="App-Artist-SearchContainer">
            <ArtistSearchBar searchText={searchText} setSearchText={setSearchText} setSearchResults={setSearchResults} />
            <ArtistSearchResults searchResults={searchResults} setArtist={setArtist} setSearchText={setSearchText} setSearchResults={setSearchResults} />
        </div>
        <Artist artist={artist} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
    </div>);
}

export default ArtistComponent;