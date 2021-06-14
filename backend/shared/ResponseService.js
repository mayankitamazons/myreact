// General response without a payload
exports.generalResponse = function(err, res, status = 200, message = "Success") {
    if (err !== null) {
        res.status(501).json({
            status: 404,
            msg: err //"Error!"
        })
    } else {
        res.status(200).json({
            status: status,
            msg: message
        })
    }
};


// General response with a payload
exports.generalPayloadResponse = function(err, payload, res, status = 200, message = "Success") {
    if (err !== null) {
        res.status(501).json({
            status: 404,
            msg: err //"Error!"
        })
    } else {
        res.status(200).json({
            status: status,
            msg: message,
            data: payload
        })
    }
};