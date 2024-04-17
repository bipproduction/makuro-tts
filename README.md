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