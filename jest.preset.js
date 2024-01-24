const nxPreset = require('@nrwl/jest/preset');
const dynamodbPreset = require('@shelf/jest-dynamodb/jest-preset');

let presets = {...nxPreset};

if (process.env.STAGE !== 'local') {
    presets = {
        ...presets,
        ...dynamodbPreset
    }
};

module.exports = presets;
