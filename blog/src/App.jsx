import { useState } from 'react'
import { Routes, Route, useParams } from "react-router-dom"
import './App.css'
import NavBar from './NavBar'
import Home from './Home'
import CategorySelection from './CategorySelection'
import NewEntry from './NewEntry'
import ShowEntry from './ShowEntry'

let newEntryId = 1

function App() {
  const [entries, setEntries] = useState([])

  const [categories, setCategories] = useState([
    {id:1, name: "Food"},
    {id:2, name: "Gaming"},
    {id:3, name: "Coding"},
    {id:4, name: "Other"}
  ])

  const addEntry = (cat_id, content) => {
    // console.log(cat_id, content)
    const newEntry = { id: newEntryId++, category: cat_id, content: content }
    setEntries([...entries, newEntry])
    //console.log(entries)
    return newEntryId-1
  }

  const ShowEntryWrapper = () => {
    const { id } = useParams()
    const entry = entries.find(e => e.id == id)
    return entry ? <ShowEntry entry={entry}/> : <h3>Entry not foound!</h3>
  }

  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/category" element={<CategorySelection categories={categories}/>}/>
        <Route path="/entry" >
          <Route path=":id" element={<ShowEntryWrapper />}/>
          <Route path="new/:cat_id" element={<NewEntry categories={categories} addEntry={addEntry}/>}/>
        </Route>
        <Route path="*"/>
      </Routes>
    </>
  )
}

export default App
