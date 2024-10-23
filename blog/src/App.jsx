import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CoinBase from './CoinBase'
import CurrencySelector from './CurrencySelector'
import Currency from './Currency'

function App() {
  const [currency, setCurrency] = useState("AUD")

  // Abstract away setCurrency from CurrencySelector component, so it doesn't know what setCurrency is
  const updateCurrency = (code) => {
    // Validation of code
    setCurrency(code)
  }

  return (
    <>
      <Currency />
      <CoinBase currency={currency}/>
      <CurrencySelector currency={currency} setCurrency={updateCurrency}/>
    </>
  )
}

export default App
