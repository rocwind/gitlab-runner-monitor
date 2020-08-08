# gitlab-runner-monitor
It seems that [GitLab CI does not have a job status dashboard currently](https://gitlab.com/gitlab-org/gitlab/-/issues/15291). However, it does have [API support](https://docs.gitlab.com/ce/api/runners.html) for query runner job status, therefore this `gitlab-runner-monitor` CLI tool is for showing GitLab runner status in terminal.

## Install and Config
* `npm install -g gitlab-runner-monitor`
* create a config file at `~/.gitlab-runner-monitor` with contents:
```
GITLAB_HOST=<>
GITLAB_TOKEN=<gitlab api token>
GITLAB_GROUP_ID=<your gitlab group id>
REFRESH_INTERVAL=5000
```
* run `gitlab-runner-monitor` to display the running job status
