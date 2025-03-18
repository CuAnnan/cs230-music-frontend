import {Link, useParams} from "react-router";
import {useEffect, useId, useState} from "react";
import axios from "axios";

function SongSearchBar({searchText, setSearchText, setSearchResults})
{
    const searchInputId = useId();
    return (
        <div className="App-Songs-SearchBar">
            <form onSubmit={(e)=>e.preventDefault()}>
                <div className="SearchBarElement">
                    <label htmlFor={searchInputId}>Song Search</label>
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
                                   axios.get(`http://localhost:3000/songs/startingWith/${e.target.value}`)
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


function SongSearchResult({song, setSearchText, setSearchResults})
{
    let songLink = `/songs/${encodeURIComponent(song.name)}/${song.idSong}`;
    return (
        <Link to={songLink}><div
            data-id-songs={song.idSong}
            className="App-SearchResult" onClick={(e)=>{
            setSearchText("");
            setSearchResults([]);
        }}>
            {song.name}
        </div></Link>
    );
}

function SongSearchResults({searchResults, setSearchResults, setSearchText})
{
    const rows = [];
    if(!searchResults)
    {
        return;
    }
    searchResults.forEach((song)=>{
        if(song)
        {
            rows.push(
                <SongSearchResult key={song.idSong} song={song} setSearchText={setSearchText} setSearchResults={setSearchResults} />
            );
        }
    });

    return (<div className="App-SearchResults-Container"><div className="App-SearchResults">
        {rows}
    </div></div>);
}

function SongDetail({song, setSong, fieldName, isEditMode})
{
    const [field, setField] = useState(song[fieldName]);

    if(isEditMode)
    {
        return (<div>
            <input
                value={field}
                onChange={(e)=>{
                    setField(e.target.value);
                    song[fieldName] = e.target.value;
                    setSong(song);
                }}
                />
        </div>);
    }
    else
    {
        return (<div>{song[fieldName]}</div>);
    }
}


function SongDetails({song, setSong, isEditMode, setIsEditMode})
{
    const linkURL = `/albums/${encodeURIComponent(song.albumName)}/${song.idAlbum}`;
    return (<>
        <h3>Song</h3>
        <div className="App-Row">
            <div>Name: </div>
            <SongDetail song={song} setSong={setSong} fieldName="name" isEditMode={isEditMode} />
        </div>
        <div className="App-Row">
            <div>Album: </div>
            <div>
                <Link to={linkURL}>{song.albumName}</Link>
            </div>
        </div>
        <div className="App-Row">
            <div>Release Year:</div>
            <SongDetail song={song} setSong={setSong} fieldName="releaseYear" isEditMode={isEditMode} />
        </div>
        <div>
            <button
                className="App-Button App-Button-Submit"
                onClick={(e)=>{
                    if(isEditMode)
                    {
                        axios.patch(`http://localhost:3000/songs/${song.idSong}`,
                            song
                        ).then((res)=>{
                            console.log(res.data);
                        });
                        setIsEditMode(false);
                    }
                    else
                    {
                        setIsEditMode(true);
                    }
                }}>
                {isEditMode ? "Save Song" : "Edit Song"}
            </button>
            <button
                className="App-Button App-Button-Cancel"
                onClick={(e)=>{
                    axios.delete(`http://localhost:3000/songs/${song.idsong}`).then(res=>{
                        window.location.href="/songs";
                    })
                }}>
                Delete Song
            </button>
        </div>
    </>);
}

function SongComponent({song, setSong})
{
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    let songNode = song?(<SongDetails song={song} isEditMode={isEditMode} setIsEditMode={setIsEditMode} setSong={setSong}/>):"";

    return(<div className="App-Song-Component">
        <div className="App-Container">
            <div className="App-Search-Container">
                <SongSearchBar searchText={searchText} setSearchText={setSearchText} setSearchResults={setSearchResults} />
                <SongSearchResults searchResults={searchResults} setSong={setSong} setSearchText={setSearchText} setSearchResults={setSearchResults} />
            </div>
            {songNode}
        </div>
    </div>);
}

function Container()
{
    const {id} = useParams();
    const [song, setSong] = useState(null);

    useEffect(() => {
        if(!id)
        {
            setSong(null);
            return;
        }
        (async () => {
            axios.get(`http://localhost:3000/songs/${id}`)
                .then(res => {
                    setSong(res.data);
                }).catch(err => {
                console.warn(err)
            });
        })();
    }, [id]);


    return (<SongComponent song={song} setSong={setSong}/>);
}

export default Container;