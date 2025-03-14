import { useState, useId, useEffect} from 'react';
import { useParams, Link } from "react-router";
import Navbar from './Navbar';
import axios from 'axios';

function AlbumSearchBar()
{

}

function AlbumSearchResults()
{

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
            <div className="App-Container">
                <h3>Album:</h3>
                <AlbumDetails album={album} isEditMode={isEditMode} setIsEditMode={setIsEditMode} modal={modal} setModal={setModal}/>
                <h3>Songs:</h3>
                <AlbumSongs album={album} />
            </div>
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
        <div className="App-Album-SearchContainer">
            <AlbumSearchBar searchText={searchText} setSearchText={setSearchText} setSearchResults={setSearchResults} />
            <AlbumSearchResults searchResults={searchResults} setAlbum={setAlbum} setSearchText={setSearchText} setSearchResults={setSearchResults} />
        </div>
        <Album album={album} isEditMode={isEditMode} setIsEditMode={setIsEditMode} setModal={setModal} modal={modal}  />
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
                    console.log(res.data);
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