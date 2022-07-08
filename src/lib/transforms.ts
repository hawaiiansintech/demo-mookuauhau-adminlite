
// https://github.com/vasturiano/force-graph

export const nodeValByType: {[key: string]: any} = {
    'kanaka': 3,
    'ohana': 1,
}

export function transformKanakaRelationsToForceGraph(data: {[key: string]: any}) {
    let output: {[key: string]: any} = {
        "nodes": [],
        "links": []
    }

    if(data?.kanaka) {
        data.kanaka.forEach(kanaka => {

            if(kanaka?.xref_id) {
                // push kanaka
                output.nodes.push({
                    id: kanaka.xref_id,
                    name: kanaka.name,
                    val: nodeValByType.kanaka,
                });

                // makuahine means this kanaka is a mother in an ʻohana relationship
                if(kanaka?.makuahine) {
                    kanaka.makuahine.forEach(ohana => {
                        // push ohana
                        if(!output.nodes.some(node => node.id === ohana.xref_id)) {
                            output.nodes.push({
                                id: ohana.xref_id,
                                name: ohana?.name || 'ohana',
                                val: nodeValByType.ohana,
                            });
                        }

                        // push link if not exists
                        if(!output.links.some(node => 
                                node.source === ohana.xref_id
                                && node.target === kanaka.xref_id )) {
                            output.links.push({
                                // ohana will point to keikis
                                source: ohana.xref_id,
                                target: kanaka.xref_id,
                            });
                        }

                    });
                }

                // makuakane means this kanaka is a father in an ʻohana relationship

                // namakua is a list of makua/parents this kanaka is a child of (other ʻohana relationships)

                if(kanaka?.namakua) {
                    kanaka.namakua.forEach(namakua => {
                        // push ohana
                        if(!output.nodes.some(node => node.id === namakua.ohana.xref_id)) {
                            output.nodes.push({
                                id: namakua.ohana.xref_id,
                                name: namakua.ohana?.name || 'ohana',
                                val: nodeValByType.ohana,
                            });
                        }

                        // push link if not exists
                        if(!output.links.some(node => 
                                node.source === namakua.ohana.xref_id
                                && node.target === kanaka.xref_id )) {
                            output.links.push({
                                // ohana will point to keikis
                                source: namakua.ohana.xref_id,
                                target: kanaka.xref_id,
                            });
                        }

                    });
                }

                // nakamalii is a list of children of this kanaka (ʻohana relationship)
                if(kanaka?.nakamalii) {
                    kanaka.nakamalii.forEach(nakamalii => {
                        // push ohana if not exists
                        if(!output.nodes.some(node => node.id === nakamalii.ohana.xref_id)) {
                            output.nodes.push({
                                id: nakamalii.ohana.xref_id,
                                name: nakamalii.ohana?.name || 'ohana',
                                val: nodeValByType.ohana,
                            });
                        }

                        // push link if not exists
                        if(!output.links.some(node => 
                                node.source === kanaka.xref_id
                                && node.target === nakamalii.ohana.xref_id )) {
                            output.links.push({
                                // ohana will point to keikis
                                source: kanaka.xref_id,
                                target: nakamalii.ohana.xref_id,
                            });
                        }

                    });
                }

            }
        });
    }
    
    return output;
}

