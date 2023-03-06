const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const fetch = require('node-fetch');

async function postData(url = '', data = {}, apikey) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apikey
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

async function getData(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    });
    return response.json();
}

async function getDataByKey(url = '', apikey) {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apikey
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    });
    return response.json();
}

function generateAccessToken(id, email, password, role) {
    return accessToken = jwt.sign(
        {
            id: id,
            email: email,
            password: password,
            role: role
        },
        JWT_SECRET,
        {
            expiresIn: "31d",
        }
    );
}

function generateRandomHash() {
    return CryptoJS.lib.WordArray.random(16).toString();
}


module.exports = {
    getData,
    getDataByKey,
    generateAccessToken,
    generateRandomHash,
    postData
};
