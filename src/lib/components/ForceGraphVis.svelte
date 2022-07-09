<script type="ts">

import { browser } from '$app/env';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';

let forceGraph;

// entire nodes/links graph is a svelte store / observable
export let graph = writable({ nodes: [], links: [] });

export let loadNode: Function = () => {
    console.log("loadNode() no-op");
    console.log("pass in a loadNode() function to this ForceGraphVis component as a prop");
    console.log("it will be called when a node is clicked");
};

export let nodeClickHandler: Function = async (node, event, loadNode) => {
    console.log(`onNodeClick( node, event )`);
    console.log("node: ", node);
    console.log("event: ", event);
    await loadNode(node.id);

    // force re-render 
    render();
};

onMount(async () => {
    if(browser) {
        const { default: ForceGraph } = await import('force-graph');
        forceGraph = ForceGraph()
            .onNodeClick((node, event) => nodeClickHandler(node, event, loadNode));

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

<style>
    #forceGraphVis {
        border-style: solid;
        border-color: gray;
        display: flex;
        width:auto;
    }
</style>