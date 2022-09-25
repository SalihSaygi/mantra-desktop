import ReactDOM from 'react-dom'
import React, { useState, useEffect } from 'react';
import './App.css'
// import Notes from './Notes/Main';
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import Categories from './Categories/Main';
import EditorMain from './Editor/Main';
import Categories from './Categories/Main';
import Notes from './Notes/Main';
import Landing from './Landing';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'


const App: React.FC<{}> = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />}/>
          <Route path="notes" element={<Notes />}/>
          <Route path='noteEditor'>
            <Route path=":id" element={<EditorMain />}/>
          </Route>
          <Route path="categories" element={<Categories /> }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App
