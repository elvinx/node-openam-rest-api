var request = require('request');

/**
 * `OpenAM` constructor.
 *
 *  Options:
 *    - `baseUrl`    Base URL of OpenAM server ex: https://www.example.com/openam/
 */

// #TODO provide functionality for passing additional options
exports.API = function (baseUrl) {

    this._baseUrl = baseUrl;

    // REST API endpoints
    this._endpoints = {

        // General purpose endpoints
        sessions: this._baseUrl + "/json/sessions",
        users: this._baseUrl + "/json/users",
        // Login & Logout
        authenticate: this._baseUrl + "/ json/authenticate",
        logout: this._baseUrl + this._endpoints.users + '/?_action=logout',

        // Password Resetting / Changing
        forgotPassword: this._baseUrl + this._endpoints.users + "/?_action=forgotPassword",
        forgotPasswordReset: this._baseUrl + this._endpoints.users + "/?_action=forgotPasswordReset",
        confirm: this._baseUrl + this._endpoints.users + "/?_action=confirm"
    };
};


var validateToken = function (tokenId, cb) {
    request({
        headers: {
            'Content-Type': 'application/json'
        },
        url: config.servers.authentication.url + 'json/sessions/' + tokenId + "?_action=validate",
        method: 'POST',
        json: true

    }, function (error, response, body) {

        if (error) {
            console.log(error);
            cb(error, null);
        } else {

            if (body.valid == true) {
                cb(null, body.uid)
            } else {
                cb(new Error('Invalid token'), null);
            }
        }

    });

};

exports.API.prototype.authenticateUser = function (username, password, cb) {

    process.nextTick(function () {
        request({
            headers: {
                'Content-Type': 'application/json',
                'X-OpenAM-Username': username,
                'X-OpenAM-Password': password,
                'Accept-API-Version': 'resource=2.0, protocol=1.0'
            },
            url: this._endpoints.authenticate,
            method: 'POST',
            json: true

        }, function (error, response, body) {
            if (body) {
                if (body.tokenId) {

                    validateToken(body.tokenId, function (err, userId) {
                        if (err)
                            cb(err, null)
                        else
                            cb(null, {
                                'id': userId,
                                'tokenId': body.tokenId
                            })
                    })
                }
                else {
                    cb(body.message);
                }
            }

        });

    });
};

exports.API.prototype.logout = function (tokenId, cb) {

    request({
        headers: {
            'Content-Type': 'application/json',
            'iplanetDirectoryPro': tokenId
        },
        url: this._endpoints.logout,
        method: 'POST',
        json: true

    }, function (error, response, body) {
        if (body.code && body.code == 401) {
            cb(body);
        }
    });

};

exports.API.prototype.forgotPassword = function (username, cb) {

    var subject = "Reset your forgotten password.",
        message = "Follow this link to reset your password";

    request({
        headers: {
            'Content-Type': 'application/json'
        },
        url: this._endpoints.forgotPassword,
        method: 'POST',
        body: {
            'username': username,
            'subject': subject,
            'message': message
        },
        json: true

    }, function (error, response, body) {

        if (body.code)
            cb(body, null);
        else
            cb(null, true);

    });

};

exports.API.prototype.changePassword = function (user, currentPassword, newPassword, cb) {

    request({
        headers: {
            'Content-Type': 'application/json',
            'iplanetDirectoryPro': user.tokenId
        },
        url: this._endpoints.users + user.id + '?_action=changePassword',
        method: 'POST',
        body: {
            "currentpassword": currentPassword,
            "userpassword": newPassword
        },
        json: true

    }, function (error, response, body) {
        if (body.code) {
            cb(body, null);
        } else {
            cb(null, true);
        }
    });
};

exports.API.prototype.forgotPasswordReset = function (data, cb) {

    request({
        headers: {
            'Content-Type': 'application/json'
        },
        url: this._endpoints.forgotPasswordReset,
        method: 'POST',
        body: data,
        json: true

    }, function (error, response, body) {

        if (body.code)
            cb(body, null);
        else
            cb(null, true);

    });
};

exports.API.prototype.confirm = function (data, cb) {
    request({
        headers: {
            'Content-Type': 'application/json'
        },
        url: this._endpoints.confirm,
        body: data,
        json: true

    }, function (error, response, body) {

        if (body.code)
            cb(body, null);
        else
            cb(null, body);

    });
};

exports.API.prototype.validateToken = validateToken;
