# Makuro TTS

## API

### REGISTER

POST /api/register

```js
{
    username: string
    email: string
    password: string
    confirm_password: string
}
```

### LOGIN

POST /api/login

```js
{
    email: string
    password: string
}
```

### GENERATE
POST /api/mp3/generate

auth: token

body  
```json
{
    "text": "text pengucapan"
}
```

response:  
```json
[
    {
        "name": "audio01.mp3",
        "text": "text from split"
    }
]
```

### LOAD MP#

GET /api/mp3/load/[name]/[token]


