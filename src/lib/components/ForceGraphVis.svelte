<script type="ts">

import { browser } from '$app/env';
import { nodeColorByType } from '$lib/transforms';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export let loadNode: Function = () => {
    console.log("loadNode() noop");
};

let forceGraph;

// entire nodes/links graph is a svelte store / observable
export let graph = writable({ nodes: [], links: [] });

export let nodeClickHandler: Function = async (node, event, forceGraph, loadNode) => {
    console.log(`onNodeClick( node, event )`);
    console.log("node: ", node);
    console.log("event: ", event);
    await loadNode(node.id);

    // force re-render 
    render();
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
            render();
        }
        else {
            console.log("document.getElementById('forceGraphVis') not exists");
        }
    }
});

export async function render() {
    console.log("forceGraphVis render()");
    const domEl = document.getElementById('forceGraphVis');
    console.log("domEl: ", domEl);
    if(domEl !== null) {
        forceGraph(domEl).graphData(graph);
    }
}

</script>

<div id="forceGraphVis"></div>