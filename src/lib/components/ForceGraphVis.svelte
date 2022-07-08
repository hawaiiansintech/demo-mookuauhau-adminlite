<script type="ts">

import { browser } from '$app/env';
import { onMount } from 'svelte';

export let graph;

$: console.log("graph: ", graph);

onMount(async () => {
    if(browser) {
        if(document.getElementById('forceGraphVis')) {
            render(graph);
        }
        else {
            console.log("document.getElementById('forceGraphVis') not exists");
        }
    }
});

async function render(graph) {
    const { default: ForceGraph } = await import('force-graph');
    const forceGraph = ForceGraph();

    const domEl = document.getElementById('forceGraphVis');
    console.log("domEl: ", domEl);
    if(domEl !== null) {
        forceGraph(domEl).graphData(graph);
    }
}

</script>

<div id="forceGraphVis"></div>