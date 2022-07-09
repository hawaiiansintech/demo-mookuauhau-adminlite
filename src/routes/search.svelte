<script lang="ts">
    import ForceGraphVis from "$lib/components/ForceGraphVis.svelte";
    import JsonDumper from "$lib/components/JsonDumper.svelte";
    import { get_kanaka_relations_by_xrefid } from "$lib/graphql-access";
    import { initialTransformKanakaRelationsToForceGraph, transformKanakaRelationsToForceGraph } from "$lib/transforms";
    import { get, writable } from "svelte/store";

    let resultMethod: string = 'graphql-response';

    let graphqlResult = {
        // dummy: 'default data',
        // powerlevel: 433,
    };

    // svelte store / observable
    // const forceGraphDataNodeRelationsResult: { [key: string]: any; } = writable({ nodes: [], links: [] });

    // simple in-memory object
    let forceGraphDataNodeRelationsResult: { [key: string]: any; };

    function submitHandler(e) {
        console.log("submitHandler()");
        console.log("e): ", e);
        const formData = new FormData(e.target);
        console.log("formData: ", formData);
        const data: { [key: string]: any } = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        console.log(data)

        getResult(data);
    }

    async function getResult(params: {[key: string]: any} ) {
        const role = 'public';
        const jwt_token = '';

        const xref_id = params?.searchText;

        const result = await get_kanaka_relations_by_xrefid(xref_id, role, jwt_token);
        graphqlResult = result;

        const fgResult = initialTransformKanakaRelationsToForceGraph(result);
        forceGraphDataNodeRelationsResult = fgResult;

    }

    async function loadNode( xref_id: string ) {
        console.log(`loadNode(${xref_id})`);
        const role = 'public';
        const jwt_token = '';

        const result = await get_kanaka_relations_by_xrefid(xref_id, role, jwt_token);
        graphqlResult = result;

        const fgResult = transformKanakaRelationsToForceGraph(result, forceGraphDataNodeRelationsResult);

    }

    // function nodeClickHandler (node, event) {
    //     console.log(`parent onNodeClick( node, event )`);
    //     console.log("node: ", node);
    //     console.log("event: ", event);
    // };

    function onLoad() {
        
    }

</script>


<h1>Search by xref_id</h1>

<form method="get" on:submit|preventDefault={submitHandler}>
    <div>
        <label for="searchText">search text</label>
        <input type="text" name="searchText" value="@I654@" />
    </div>

    <div>
        <input type="radio" id="graphql-response" bind:group={resultMethod} value="graphql-response" checked />
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

<h2>Results [{resultMethod}]</h2>
{#if (resultMethod === 'graphql-response')}
<JsonDumper jsonObject={graphqlResult} />
{:else if (resultMethod === 'force-graph-data')}
<JsonDumper jsonObject={forceGraphDataNodeRelationsResult} />
{:else if (resultMethod === 'force-graph-vis')}
<ForceGraphVis graph={forceGraphDataNodeRelationsResult} loadNode={loadNode}></ForceGraphVis>
{/if}
