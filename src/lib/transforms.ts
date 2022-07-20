
// https://github.com/vasturiano/force-graph

export const nodeValByType: {[key: string]: any} = {
    'kanaka': 3,
    'ohana': 1,
}

export const nodeColorByType: {[key: string]: any} = {
    'kanaka': 'plum',
    'ohana': 'orange',
}

export const linkColorByType: {[key: string]: any} = {
    'child': 'green',
    'K': 'blue',
    'W': 'pink',
}

export function transformKanakaRelationsToForceGraph(data: {[key: string]: any}, nodeRelations: {[key: string]: any}) {
    console.log("transformKanakaRelationsToForceGraph()");

    if(data?.kanaka) {
        console.log("data.kanaka: ", data?.kanaka);
        data.kanaka.forEach(kanaka => {

            if(kanaka?.xref_id) {
                // push kanaka
                pushKanaka(nodeRelations, kanaka);

                // makuahine means this kanaka is a mother in an ʻohana relationship
                if(kanaka?.makuahine) {
                    console.log(`has kanaka.makuahine `, kanaka?.makuahine);
                    kanaka.makuahine.forEach(mke => {
                        // has ohana
                        pushOhana(nodeRelations, mke);
                        pushLink(nodeRelations, mke.xref_id, kanaka.xref_id, 'W');

                        if(mke?.kane) {
                            // has spouse
                            pushMakua(nodeRelations, kanaka, mke);

                            pushKanaka(nodeRelations, mke.kane);
                            pushLink(nodeRelations, mke.xref_id, mke.kane.xref_id, 'K');
                        }
                        else {
                            console.log("no mke.kane");
                        }

                        if(mke?.nakamalii) {
                            // has kids
                            // nakamalii is a list of children of this kanaka (ʻohana relationship)
                            mke.nakamalii.forEach(nki => {
                                pushKamalii(nodeRelations, mke, nki);
                            });
                        }
                        else {
                            console.log("no mke.kane");
                        }
                    });
                }
                else {
                    console.log(`no kanaka.makuahine`);
                }

                // makuakane means this kanaka is a father in an ʻohana relationship
                if(kanaka?.makuakane) {
                    console.log(`has kanaka.makuakane `, kanaka?.makuakane);
                    kanaka.makuakane.forEach(mke => {
                        // has ohana
                        pushOhana(nodeRelations, mke);
                        pushLink(nodeRelations, mke.xref_id, kanaka.xref_id, 'K');

                        if(mke?.wahine) {
                            // has spouse
                            pushMakua(nodeRelations, kanaka, mke);

                            pushKanaka(nodeRelations, mke.wahine);
                            pushLink(nodeRelations, mke.xref_id, mke.wahine.xref_id, 'W');
                        }
                        else {
                            console.log("no mke.wahine");
                        }

                        if(mke?.nakamalii) {
                            // has kids
                            // nakamalii is a list of children of this kanaka (ʻohana relationship)
                            mke.nakamalii.forEach(nki => {
                                pushKamalii(nodeRelations, mke, nki);
                            });
                        }
                        else {
                            console.log("no mke.nakamalii");
                        }
                    });
                }
                else {
                    console.log(`no kanaka.makuakane`);
                }

                // namakua is a list of makua/parents this kanaka is a child of (other ʻohana relationships)

                if(kanaka?.namakua) {
                    // pushLink(nodeRelations, kanaka.namakua.ohana.xref_id, kanaka.xref_id);

                    pushNamakua(nodeRelations, kanaka, kanaka.namakua);

                    // push link if not exists
                    // ohana will point to keikis
                    // pushLink(nodeRelations, namakua.ohana.xref_id, kanaka.xref_id);
                }

            }
        });
    }
    
    return nodeRelations;
}

export function initialTransformKanakaRelationsToForceGraph(data: {[key: string]: any}) {
    console.log("initialTransformKanakaRelationsToForceGraph()");

    let nodeRelations: {[key: string]: any} = {
        "nodes": [],
        "links": []
    }

    transformKanakaRelationsToForceGraph(data, nodeRelations);

    return nodeRelations;
}

function pushNamakua(nodeRelations, kanaka, namakua) {
    console.log(`pushNamakua(nodeRelations, kanaka ${kanaka.xref_id}, namakua`);

    if(!namakua) { return }

    namakua.forEach(n => {
        // push ohana
        // if(!n) {
        //     console.log("[namakua] n not exists");
        // }
        // else {
        //     console.log("n", n);
        //     pushOhana(nodeRelations, n);

        //     // ohana will point to keikis
        //     pushLink(nodeRelations, n.xref_id, kanaka.xref_id);
        // }
        if(!n?.ohana) {
            console.log("[namakua] n.ohana not exists");
        }
        else {
            console.log("n.ohana", n.ohana);
            pushOhana(nodeRelations, n.ohana);

            // ohana will point to keikis
            pushLink(nodeRelations, n.ohana.xref_id, kanaka.xref_id, 'child');
        }

        // makuakane and makuahine - parents
        if(!n?.ohana?.kane) {
            console.log("[namakua] n.ohana.kane not exists");
        }
        else {
            console.log("n.ohana.kane", n.ohana.kane);
            pushKanaka(nodeRelations, n.ohana.kane);

            pushOhana(nodeRelations, n.ohana);

            // ohana will point to parent kanaka
            pushLink(nodeRelations, n.ohana.xref_id, n.ohana.kane.xref_id, 'K');
        }
        if(!n?.ohana?.wahine) {
            console.log("[makua] n.ohana.wahine not exists");
        }
        else {
            console.log("n.ohana.wahine", n.ohana.wahine);
            pushKanaka(nodeRelations, n.ohana.wahine);

            pushOhana(nodeRelations, n.ohana);

            // ohana will point to parest kanaka
            pushLink(nodeRelations, n.ohana.xref_id, n.ohana.wahine.xref_id, 'W');
        }

    });

}

