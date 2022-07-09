<script type="ts">

import { browser } from '$app/env';
import { nodeColorByType } from '$lib/transforms';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export let loadNode: Function = () => {
    console.log("loadNode() noop");
};

let forceGraph;

export let graph = writable({ nodes: [], links: [] });
export let nodeClickHandler: Function = async (node, event, forceGraph, loadNode) => {
    console.log(`onNodeClick( node, event )`);
    console.log("node: ", node);
    console.log("event: ", event);
    forceGraph.pauseAnimation();
    await loadNode(node.id);
    forceGraph.resumeAnimation();
};

$: () => {
    console.log("graph: ", graph);
    // render(graph);
};

onMount(async () => {
    if(browser) {
        const { default: ForceGraph } = await import('force-graph');
        forceGraph = ForceGraph()
            .onNodeClick((node, event) => nodeClickHandler(node, event, forceGraph, loadNode));

        if(document.getElementById('forceGraphVis')) {
            render(graph);
        }
        else {
            console.log("document.getElementById('forceGraphVis') not exists");
        }
    }
});

async function render(graph) {

    const domEl = document.getElementById('forceGraphVis');
    console.log("domEl: ", domEl);
    if(domEl !== null) {
        forceGraph(domEl).graphData(graph);
    }
}

</script>

<div id="forceGraphVis"></div>