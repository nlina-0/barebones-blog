import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import './App.css'
import NavBar from './NavBar'
import Home from './Home'
import CategorySelection from './CategorySelection'
import NewEntry from './NewEntry'

function App() {
  

  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/category" element={<CategorySelection />}/>
        <Route path="/entry" >
          <Route path="new/:cat_id" element={<NewEntry />}/>
        </Route>
        <Route path="*"/>
      </Routes>
    </>
  )
}

export default App
