<script lang="ts">
    import JsonDumper from "$lib/components/JsonDumper.svelte";
    import { get_kanaka_relations_by_xrefid } from "$lib/graphql-access";

    let resultMethod: string = 'graphql-response';

    let graphqlResult = {
        // dummy: 'default data',
        // powerlevel: 433,
    };

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
    }
</script>


<h1>Search by xref_id</h1>

<form method="get" on:submit|preventDefault={submitHandler}>
    <div>
        <label for="searchText">search text</label>
        <input type="text" name="searchText" value="@I164@" />
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
not implemented
{:else if (resultMethod === 'force-graph-vis')}
not implemented
{/if}
