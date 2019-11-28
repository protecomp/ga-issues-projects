const core = require('@actions/core');
const fetch = require('node-fetch');

// most @actions toolkit packages have async methods
async function run() {
  try { 
    const issue = core.getInput('issue');
    const repository = core.getInput('repository');
    const github_token = core.getInput('github_token');

    let query = 'query($owner:String!, $name:String!){repository(owner: $owner, name: $name) {projects(first:1) {nodes {id name}}}}';
    let variables = { owner: repository.split("/")[0], name: repository.split("/")[1] };

    let response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({query, variables}),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${github_token}`,
      }
    }).then(function(response) {
      return response.json();
    });
    console.log(response);
    const project = response['data']['repository']['projects']['nodes'][0];

    console.log(`Adding issue ${issue} to ${project['name']}`);
    console.log("");

    query = 'mutation($issueId:ID!, $projectId:ID!) {updateIssue(input:{id:$issueId, projectIds:[$projectId]}) {issue {id}}}';
    variables = { issueId: issue, projectId: project['id'] };

    response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      body: JSON.stringify({query, variables}),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${github_token}`,
      }
    }).then(function(response) {
      return response.json();
    });
    console.log(response);
    console.log(`Done!`)
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
