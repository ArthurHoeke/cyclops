const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const fetch = require('node-fetch');

async function postData(url = '', data = {}, apikey) {
    try {
        response = await fetch(url, {
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
    } catch (err) {
        return JSON.stringify(err);
    }
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

function generateAccessToken(id, email, role) {
    return accessToken = jwt.sign(
        {
            id: id,
            email: email,
            role: role
        },
        JWT_SECRET,
        {
            expiresIn: "31d",
        }
    );
}

function compareAndCalculatePercentageDifference(average, value) {
    const difference = Math.abs(average - value);
    const percentageDifference = (difference / average) * 100;
    return percentageDifference;
}

function generateRandomHash() {
    return CryptoJS.lib.WordArray.random(16).toString();
}

function getCurrentTimeString() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function redConsoleLog(str) {
    return "\x1b[31m" + str + "\x1b[0m";
}

function greenConsoleLog(str) {
    return "\x1b[32m" + str + "\x1b[0m";
}

function yellowConsoleLog(str) {
    return "\x1b[33m" + str + "\x1b[0m";
}

function grayConsoleLog(str) {
    return "\x1b[90m" + str + "\x1b[0m";
}

function getDividerLogString() {
    return "----------------------------------------------------------------------";
}

module.exports = {
    getData,
    getDataByKey,
    generateAccessToken,
    generateRandomHash,
    postData,
    getCurrentTimeString,
    redConsoleLog,
    greenConsoleLog,
    yellowConsoleLog,
    grayConsoleLog,
    getDividerLogString,
    compareAndCalculatePercentageDifference
};