function pushMakua(nodeRelations, kanaka, makua) {
    console.log(`pushMakua(nodeRelations, kanaka ${kanaka.xref_id}, makua`);

    // mutates nodeRelations

    if(!makua) { return }

    console.log("makua ", makua);
    const m = makua;

    // makua.forEach(m => {
        // push ohana
        // if(!m?.ohana) {
        //     console.log("[makua] watch out, ohana not exists");
        // }
        // else {
        //     console.log("m.ohana", m.ohana);
        //     pushOhana(nodeRelations, m.ohana);

        //     // ohana will point to keikis
        //     pushLink(nodeRelations, ohana.xref_id, kanaka.xref_id);
        // }
        if(!m) {
            console.log("[makua] m not exists");
        }
        else {
            console.log("m", m);
            pushOhana(nodeRelations, m);

            // ohana will point to keikis
            m.nakamalii.forEach(n => {
                pushLink(nodeRelations, m.xref_id, n.kanaka.xref_id, 'child');
            });
        }

        // push spouse
        if(m?.kane && !nodeRelations.nodes.some(node => node.id === m?.kane?.xref_id)) {
            pushKanaka(nodeRelations, m?.kane);

            pushOhana(nodeRelations, m);

            // push link if not exists
            pushLink(nodeRelations, m.xref_id, m.kane.xref_id, 'K');
        }
        if(m?.wahine && !nodeRelations.nodes.some(node => node.id === m?.wahine?.xref_id)) {
            pushKanaka(nodeRelations, m?.wahine);

            pushOhana(nodeRelations, m);

            // push link if not exists
            pushLink(nodeRelations, m.xref_id, m.wahine.xref_id, 'W');
        }

    // });
   
}

function pushKanaka(nodeRelations, kanaka) {
    console.log(`pushKanaka(nodeRelations, kanaka ${kanaka?.xref_id})`);
    console.log("kanaka: ", kanaka);
    // mutates nodeRelations

    if(!kanaka) { return; }

    if(!nodeRelations.nodes.some(node => node.id === kanaka.xref_id)) {
        const { nodes, links } = nodeRelations;

        // add more into node name, just to display more tooltip easily
        let nodeName = kanaka?.name || 'kanaka';
        if(kanaka?.birth_date) {
            nodeName += "\n" + `[b. ${kanaka?.birth_date}]`;
        }

        nodeRelations.nodes = [...nodes, {
            id: kanaka.xref_id,
            name: nodeName,
            val: nodeValByType.kanaka,
            color: nodeColorByType.kanaka,
        }];
    }
    else {
        console.log(`node kanaka.xref_id ${kanaka.xref_id} already exists [noop]`);
    }
}

function pushOhana(nodeRelations, ohana) {
    console.log(`pushOhana(nodeRelations, ohana ${ohana?.xref_id})`);
    if(!ohana) {
        console.log("skip ohana");
        return;
    }
    if(!ohana?.xref_id) {
        console.log("missing ohana.xref_id");
        return;
    }
    // mutates nodeRelations
    // push ohana if not exists
    if(!nodeRelations.nodes.some(node => node.id === ohana.xref_id)) {
        const { nodes, links } = nodeRelations;

        // add more into node name, just to display more tooltip easily
        let nodeName = ohana?.name || 'ohana';
        if(ohana?.marriage_date) {
            nodeName += "\n" + `[m. ${ohana?.marriage_date}]`;
        }
        if(ohana?.marriage_place) {
            nodeName += "\n" + `[@ ${ohana?.marriage_place}]`;
        }

        nodeRelations.nodes = [...nodes, {
            id: ohana.xref_id,
            name: ohana?.name || 'ohana',
            val: nodeValByType.ohana,
            color: nodeColorByType.ohana,
        }];
    }
    else {
        console.log(`node ohana.xref_id ${ohana.xref_id} already exists [noop]`);
    }
}

function pushLink(nodeRelations, sourceId: string, targetId: string, label?: string|undefined) {
    console.log(`pushLink(nodeRelations, ${sourceId}, ${targetId}, ${label})`);
    if(!sourceId) {
        console.log("missing sourceId");
        return;
    }
    if(!targetId) {
        console.log("missing targetId");
        return;
    }
    // mutates nodeRelations
    // push link if not exists
    if(!nodeRelations.links.some(node => 
            node.source === sourceId
            && node.target === targetId )) {
        let link: {[key: string]: any} = {
            // source will point to targets
            source: sourceId,
            target: targetId,
        };
        if(label) { 
            link.name = label;
            link.color = linkColorByType[label];
        }

        const { nodes, links } = nodeRelations;
        nodeRelations.links = [...links, link];
        
    }
    else {
        console.log(`link source ${sourceId} + target ${targetId} already exists [noop]`);
    }
}

function pushKamalii(nodeRelations, ohana, nakamalii) {
    console.log("pushKamalii()");
    // push ohana if not exists
    
    if(!ohana) {
        console.log("[kamalii] watch out, ohana not exists");
    }
    console.log("[kamalii] this is nakamalii: ", nakamalii);
    
    pushOhana(nodeRelations, ohana);

    pushKanaka(nodeRelations, nakamalii.kanaka);

    // push link if not exists
    // ohana will point to keikis
    pushLink(nodeRelations, ohana.xref_id, nakamalii.kanaka.xref_id, 'child');

}

