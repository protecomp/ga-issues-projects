# Add issue to project

A javascript github action to add an issue to a project

# Usage

```yaml
name: 'Add new issue to project board'

on:
  issues:
    types:
    - opened
 
jobs:
  add_to_project:
    runs-on: ubuntu-latest
    steps:
    - uses: protecomp/ga-issues-projects@develop
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        repository: ${{ github.repository }}
        issue: ${{ github.event.issue.number }}

```
