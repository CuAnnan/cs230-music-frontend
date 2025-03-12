import { useState, useId, useEffect} from 'react';
import axios from 'axios';
const controller = new AbortController();
let changeEvents = 0;

function handleChange(e)
{
    console.log(e);
}

function SearchBar()
{
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchInputId = useId();



    return (
        <div>
            <div className="App-Artists-SearchBar">
                <div className="SearchBarElement">
                    <label htmlFor={searchInputId}>Search</label>
                </div>
                <div className="SearchBarElement">
                    <input type="text"
                           id={searchInputId}
                           value={searchText}
                           onChange={(e)=>{
                               setSearchText(e.target.value);
                               axios.get(`http://localhost:3000/artists/startingWith/${e.target.value}`).then(res=>{
                                   res.data.forEach((band)=>{
                                       console.log(band);
                                   });

                               });
                           }}/>
                </div>
            </div>
            <div>

            </div>
        </div>
    );
}


export default SearchBar;