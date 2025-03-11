
import { useState, useEffect } from 'react';

function SongRow({song})
{
    return (<div>{song.name}</div>);
}

function SongsTable({songs})
{
    const songRows = [];
    songs.forEach(song=>{
        songRows.push(
            <SongRow key={song.name} song={song}/>
        );
    });
    return (
        <div className="App-Songs">
            {songRows}
        </div>
    );
}

const Songs = () => {
    const [songs, setSongs] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3000/songs/')
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setSongs(data);
            });
    }, []);
    return (
        <div className="App-Songs-container">
            <SongsTable songs={songs}/>
        </div>
    );
};
export default Songs;
