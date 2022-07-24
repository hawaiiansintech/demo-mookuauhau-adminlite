# Demo Moʻokūʻauhau Admin Lite

Purpose of this project is to:

- Demonstration GraphQL queries
- Transform GraphQL query results to a [force-graph](https://github.com/vasturiano/force-graph) node tree
- Demonstrate authentication/authorization code
- GEDCOM file uploader, for later backend processing.

# get started

```
git clone https://github.com/hawaiiansintech/demo-mookuauhau-adminlite
cd ./demo-mookuauhau-adminlite
npm install
cp .env.example .env  # edit to add required VITE_GRAPHQL_ENDPOINT & VITE_NHOST_BACKEND_URL

npm run dev
```

# fork on github to your own repo, and deploy on Vercel

Recommendend prep:

- create/have an account on [github.com](https://github.com/)
- create/have an account on [vercel.com](https://vercel.com/). Log in with GitHub is supported.
- optional (for auth/authz development): create/have an account on [nhost.io](https://nhost.io/) and talk to Raul Nohea Goodness about access. Log in with GitHub is supported.

Recommended workflow for the hackathon:

- login to your [github.com](https://github.com/) account
- go to the [this repository](https://github.com/hawaiiansintech/demo-mookuauhau-adminlite) and click the "Fork" button on the top-right. This will prompt to "Create a new fork" in your personal GitHub account. Create the Fork.
- go to your personal repo for this project (https://github.com/{yourusername}/demo-mookuauhau-adminlite), and click the green "Code" button. Follow the directions for SSH or GitHub CLI to [`git clone`](https://www.git-scm.com/docs/git-clone) to your laptop/workstation, wherever you keep your code projects.
- run/edit your code as desired
- you may commit your code to git, ideally in a 'topic' branch, separate from 'main' branch.
- `git push` your code back to your github repo. Repeat.

The CI/CD deployment on Vercel should be set up, so that then you push the latest code to your github, Vercel picks up the changes, builds, and deploys automatically.

- at Vercel, click the black "+ New Project" button on the top-right
- Import Git Repository. You must import a repo from your personal account (not organization) to use the Hobby/Free level.
- Adjust GitHub App Permissions as needed to view and import your personal repo
- Once it is connected, you will have to go into project Settings, and set "Environment Variables". They are the same names as in your local .env file (see .env.example in project root). The .env is suppressed from commit to the source code repo, so you must explicity set them here. To get the correct setting for the hackathon, please see your copy/link of the "Hackathon 2022 Front-End Onboarding" document.
- when you manually trigger a deployment or push to the connected git branch, the app will build and deploy to a unique url under the Deployments tab. If it succeeds, you can click and view in your browser.
- the production branch will have a permanent url at \*.vercel.app . I think you can't use https://demo-mookuauhau-adminlite.vercel.app for that because i already use it, but change the domain to your own name.

If any changes should go back to the main project repository at 'hawaiiansintech', create a [GitHub Pull Request](https://docs.github.com/en/pull-requests) for our review. Mahalo nui!

## git clone and run admin-lite locally

```
git clone https://github.com/hawaiiansintech/demo-mookuauhau-adminlite
cd ./demo-mookuauhau-adminlite
npm install
cp .env.example .env  # edit to add required VITE_GRAPHQL_ENDPOINT & VITE_NHOST_BACKEND_URL

npm run dev
```

# graphql data access

see get_kanaka_relations_by_xrefid()
[/src/lib/graphql-access.ts](../main/src/lib/graphql-access.ts)

# transformer from graphql result to force-graph { nodes: [], links: [] }

[/src/lib/transforms.ts](../main/src/lib/transforms.ts)

# sample site on Vercel

[https://demo-mookuauhau-adminlite.vercel.app/](https://demo-mookuauhau-adminlite.vercel.app/)

# typescript and javascript objects

FYI: i use one of these type definition to represent traditional javascipt objects w/o TS errors:

- `{ [key: string]: string }`
- `{ [key: string]: number }`
- `{ [key: string]: string|number|Date|undefined }`
- `{ [key: string]: any }`

```
let params: { [key: string]: any } = {

};
```

Don't hate me, i'm new to typescript 😅
