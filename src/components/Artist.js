import { useState, useId } from 'react';

function SearchBar({searchText, onSearchTextChange})
{
    const searchInputId = useId();
    return (<div className="App-Artist-Searchbar">
        <form>
            <div className="SearchBarElement">
                <label htmlFor={searchInputId}>Search</label>
            </div>
            <div className="SearchBarElement">
                <input type="text"
                       id={searchInputId}
                       value={searchText}
                       onChange={(e)=>onSearchTextChange(e.target.value)}/>
            </div>
        </form>
    </div>);
}

function ArtistsTable({artists})
{
    const [searchText, setSearchText] = useState('');
    return (
        <div className="App-Artitsts-Container">
            <SearchBar searchText={searchText} onSearchTextChange={setSearchText}/>

        </div>
    );
}

export default ArtistsTable;