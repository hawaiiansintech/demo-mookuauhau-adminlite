
// https://github.com/vasturiano/force-graph

export const nodeValByType: {[key: string]: any} = {
    'kanaka': 3,
    'ohana': 1,
}

export const nodeColorByType: {[key: string]: any} = {
    'kanaka': 'plum',
    'ohana': 'orange',
}

export function transformKanakaRelationsToForceGraph(data: {[key: string]: any}) {
    console.log("transformKanakaRelationsToForceGraph()");

    let output: {[key: string]: any} = {
        "nodes": [],
        "links": []
    }

    if(data?.kanaka) {
        console.log("data.kanaka: ", data?.kanaka);
        data.kanaka.forEach(kanaka => {

            if(kanaka?.xref_id) {
                // push kanaka
                pushKanaka(output, kanaka);

                // makuahine means this kanaka is a mother in an ʻohana relationship
                if(kanaka?.makuahine) {
                    console.log(`has kanaka.makuahine `, kanaka?.makuahine);
                    kanaka.makuahine.forEach(mke => {
                        // has ohana
                        pushOhana(output, mke);
                        pushLink(output, mke.xref_id, kanaka.xref_id);

                        if(mke?.kane) {
                            // has spouse
                            pushMakua(output, kanaka, mke);

                            pushKanaka(output, mke.kane);

                            pushLink(output, mke.xref_id, mke.kane.xref_id);
                        }
                        else {
                            console.log("no mke.kane");
                        }

                        if(mke?.nakamalii) {
                            // has kids
                            // nakamalii is a list of children of this kanaka (ʻohana relationship)
                            mke.nakamalii.forEach(nki => {
                                pushKamalii(output, mke, nki);
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
                        pushOhana(output, mke);
                        pushLink(output, mke.xref_id, kanaka.xref_id);

                        if(mke?.wahine) {
                            // has spouse
                            pushMakua(output, kanaka, mke);

                            pushKanaka(output, mke.wahine);

                            pushLink(output, mke.xref_id, mke.wahine.xref_id);
                        }
                        else {
                            console.log("no mke.wahine");
                        }

                        if(mke?.nakamalii) {
                            // has kids
                            // nakamalii is a list of children of this kanaka (ʻohana relationship)
                            mke.nakamalii.forEach(nki => {
                                pushKamalii(output, mke, nki);
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
                    // pushLink(output, kanaka.namakua.ohana.xref_id, kanaka.xref_id);

                    pushNamakua(output, kanaka, kanaka.namakua);

                    // push link if not exists
                    // ohana will point to keikis
                    // pushLink(output, namakua.ohana.xref_id, kanaka.xref_id);
                }

            }
        });
    }
    
    return output;
}

function pushNamakua(output, kanaka, namakua) {
    console.log(`pushNamakua(output, kanaka ${kanaka.xref_id}, namakua`);

    if(!namakua) { return }

    namakua.forEach(n => {
        // push ohana
        // if(!n) {
        //     console.log("[namakua] n not exists");
        // }
        // else {
        //     console.log("n", n);
        //     pushOhana(output, n);

        //     // ohana will point to keikis
        //     pushLink(output, n.xref_id, kanaka.xref_id);
        // }
        if(!n?.ohana) {
            console.log("[namakua] n.ohana not exists");
        }
        else {
            console.log("n.ohana", n.ohana);
            pushOhana(output, n.ohana);

            // ohana will point to keikis
            pushLink(output, n.ohana.xref_id, kanaka.xref_id);
        }

        // makuakane and makuahine - parents
        if(!n?.ohana?.kane) {
            console.log("[namakua] n.ohana.kane not exists");
        }
        else {
            console.log("n.ohana.kane", n.ohana.kane);
            pushKanaka(output, n.ohana.kane);

            pushOhana(output, n.ohana);

            // ohana will point to parent kanaka
            pushLink(output, n.ohana.xref_id, n.ohana.kane.xref_id);
        }
        if(!n?.ohana?.wahine) {
            console.log("[makua] n.ohana.wahine not exists");
        }
        else {
            console.log("n.ohana.wahine", n.ohana.wahine);
            pushKanaka(output, n.ohana.wahine);

            pushOhana(output, n.ohana);

            // ohana will point to keikis
            pushLink(output, n.ohana.xref_id, n.ohana.wahine.xref_id);
        }

    });

}

function pushMakua(output, kanaka, makua) {
    console.log(`pushMakua(output, kanaka ${kanaka.xref_id}, makua`);

    // mutates output

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
        //     pushOhana(output, m.ohana);

        //     // ohana will point to keikis
        //     pushLink(output, ohana.xref_id, kanaka.xref_id);
        // }
        if(!m) {
            console.log("[makua] m not exists");
        }
        else {
            console.log("m", m);
            pushOhana(output, m);

            // ohana will point to keikis
            m.nakamalii.forEach(n => {
                pushLink(output, m.xref_id, n.kanaka.xref_id);
            });
        }

        // push spouse
        if(m?.kane && !output.nodes.some(node => node.id === m?.kane?.xref_id)) {
            pushKanaka(output, m?.kane);

            pushOhana(output, m);

            // push link if not exists
            pushLink(output, m.xref_id, m.kane.xref_id);
        }
        if(m?.wahine && !output.nodes.some(node => node.id === m?.wahine?.xref_id)) {
            pushKanaka(output, m?.wahine);

            pushOhana(output, m);

            // push link if not exists
            pushLink(output, m.xref_id, m.wahine.xref_id);
        }

    // });
   
}

function pushKanaka(output, kanaka) {
    console.log(`pushKanaka(output, kanaka ${kanaka?.xref_id})`);
    console.log("kanaka: ", kanaka);
    // mutates output

    if(!kanaka) { return; }

    if(!output.nodes.some(node => node.id === kanaka.xref_id)) {
        output.nodes.push({
            id: kanaka.xref_id,
            name: kanaka?.name || 'kanaka',
            val: nodeValByType.kanaka,
            color: nodeColorByType.kanaka,
        });
    }
    else {
        console.log(`node kanaka.xref_id ${kanaka.xref_id} already exists [noop]`);
    }
}

function pushOhana(output, ohana) {
    console.log(`pushOhana(output, ohana ${ohana?.xref_id})`);
    if(!ohana) {
        console.log("skip ohana");
        return;
    }
    if(!ohana?.xref_id) {
        console.log("missing ohana.xref_id");
        return;
    }
    // mutates output
    // push ohana if not exists
    if(!output.nodes.some(node => node.id === ohana.xref_id)) {
        output.nodes.push({
            id: ohana.xref_id,
            name: ohana?.name || 'ohana',
            val: nodeValByType.ohana,
            color: nodeColorByType.ohana,
        });
    }
    else {
        console.log(`node ohana.xref_id ${ohana.xref_id} already exists [noop]`);
    }
}

function pushLink(output, sourceId, targetId) {
    console.log(`pushLink(output, ${sourceId}, ${targetId})`);
    if(!sourceId) {
        console.log("missing sourceId");
        return;
    }
    if(!targetId) {
        console.log("missing targetId");
        return;
    }
    // mutates output
    // push link if not exists
    if(!output.links.some(node => 
            node.source === sourceId
            && node.target === targetId )) {
        output.links.push({
            // source will point to targets
            source: sourceId,
            target: targetId,
        });
    }
    else {
        console.log(`link source ${sourceId} + target ${targetId} already exists [noop]`);
    }
}

function pushKamalii(output, ohana, nakamalii) {
    console.log("pushKamalii()");
    // push ohana if not exists
    
    if(!ohana) {
        console.log("[kamalii] watch out, ohana not exists");
    }
    console.log("[kamalii] this is nakamalii: ", nakamalii);
    
    pushOhana(output, ohana);

    pushKanaka(output, nakamalii.kanaka);

    // push link if not exists
    // ohana will point to keikis
    pushLink(output, ohana.xref_id, nakamalii.kanaka.xref_id);

}
