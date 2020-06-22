let data;

function inflate() {
        let files = document.getElementById('inflateFile').files;

        if (files.length <= 0) {
            let startDate = document.getElementById('start').value;
            let endDate = document.getElementById('end').value;
            if (isNotCorrectDate(startDate) || isNotCorrectDate(endDate)) {
                alert("Wrong date format remember to use yyyy-mm-dd");
                return false;
            }

            fetch("http://" + localStorage.getItem("hostname") +
                "exporters/graph?start=" + startDate + "&end=" + endDate)
                .then(
                    function(response) {
                        if (response.status !== 200) {
                            console.log('Status code problem: ' + response.status);
                            return;
                        }

                        return response.json()
                    }
                )
                .then(function(data) {
                    console.log(data);
                    show(transformNodes(data));
                });

            return false;
        }

        let fr = new FileReader();

        fr.onload = function (e) {
            show(transformNodes(JSON.parse(e.target.result)));
        };

        fr.readAsText(files.item(0));
        return false;
}

function findById(id) {
    for (const element of data.nodes) {
        if (element.id === id) {
            return element;
        }
    }
}

function show(graph) {
    let container = document.getElementById('mynetwork');

    if (!graph.hasOwnProperty("nodes")) {
        alert("No events found");
        return;
    }

    data = {
        nodes: graph.nodes,
        edges: graph.edges
    };

    let options = {
        autoResize: true,
        height: '100%',
        width: '1000px',
        interaction: { hover: true },
        manipulation: {
            enabled: true
        },
        nodes: {
            borderWidth: 1,
            shadow: true
        },
        edges: {
            length:300,
            shadow: true
        }
    };

    let network = new vis.Network(container, data, options);

    network.on("selectNode", function(params) {
        let node = findById(params.nodes[0]);
        let visualLabel = document.getElementById("label");
        let visualFirst = document.getElementById("parameter_1");
        let visualSecond = document.getElementById("parameter_2");
        let visualThird = document.getElementById("parameter_3");
        let visualFourth = document.getElementById("parameter_4");
        visualLabel.textContent = "Type: " + node.label;
        visualLabel.style.visibility = "hidden";
        visualFirst.style.visibility = "hidden";
        visualSecond.style.visibility = "hidden";
        visualThird.style.visibility = "hidden";
        visualFourth.style.visibility = "hidden";

        if (node.hasOwnProperty("name") || node.hasOwnProperty("description")) {

            visualLabel.style.visibility = "visible";
            visualLabel.textContent = "Type: Event";

            if (node.hasOwnProperty("name") && node.name !== "") {
                visualFirst.style.visibility = "visible";
                visualFirst.textContent = "Name: " + node.name;
            }

            if (node.hasOwnProperty("description") && node.description !== "") {
                visualSecond.style.visibility = "visible";
                visualSecond.textContent = "Description: " + node.description;
            }

        } else if (node.hasOwnProperty("start")) {
            visualLabel.style.visibility = "visible";
            visualLabel.textContent = "Type: Interval";
            visualFirst.style.visibility = "visible";
            visualFirst.textContent = "Starts: " + node.start;

            if (node.hasOwnProperty("end")) {

                visualSecond.style.visibility = "visible";
                visualSecond.textContent = "Ends: " + node.end;
            }

            if(node.hasOwnProperty("commenceUncertainty") && node.hasOwnProperty("terminationUncertainty")){
                visualThird.style.visibility = "visible";
                visualFourth.style.visibility = "visible";
                visualThird.textContent = "Start uncertainty: " + node.commenceUncertainty;
                visualFourth.textContent = "End uncertainty: " + node.terminationUncertainty;
            }
        } else if (node.hasOwnProperty("coordinates")) {
            visualLabel.style.visibility = "visible";
            visualFirst.style.visibility = "visible";
            visualLabel.textContent = "Type: Coordinates";
            visualFirst.textContent = "Coords: " + node.coordinates;
        } else if (node.hasOwnProperty("title") || node.hasOwnProperty("author") || node.hasOwnProperty("source")) {
            visualLabel.style.visibility = "visible";
            visualLabel.textContent = "Type: Reference";

            if (node.hasOwnProperty("title") && node.title !== "") {
                visualFirst.style.visibility = "visible";
                visualFirst.textContent = "Title: " + node.title;
            }

            if (node.hasOwnProperty("author") && node.author !== "") {
                visualFirst.style.visibility = "visible";
                visualSecond.textContent = "Author: " + node.author;
            }

            if (node.hasOwnProperty("source") && node.source !== "") {
                visualFirst.style.visibility = "visible";
                visualThird.textContent = "Source: " + node.source;
            }
        }
    });
}

/**
 * TODO refactor to use map instead of mutable array
 * @param data
 * @returns {*}
 */
function transformNodes(data) {
    if (data.hasOwnProperty("nodes")) {
        for (const [i, el] of data.nodes.entries()) {
            if (el.hasOwnProperty("name")) {
                data.nodes[i].label = el.name;
                data.nodes[i].group = 0;
            } else if (el.hasOwnProperty("start")) {
                data.nodes[i].label = el.start;
                data.nodes[i].group = 1;
            } else if (el.hasOwnProperty("title")) {
                data.nodes[i].label = el.title;
                data.nodes[i].group = 2;
            }

            data.nodes[i].label = addNewlines(el.label, 30);
        }
    }

    return data;
/*
    return data.nodes.map(label => {
        switch (label) {
            case "Event":
                label = name
                break;
        }
    });*/
}

function addNewlines(str, segment) {
    let result = "";
    while (str.length > 0) {
        result += str.substring(0, segment) + '\n';
        str = str.substring(segment);
    }
    return result;
}

function isNotCorrectDate(str) {
    let regEx = /^\d{4}-\d{2}-\d{2}$/;
    return str.match(regEx) == null;
}