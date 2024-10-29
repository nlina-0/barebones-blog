import React, { useState } from 'react'
import CoinBase from './CoinBase'
import CurrencySelector from './CurrencySelector'

function Currency() {
    const [currency, setCurrency] = useState("AUD")

    // Abstract away setCurrency from CurrencySelector component, so it doesn't know what setCurrency is
    const updateCurrency = (code) => {
        // Validation of code
        setCurrency(code)
    }

    return (
        <>
            <CoinBase currency={currency}/>
            <CurrencySelector currency={currency} setCurrency={updateCurrency}/>
        </>
    )
}

export default Currency