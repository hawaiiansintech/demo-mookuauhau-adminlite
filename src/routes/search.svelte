<script lang="ts" context="module">
	export async function load({ url, params, props, fetch, session, stuff, status, error }) {

		const xref_id = url.searchParams.get('xref_id');

		return {
			props: {
				xref_id,
			}
		}
	}
</script>
<script lang="ts">
	import ForceGraphVis from '$lib/components/ForceGraphVis.svelte';
	import JsonDumper from '$lib/components/JsonDumper.svelte';
	import MookuauhauSelect from '$lib/components/MookuauhauSelect.svelte';
	import { get_kanaka_relations_by_xrefid } from '$lib/graphql-access';
	import { jwt_token } from '$lib/nhost';
	import {
		initialTransformKanakaRelationsToForceGraph,
		transformKanakaRelationsToForceGraph
	} from '$lib/transforms';
	import { get } from 'svelte/store';

	export let xref_id: string;
	$: searchText = xref_id || '@I654@';

	let message = '';

	let mookuauhau_id: number | undefined;

	let resultMethod: string = 'graphql-response';

	let graphqlResult = {};

	// simple in-memory object
	let forceGraphDataNodeRelationsResult: { [key: string]: any };

	function submitHandler(e) {
		console.log('submitHandler()');
		console.log('e): ', e);
		const formData = new FormData(e.target);
		console.log('formData: ', formData);
		const data: { [key: string]: any } = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		console.log(data);

		getResult(data);
	}

	async function getResult(params: { [key: string]: any }) {
		console.log(`getResult()`);
		let role = 'public';
		const jwt = get(jwt_token);
		if (jwt) {
			role = 'user';
		}

		const xref_id = params?.searchText;

		try {
			const result = await get_kanaka_relations_by_xrefid(mookuauhau_id, xref_id, role, jwt);
			graphqlResult = result;

			const fgResult = initialTransformKanakaRelationsToForceGraph(result);
			forceGraphDataNodeRelationsResult = fgResult;
		} catch (error) {
			message = error?.message;
		}
	}

	async function loadNodeIntoExistingGraph(xref_id: string) {
		console.log(`loadNodeIntoExistingGraph(${xref_id})`);
		let role = 'public';
		const jwt = get(jwt_token);
		if (jwt) {
			role = 'user';
		}

		const result = await get_kanaka_relations_by_xrefid(mookuauhau_id, xref_id, role, jwt);
		graphqlResult = result;

		// mutates forceGraphDataNodeRelationsResult
		transformKanakaRelationsToForceGraph(result, forceGraphDataNodeRelationsResult);
	}
</script>

<h2>Test Browser</h2>

<div>mookuauhau_id {mookuauhau_id}</div>
<MookuauhauSelect bind:selectedId={mookuauhau_id} />

<h3>Search by xref_id</h3>

<form method="get" on:submit|preventDefault={submitHandler}>
	<div>
		<label for="searchText">search text</label>
		<input type="text" name="searchText" value={searchText} />
	</div>

	<div>
		<input
			type="radio"
			id="graphql-response"
			bind:group={resultMethod}
			value="graphql-response"
			checked
		/>
		<label for="graphql-response">graphql-response</label>
		<input type="radio" id="force-graph-data" bind:group={resultMethod} value="force-graph-data" />
		<label for="force-graph-data">force-graph data</label>
		<input type="radio" id="force-graph-vis" bind:group={resultMethod} value="force-graph-vis" />
		<label for="force-graph-vis">force-graph vis</label>
	</div>

	<div>
		<input type="submit" name="submit" value="submit" />
	</div>
</form>

<div style="color:red">{message}</div>

<h3>Results [{resultMethod}]</h3>
{#if resultMethod === 'graphql-response'}
	<JsonDumper jsonObject={graphqlResult} />
{:else if resultMethod === 'force-graph-data'}
	<JsonDumper jsonObject={forceGraphDataNodeRelationsResult} />
{:else if resultMethod === 'force-graph-vis'}
	<ForceGraphVis graph={forceGraphDataNodeRelationsResult} loadNode={loadNodeIntoExistingGraph} />
{/if}

<div>
	Note: force-graph data is updatable by the ForceGraph object as well as updatable loading
	additional node queries.
</div>
