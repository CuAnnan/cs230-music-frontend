import { NavLink} from "react-router";

function Navbar()
{
    /*
    <div className="App-Nav">
            <ul>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>isActive ? "active" : ""}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/artists"
                        className={({ isActive }) =>isActive ? "active" : ""}>
                        Artists
                    </NavLink>
                </li>
            </ul>
        </div>
     */
    return(<div className="App-Nav">
        <ul>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>isActive ? "active" : ""}>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/artists"
                    className={({ isActive }) =>isActive ? "active" : ""}>
                    Artists
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/albums"
                    className={({ isActive }) =>isActive ? "active" : ""}>
                    Albums
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/songs"
                    className={({ isActive }) =>isActive ? "active" : ""}>
                    Songs
                </NavLink>
            </li>
        </ul>
    </div>);
}
export default Navbar;