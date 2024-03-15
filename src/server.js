import cookieParser from 'cookie-parser';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
const port = 3001;
import dotenv from 'dotenv';
dotenv.config();



const app = express()
app.engine('hbs', engine({ extname: ".hbs" }));
app.set('view engine', 'hbs');
app.set('views', path.join(new URL(import.meta.dirname).pathname, "views"));

import bodyParser from "body-parser" ;
import { URLSearchParams }  from 'url';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser("trung"))


app.get("/", async (req, res) => {
    res.render('mainviews/index')
})


const urlGG = 'https://accounts.google.com/o/oauth2/v2/auth'
const client_id = '1058157169427-lfobns7gv3pp13md7adtc9g2c3jgg7qn.apps.googleusercontent.com'
const client_secret = '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'
const response_type = 'code'
const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
// const redirect_uri ='http://localhost:3000/auth/cb'


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
const state = "vochitrung"


app.get("/zalo", async (req, res) => {
    res.redirect(`https://oauth.zaloapp.com/v4/permission?app_id=${app_id}&redirect_uri=${redirect_uri}&state=${state}`)
})

app.get("/zalo/callback", async (req, res) => {
    // Lấy code từ callback query
    // Sau đó dùng code đó để lấy access_token 
    rs = await fetch("https://oauth.zaloapp.com/v4/access_token", {
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
    res.send(data)
})

app.get("/user", async (req, res) => {
    const userJson = await fetch("https://graph.zalo.me/v2.0/me?fields=id,name,picture", {
        method: "get",
        headers: {
            "access_token": "QML4NoL8W4DgO4nT9a-6GsncILGYKzvDEIjp47LVsL9cA1qLS7pMOtvAR0fDPieMUJm1MqfUgYC48s0yIKxVVNCQ5mqoEDzF8quL5n1XXbeuBJWYSNsmLqCp0J1mGSHh9Hrq1ZD_mdCJ5dyg94FKOJqv7WKAUvfo4GfG4ILXwmnhDKPKPbUA54aTF09cGQ9cKHmMU65maZalMproFG_sBYbLGMiL7unm068a9mfBW7a49ICY1Kw8N0qZDq82SuuaII0GJNbfl31qFWTvPsY-Rr4aBJLUTUDAQGXc5KLTwKmFDqSa44NzPG0NS2n9LRjhI3fp0c8CxM0lBtW36rtn5I4nNrWFPk83G0reJbbru3bC1LrcV4pYVsbu6_ml9L2AGW"
        }
    })
    const userData = await userJson.json()
    res.send(userData)
})

app.get("/zalo_verifierQUUuA8pZRnu7biW5qkTj4IR7sGxAiGfGCZOo.html", async (req, res) => {
    res.sendFile(path.join(new URL(import.meta.dirname).pathname, "zalo/zalo_verifierQUUuA8pZRnu7biW5qkTj4IR7sGxAiGfGCZOo.html"))
})

import fetch from 'node-fetch';




const GetDataViaProxy = async (url, agent) => {
    let response = await fetch(url, { agent });
    console.log(response)
    let data = await response.json();
    console.log(data);
}


const endpoint = "https://graph.zalo.me/v2.0/me/info";
const userAccessToken = "your_user_access_token";
const token = "your_token";
const secretKey = "your_zalo_app_secret_key";


app.listen(port, () => {
    console.log("Server is runing on port: " + port)
})