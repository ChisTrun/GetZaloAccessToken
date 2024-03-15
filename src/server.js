const cookieParser = require('cookie-parser');
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path')
const jwt = require('jsonwebtoken');
const port = 3001
const https = require('https')
require("dotenv").config()



const app = express()
app.engine('hbs', engine({extname: ".hbs"}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,"views"));

const bodyParser = require("body-parser");
const { URLSearchParams } = require('url');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser("trung"))


app.get("/",async (req,res) => {
    res.render('mainviews/index')
})


const urlGG = 'https://accounts.google.com/o/oauth2/v2/auth'
const client_id = '1058157169427-lfobns7gv3pp13md7adtc9g2c3jgg7qn.apps.googleusercontent.com'
const client_secret = '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'
const response_type = 'code'
const scopes = ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
// const redirect_uri ='http://localhost:3000/auth/cb'
const axios = require('axios');


//GOOGLE
// app.get("/auth",async (req,res) => {
//     const queries = new URLSearchParams({
//         response_type,
//         redirect_uri,
//         client_id,
//         scope: scopes.join(' ')
//     })
//     res.redirect(`${urlGG}?${queries.toString()}`);
// })
// const grant_type = 'authorization_code'
// app.get("/auth/cb",async (req,res) => {
//     let code = req.query.code
//     console.log(code)
//     const options = {
//         code,
//         grant_type,
//         client_id,
//         client_secret,
//         redirect_uri
//     }
//     const rs = await fetch('https://accounts.google.com/o/oauth2/token',{
//         method: 'post',
//         headers: {
//             "Content-Type" : "application/json"
//         },
//         body: JSON.stringify(options)
//     })

//     //test 
    
//     const data = await rs.json();
//     const userDataJson = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?al=json&access_token=${data.access_token}`,{
//         headers: {
//             Atuthoriaztion: `Bearer ${data.id_token}`
//         }
//     })
    
//     const userData = await userDataJson.json();
//     console.log(userData)
    
//     console.log(data)
//     console.log(jwt.decode(data.id_token))
//     res.send("end")
// })


//ZALO
async function createCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const base64url = btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return base64url;
}

const secret_key = process.env.SECRET_KEY
// const code_verifier = "w2S8X9X5ulFf8PpN7C5bM333oblIo39mnKdnxmI3xPw" optional
const app_id = process.env.APP_ID
const redirect_uri = "https://getzaloaccesstoken.onrender.com/zalo/callback"
const state ="vochitrung"


app.get("/zalo",async (req,res) => {
    res.redirect(`https://oauth.zaloapp.com/v4/permission?app_id=${app_id}&redirect_uri=${redirect_uri}&state=${state}`)
})

app.get("/zalo/callback", async (req,res) => {
    // Lấy code từ callback query
    // Sau đó dùng code đó để lấy access_token 
    rs = await fetch("https://oauth.zaloapp.com/v4/access_token",{
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "secret_key": secret_key
        },
        body: new URLSearchParams({
            code: req.query.code,
            app_id: app_id,
            grant_type: 'authorization_code',
          }),
    })
    const data = await rs.json()
    // const userJson = await fetch("https://graph.zalo.me/v2.0/me?fields=id,name,picture",{
    //     method: "get",
    //     headers: {
    //         "access_token" : data.access_token
    //     }
    // })
    // const userData = await userJson.json()
   
    res.send(data)
})

app.get("/user", async (req,res) => {
    const userJson = await fetch("https://graph.zalo.me/v2.0/me?fields=id,name,picture",{
        method: "get",
        headers: {
            "access_token" : "QML4NoL8W4DgO4nT9a-6GsncILGYKzvDEIjp47LVsL9cA1qLS7pMOtvAR0fDPieMUJm1MqfUgYC48s0yIKxVVNCQ5mqoEDzF8quL5n1XXbeuBJWYSNsmLqCp0J1mGSHh9Hrq1ZD_mdCJ5dyg94FKOJqv7WKAUvfo4GfG4ILXwmnhDKPKPbUA54aTF09cGQ9cKHmMU65maZalMproFG_sBYbLGMiL7unm068a9mfBW7a49ICY1Kw8N0qZDq82SuuaII0GJNbfl31qFWTvPsY-Rr4aBJLUTUDAQGXc5KLTwKmFDqSa44NzPG0NS2n9LRjhI3fp0c8CxM0lBtW36rtn5I4nNrWFPk83G0reJbbru3bC1LrcV4pYVsbu6_ml9L2AGW"
        }
    })
    const userData = await userJson.json()
    res.send(userData)
})

app.get("/zalo_verifierQUUuA8pZRnu7biW5qkTj4IR7sGxAiGfGCZOo.html",async (req,res) => {
    res.sendFile(path.join(__dirname,"zalo/zalo_verifierQUUuA8pZRnu7biW5qkTj4IR7sGxAiGfGCZOo.html"))
})

const fetch = require('node-fetch');
const {HttpsProxyAgent} = require('https-proxy-agent');

const proxy = 'http://171.247.204.98:8080/'; // Replace with your VPN proxy URL
const agent = new HttpsProxyAgent(proxy)



const GetDataViaProxy = async (url,agent) => {
    let response = await fetch(url, { agent });
    console.log(response)
    let data = await response.json();
    console.log(data);
}


app.get("/test/proxy",async (req,res) => {
    // const nomalData = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    // const user = await nomalData.json()
    // const data = await GetDataViaProxy("https://jsonplaceholder.typicode.com/todos/1",agent)
    res.send(user)
})


app.listen(port,() => {
    console.log("Server is runing on port: " + port)
})