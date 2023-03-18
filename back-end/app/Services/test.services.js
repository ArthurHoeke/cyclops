const dataUtils = require('../Utils/data.utils');
const request = require('supertest');

function scheduleTest() {
    setTimeout(function () {
        ping();
    }, 10000);
}

let accessToken = null;

function ping() {
    console.log("Attempt: " + dataUtils.yellowConsoleLog("ping webservice"));
    request(app)
        .get('/')
        .expect(404)
        .end(function (err, res) {
            if (err) {
                throw err
            } else {
                console.log(dataUtils.greenConsoleLog("OK"));
                registerUser();
            }
        });
}

function registerUser() {
    console.log("Attempt: " + dataUtils.yellowConsoleLog("register user"));
    request(app)
        .post('/user/register')
        .send({
            email: 'test@company.com',
            password: 'test'
        })
        .expect(201)
        .end(function (err, res) {
            if (err) {
                throw err
            } else {
                console.log(dataUtils.greenConsoleLog("OK, received JWT: ") + res.body.accessToken);
                accessToken = res.body.accessToken;
                loginUser();
            }
        });
}

function loginUser() {
    console.log("Attempt: " + dataUtils.yellowConsoleLog("login user"));
    request(app)
        .post('/user/login')
        .send({
            email: 'test@company.com',
            password: 'test'
        })
        .expect(200)
        .end(function (err, res) {
            if (err) {
                throw err
            } else {
                console.log(dataUtils.greenConsoleLog("OK"));
                addKusamaNetwork();
            }
        });
}

function addKusamaNetwork() {
    console.log("Attempt: " + dataUtils.yellowConsoleLog("add network"));
    request(app)
        .post('/network/create')
        .set('auth-token', accessToken)
        .send({
            name: 'kusama',
            ticker: 'ksm',
            icon: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAG5UExURQAAAP39/fv7+/7+/gMDA/z8/AQEBP///wEBAQICAgQDAwYGBgIBAf/+/zs6OvDw8Orp6jAvLwgICAsLC4aFhQ4ODiQkJMjGx/38/RoaGv7///3+/gUFBf/+/lJSUsnIyGdmZktLS7e2tgUEBP78/Q0NDbi4uKOjo05OTgEAAPn4+dbW1l5cXR4dHgMCAmZmZjUzNP3+/SgmJ+Hh4QQDBPf39+np6dTU1FRUVOPi4/n5+bKxshYWFsjHyEFAQfv8+15dXoKBgry6u9jY2Ly7vDY1NWBgYBkZGScmJyknKPj39wwLDAUEBQcHB7Oxsubl5bOys8LCwnd2doyMjKmpqfj3+IB/gCsrK2RkZOTj5BAQELu7u0NBQsrKyvb19bW1tYyLiyIhIaSjo0RBQXt5egEAAff29n19faGhoc3MzCkoKTIxMZ2bnC0rK4GAgZCQkAkJCYmIiebm5vT19S0tLpKSkpOTk5OSk+no6ePh4oaGhvn4+M3MzX9/f1RTVN3c3NbV1Y6Ojuvr68C/wNfV1i0tLTs6Ox8fH/v8/JKQkYuLi1taWhQTE1RSUxsbG6Wjo3l3eHp6emhmZpnMOMkAAAHYSURBVFjD7VVnVxRBEOyNPXP5jstBARMoGEAQBERQglkBIyAiCKgYCaJgICtK/MXM7HGep36YOb7Ae1vv7dsvW9NV1d2zADZs2LCxH0F0SkySP5/mvOThANra3dsZAzM/vgkVd5DhYU9edF2HCz5UDUV1RztuSLtwlAKUVaHKBCh492YblUuSusBVVMy5/OlqZ+2Q6t0hgAMHEQ9rjG9gH7MjZx7g9FFW2eABonb1ilwTiA5HgsfRUCw6C6FOrr4DoOQEutPVLQc1ROIAlnX5MbSyT+OMVlkgHiBhXgt9qCi/+Xgem8QTYEr9zVx0FirW1ktMgHP4Mapalq40YnWL8CbRt1++5ZTnbbwchpOi+s3xDwt/lmf0cxeFN5myoBYnpqJaPGEYOyounQqAi4rODrwYnWaZfY9bxRVNGRq8JjrBnB6eHEODd999q+F2hOvfAtGrjH21POu1RH99+sAfAhgIRhLeX7rg/FEa+zTHyKnnrz2BjCAPetcoFbw1X31kGzfz+eUz3oqzfGqoU1/HTXCKOCD00cj7+R9LfFpNPcMgxFxJrQr2v+B+yNoC+pewDXzX7yCiO/SPXZr8+ebJPQ8hYhv8v0OTfDd29VMzr+tgw4YNG3se20YGMvgDI7hjAAAAAElFTkSuQmCC`
        })
        .expect(201)
        .end(function (err, res) {
            if (err) {
                throw err
            } else {
                console.log(dataUtils.greenConsoleLog("OK"));
                getNetworkList();
            }
        });
}

function getNetworkList() {
    console.log("Attempt: " + dataUtils.yellowConsoleLog("get network list"));
    request(app)
        .get('/network/list')
        .set('auth-token', accessToken)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                throw err
            } else {
                console.log(dataUtils.greenConsoleLog("OK"));
                addValidator();
            }
        });
}

function addValidator() {
    console.log("Attempt: " + dataUtils.yellowConsoleLog("add validator"));
    request(app)
        .post('/validator/add')
        .set('auth-token', accessToken)
        .send({
            address: '15wznkm7fMaJLFaw7B8KrJWkNcWsDziyTKVjrpPhRLMyXsr5',
            networkId: 1
        })
        .expect(201)
        .end(function (err, res) {
            if (err) {
                throw err
            } else {
                console.log(dataUtils.greenConsoleLog("OK"));
                getValidatorList();
            }
        });
}

function getValidatorList() {
    console.log("Attempt: " + dataUtils.yellowConsoleLog("get validator list"));
    request(app)
        .get('/validator/list')
        .set('auth-token', accessToken)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                throw err
            } else {
                console.log(dataUtils.greenConsoleLog("OK, test succesful!"));
            }
        });
}


module.exports = {
    scheduleTest
};