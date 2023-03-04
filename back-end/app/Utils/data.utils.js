const CryptoJS = require("crypto-js");
const config = require("../Config/config");
const jwt = require("jsonwebtoken");

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

function generateAccessToken(email, password) {
    return accessToken = jwt.sign(
        {
            email: email,
            password: password
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
}


module.exports = {
    getData,
    getDataByKey,
    generateAccessToken
};
