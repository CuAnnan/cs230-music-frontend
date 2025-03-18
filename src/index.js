import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Artist from './components/Artist';
import Album from './components/Album';
import Song from "./components/Song";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router";

const root = ReactDOM.createRoot(document.getElementById('root'));

/*
render(

);
 */

root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App />}>
                  <Route path="artists" element={<Artist />}>
                      <Route path=":name/:id" element={<Artist/>}/>
                  </Route>
                  <Route path="albums" element={<Album/>}>
                      <Route path=":name/:id" element={<Album/>}/>
                  </Route>
                  <Route path="songs" element={<Song/>}>
                      <Route path=":name/:id" element={<Song/>}/>
                  </Route>
              </Route>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
