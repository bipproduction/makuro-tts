const { fetch } = require('cross-fetch')

content()
// generate()


async function content(argv) {
    fetch('http://localhost:3000/api/mp3/tmp-content', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer U2FsdGVkX18HMhN6Qf4pUhXozz9vTWK4O2b3kPEvsFM=`
        }
    }).then(async (val) => {
        const a = await val.json()
        console.log(a)
        // const a = await val.json()
        // console.log(a)
    })
}

async function generate(argv) {
    fetch('http://localhost:3000/api/mp3/generate', {
        method: 'POST',
        body: JSON.stringify({ text: "apakabar pipah , kamu sudah makan apa belum ?" }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer U2FsdGVkX18HMhN6Qf4pUhXozz9vTWK4O2b3kPEvsFM=`
        }
    }).then(async (val) => {
        const a = await val.json()
        console.log(a)
    })
}

