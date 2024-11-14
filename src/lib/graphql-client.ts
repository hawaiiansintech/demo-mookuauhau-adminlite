
import { gql, GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || '';
const HASURA_GRAPHQL_ADMIN_SECRET = import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET || '';
const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);

async function gqlRequest(query: string, variables: { [key: string]: any }, addHeaders: { [key: string]: string }) {
	let gqlRequestHeaders: { [key: string]: string } = {
		"Content-Type": "application/graphql",
		'Accept': "application/json",
	};

	// if(jwt_token) {
	// 	gqlRequestHeaders['Authorization'] = `Bearer ${jwt_token}`;
	// }
	if (HASURA_GRAPHQL_ADMIN_SECRET) {
		gqlRequestHeaders['X-Hasura-Admin-Secret'] = HASURA_GRAPHQL_ADMIN_SECRET;
	}
	if (addHeaders) {
		Object.keys(addHeaders).forEach(key => {
			gqlRequestHeaders[key] = addHeaders[key];
		});
	}

	console.log("gqlRequestHeaders: ", gqlRequestHeaders);

	// select which endpoint
	const client = graphqlClient;

	// console.log("client.url: ", client.url);
	console.log("GRAPHQL_ENDPOINT: ", GRAPHQL_ENDPOINT);

	return await client.request(query, variables, gqlRequestHeaders);
}

export { gqlRequest, graphqlClient, gql };
