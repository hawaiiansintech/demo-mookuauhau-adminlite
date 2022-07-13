# Demo Moʻokūʻauhau Admin Lite

Purpose of this project is to:

- Demonstration GraphQL queries
- Transform GraphQL query results to a [force-graph](https://github.com/vasturiano/force-graph) node tree
- Demonstrate authentication/authorization code
- GEDCOM file uploader, for later backend processing.

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
