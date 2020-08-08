const bent = require('bent');
const config = require('./config');

const getJSON = bent('json', 200, { 'PRIVATE-TOKEN': config.token });
const gitlabAPI = (path) => {
    return getJSON(`${config.host}/api/v4/${path}`);
};

const getAllRunners = () => {
    return gitlabAPI(`groups/${config.groupID}/runners`);
};
const getRunnerRunningJobs = (runnerID) => {
    return gitlabAPI(`runners/${runnerID}/jobs?status=running`);
};

module.exports = {
    getAllRunners,
    getRunnerRunningJobs,
};
