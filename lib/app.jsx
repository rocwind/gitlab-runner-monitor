const React = require('react');
const { useState } = React;
const { render, Box, Text } = require('ink');

const config = require('./config');
const { useEffect } = require('react');

const { getAllRunners, getRunnerRunningJobs } = require('./api');

const getColorByDuration = (duration) => {
    if (duration < 60) {
        return 'green';
    }
    if (duration < 300) {
        return 'yellow';
    }
    return 'red';
};

const RunnerStatus = ({ name, jobs }) => {
    return (
        <Box marginBottom={1}>
            <Box width={24} marginRight={1}>
                <Text bold>{name}</Text>
            </Box>
            <Box flexDirection={'column'}>
                {jobs.length > 0 &&
                    jobs.map(({ id, name, project, duration }) => {
                        return (
                            <Box key={id}>
                                <Text>{name}</Text>
                                <Text color={'gray'}>@{project.name}</Text>
                                <Text color={getColorByDuration(duration)}>
                                    {` ${Math.floor(duration)}s`}
                                </Text>
                            </Box>
                        );
                    })}
                {jobs.length === 0 && <Text color={'gray'}>no running job</Text>}
            </Box>
        </Box>
    );
};

const App = () => {
    const [runnerIDs, setRunnerIDs] = useState([]);
    const [runnerStatusByID, setRunnerStatusByID] = useState({});

    useEffect(() => {
        getAllRunners().then((runners) => {
            const activeRunners = runners.filter((runner) => runner.active);
            activeRunners.sort((a, b) => (a.description < b.description ? -1 : 1));
            setRunnerStatusByID(
                activeRunners.reduce((result, runner) => {
                    result[runner.id] = {
                        name: runner.description,
                        jobs: [],
                    };
                    return result;
                }, {}),
            );
            setRunnerIDs(activeRunners.map((runner) => runner.id));
        });
    }, []);

    useEffect(() => {
        // update runner status
        const refresh = () => {
            runnerIDs.forEach(async (runnerID) => {
                const jobs = await getRunnerRunningJobs(runnerID);
                setRunnerStatusByID((statusByID) => ({
                    ...statusByID,
                    [runnerID]: {
                        ...statusByID[runnerID],
                        jobs,
                    },
                }));
            });
        };

        refresh();
        const internal = setInterval(refresh, config.refreshInterval);

        return () => {
            clearInterval(internal);
        };
    }, [runnerIDs]);

    return (
        <Box flexDirection={'column'}>
            {runnerIDs.map((runnerID) => {
                const { name, jobs } = runnerStatusByID[runnerID];
                return <RunnerStatus key={runnerID} name={name} jobs={jobs} />;
            })}
        </Box>
    );
};

render(<App />);
