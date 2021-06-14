const ResponseService = require('../shared/ResponseService'); // Response service

// Country list
const Constants = require('../shared/Constants');
exports.countryList = function(req, res) {
    ResponseService.generalPayloadResponse(null, Constants.COUNTRY_LIST, res);
}