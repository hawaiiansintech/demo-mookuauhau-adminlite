
// https://github.com/vasturiano/force-graph

export function transformKanakaRelationsToForceGraph(data: {[key: string]: any}) {
    let output: {[key: string]: any} = {};

    output = {
        "nodes": [
            {
              "id": "id1",
              "name": "name1",
              "val": 1
            },
            {
              "id": "id2",
              "name": "name2",
              "val": 10
            },
        ],
        "links": [
            {
                "source": "id1",
                "target": "id2"
            },
        ]
    }
    return output;
}

