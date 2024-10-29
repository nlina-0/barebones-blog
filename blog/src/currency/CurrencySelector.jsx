import React, { useEffect, useState } from 'react'

function CurrencySelector({ currency, setCurrency }) {
    const [currencies, setCurrencies] = useState(
        [
            {
                "currency": "AUD",
                "country": "Australia Dollar"
            }
        ]
    )

    useEffect(() => {
        fetch('https://api.coindesk.com/v1/bpi/supported-currencies.json')
            .then(res => res.json())
            .then(data => setCurrencies(data))
    })

    return (
        <select value={currency} onChange={() => setCurrency(event.target.value)}>
            {currencies.map(cur => <option value={cur.currency}>{cur.country}</option>)}
        </select>
    )
}

export default CurrencySelector