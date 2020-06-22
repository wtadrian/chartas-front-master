let events = new Map();
let intervals = new Map();
let coordinates = new Map();
let references = new Map();

function appendEvent(id, event) {
    events.set(id, event);
    appendList(id, "events", displayEvent);
}

function appendInterval(id, interval) {
    intervals.set(id, interval);
    appendList(id, "intervals", displayInterval);
}

function appendCoordinates(id, coordinate) {
    coordinates.set(id, coordinate);
    appendList(id, "coordinates", displayCoordinates);
}

function appendReference(id, reference) {
    references.set(id, reference);
    appendList(id, "references", displayReference);
}

function appendList(id, listId, listener) {
    let ul = document.getElementById(listId);
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(id));
    li.setAttribute("id", id);
    li.addEventListener('click', listener);
    ul.appendChild(li);
}

fetch("http://" + localStorage.getItem("hostname") + "events/")
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log('Status code problem: ' + response.status);
                alert("Problem with backend service.");
                return;
            }

            return response.json()
        }
    )
    .then(function(data) {
        if (data.hasOwnProperty("events")) {
            let receivedEvents = data.events;
            console.log("Received events: " + receivedEvents.size);
            receivedEvents.forEach(function(event) {
                appendEvent(event.id, event)
            });
        }
    })
    .catch(function(err) {
        alert("Problem with backend service " + err.textContent)
    });

fetch("http://" + localStorage.getItem("hostname") + "intervals/")
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log('Status code problem: ' + response.status);
                alert("Problem with backend service.");
                return;
            }

            return response.json()
        }
    )
    .then(function(data) {
        let receivedIntervals = data;
        console.log("Received intervals: " + receivedIntervals.size);
        receivedIntervals.forEach(function(interval) {
            appendInterval(interval.id, interval)
        });
    })
    .catch(function(err) {
        alert("Problem with backend service " + err.textContent)
    });

fetch("http://" + localStorage.getItem("hostname") + "coordinates/")
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log('Status code problem: ' + response.status);
                alert("Problem with backend service.");
                return;
            }

            return response.json()
        }
    )
    .then(function(data) {
        let receivedCoordinates = data;
        console.log("Received coordinates: " + receivedCoordinates.size);
        receivedCoordinates.forEach(function(coordinates) {
            appendCoordinates(coordinates.id, coordinates)
        });
    })
    .catch(function(err) {
        alert("Problem with backend service " + err.textContent)
    });

fetch("http://" + localStorage.getItem("hostname") + "references/")
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log('Status code problem: ' + response.status);
                alert("Problem with backend service.");
                return;
            }

            return response.json()
        }
    )
    .then(function(data) {
        let receivedCoordinates = data;
        console.log("Received references: " + receivedCoordinates.size);
        receivedCoordinates.forEach(function(reference) {
            appendReference(reference.id, reference)
        });
    })
    .catch(function(err) {
        alert("Problem with backend service " + err.textContent)
    });

function openForm(type) {
    clearInfo();
    closeAnyForm();
    document.getElementById("insert" + type).style.display = "block";
}

function closeForm(type) {
    document.getElementById("insert" + type).style.display = "none";
}

function closeAnyForm() {
    document.getElementById("insertEvent").style.display = "none";
    document.getElementById("insertInterval").style.display = "none";
    document.getElementById("insertCoordinates").style.display = "none";
    document.getElementById("insertReference").style.display = "none";
}

function clearInfo() {
    document.getElementById("parameter_1").style.visibility = "hidden";
    document.getElementById("parameter_2").style.visibility = "hidden";
    document.getElementById("parameter_3").style.visibility = "hidden";
    document.getElementById("parameter_4").style.visibility = "hidden";
    document.getElementById("parameter_5").style.visibility = "hidden";
    document.getElementById("parameter_6").style.visibility = "hidden";
}

function addEvent() {
    let name = document.getElementById("eventName").value;
    let description = document.getElementById("eventDescription").value;

    if (name !== "" && description !== "") {
        let event = {"name" : name, "description" : description};
        let id = "invalid";

        fetch("http://" + localStorage.getItem("hostname") + "events/",
            {
                method: "POST",
                body: JSON.stringify(event)
            })
            .then(function(res){ return res.text(); })
            .then(function(data){
                id = JSON.stringify(data);

                if (id !== "invalid") {
                    event.id = id;
                    appendEvent(id, event);
                } else {
                    alert("Problem with backend service.")
                }
            });
    }
}

function addInterval() {
    let date = document.getElementById("date").value;
    let duration = document.getElementById("duration").value;
    let uncStart = document.getElementById("uncStart").value;
    let uncTermination = document.getElementById("uncTermination").value;

    if (date !== "" && duration !== null) {
        let interval = {"date" : date, "duration" : duration};

        if (uncStart !== "" && uncTermination !== "") {
            interval.commenceUncertainty = uncStart;
            interval.terminationUncertainty = uncTermination;
        }
        let id = "invalid";

        fetch("http://" + localStorage.getItem("hostname") + "intervals/",
            {
                method: "POST",
                body: JSON.stringify(interval)
            })
            .then(function(res){ return res.text(); })
            .then(function(data){
                id = JSON.stringify(data);

                if (id !== "invalid") {
                    interval.id = id;
                    appendInterval(id, interval);
                } else {
                    alert("Problem with backend service.")
                }
            });
    }
}

function addCoordinates() {
    let coords = document.getElementById("coords").value;

    if (coords !== "") {
        let coordinates = {"coordinates" : coords};
        let id = "invalid";

        fetch("http://" + localStorage.getItem("hostname") + "coordinates/",
            {
                method: "POST",
                body: JSON.stringify(coordinates)
            })
            .then(function(res){ return res.text(); })
            .then(function(data){
                id = JSON.stringify(data);

                if (id !== "invalid") {
                    coords.id = id;
                    appendCoordinates(id, coords);
                } else {
                    alert("Problem with backend service.")
                }
            });
    }
}

function addReference() {
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let source = document.getElementById("source").value;

    if (title !== "" && author !== "" && source !== "") {
        let reference = {"title" : title, "author" : author, "source" : source};
        let id = "invalid";

        fetch("http://" + localStorage.getItem("hostname") + "references/",
            {
                method: "POST",
                body: JSON.stringify(reference)
            })
            .then(function(res){ return res.text(); })
            .then(function(data){
                id = JSON.stringify(data);

                if (id !== "invalid") {
                    reference.id = id;
                    appendReference(id, reference);
                } else {
                    alert("Problem with backend service.")
                }
            });
    }
}

function sendCheck(outgoing, path, ingoing) {
    fetch("http://" + localStorage.getItem("hostname") + "events/" +
        outgoing + path + ingoing)
        .then(function(res) {
            if (res.status === 200) {
                alert("Attached!");
            } else {
                alert("Not attached");
            }

            return res.text();
        })
        .then(function(data) {
            if (data !== "") {
                alert("With label " + data)
            }
        })
}

function sendAttach(outgoing, path, ingoing) {
    fetch("http://" + localStorage.getItem("hostname") + "events/" +
        outgoing + path + ingoing,
        {
            method: "PUT",
        })
        .then(function(res) {
            if (res.status === 201) {
                alert("Correctly attached!")
            }
        });
}

function sendAttachLabeled(outgoing, path, ingoing, label) {
    fetch("http://" + localStorage.getItem("hostname") + "events/" +
        outgoing + path + ingoing,
        {
            method: "PUT",
            body: JSON.stringify({"label" : label})
        })
        .then(function(res) {
            if (res.status === 201) {
                alert("Correctly attached!")
            }
        });
}

function sendDetach(outgoing, path, ingoing) {
    fetch("http://" + localStorage.getItem("hostname") + "events/" +
        outgoing + path + ingoing,
        {
            method: "DELETE",
        })
        .then(function(res) {
            if (res.status === 204) {
                alert("Correctly detached")
            }
        });
}

function sendDelete(path, id) {
    fetch("http://" + localStorage.getItem("hostname") + path + id,
        {
            method: "DELETE",
        })
        .then(function(res) {
            if (res.status === 204) {
                alert("Correctly deleted")
            }
        });
}
function check() {
    let outgoing = document.getElementById("outgoing").value;
    let ingoing = document.getElementById("ingoing").value;

    if (events.has(outgoing)) {
        if (events.has(ingoing)) {
            sendCheck(outgoing, "/events/", ingoing);
        } else if (intervals.has(ingoing)) {
            sendCheck(outgoing, "/intervals/", ingoing);
        } else if (coordinates.has(ingoing)) {
            sendCheck(outgoing, "/coordinates/", ingoing);
        } else if (references.has(ingoing)) {
            sendCheck(outgoing, "/references/", ingoing);
        } else {
            alert("As second element put id of existing event, interval, coordinates or reference.");
        }
    } else {
        alert("As first element, put if of existing event");
    }
}

function attach() {
    let outgoing = document.getElementById("outgoing").value;
    let ingoing = document.getElementById("ingoing").value;
    let labely = document.getElementById("labely").value;

    if (events.has(outgoing)) {
        if (events.has(ingoing)) {
            if (labely === "") {
                alert("Remember to put label when attach events!");
                return;
            }

            sendAttachLabeled(outgoing, "/events/", ingoing, labely);
        } else if (intervals.has(ingoing)) {
            sendAttach(outgoing, "/intervals/", ingoing);
        } else if (coordinates.has(ingoing)) {
            sendAttach(outgoing, "/coordinates/", ingoing);
        } else if (references.has(ingoing)) {
            sendAttach(outgoing, "/references/", ingoing);
        } else {
            alert("As second element put id of existing event, interval, coordinates or reference.");
        }
    } else {
        alert("As first element, put if of existing event");
    }
}

function detach() {
    let outgoing = document.getElementById("outgoing").value;
    let ingoing = document.getElementById("ingoing").value;

    if (events.has(outgoing)) {
        if (events.has(ingoing)) {
            sendDetach(outgoing, "/events/", ingoing);
        } else if (intervals.has(ingoing)) {
            sendDetach(outgoing, "/intervals/", ingoing);
        } else if (coordinates.has(ingoing)) {
            sendDetach(outgoing, "/coordinates/", ingoing);
        } else if (references.has(ingoing)) {
            sendDetach(outgoing, "/references/", ingoing);
        } else {
            alert("As second element put id of existing event, interval, coordinates or reference.");
        }
    } else {
        alert("As first element, put if of existing event");
    }
}

function deleteEntity() {
    let id = document.getElementById("deleteId").value;

    if (events.has(id)) {
        sendDelete("/events/", id);
    } else if (intervals.has(id)) {
        sendDelete("/intervals/", id);
    } else if (coordinates.has(id)) {
        sendDelete("/coordinates/", id);
    } else if (references.has(id)) {
        sendDelete("/references/", id);
    } else {
        alert("To delete entity put proper id");
    }
}

function displayEvent(event) {
    closeAnyForm();
    clearInfo();
    let entity = events.get(event.target.id);
    let visualFirst = document.getElementById("parameter_1");
    let visualSecond = document.getElementById("parameter_2");
    let visualThird = document.getElementById("parameter_3");
    let visualFourth = document.getElementById("parameter_4");
    let visualFifth = document.getElementById("parameter_5");
    let visualSixth = document.getElementById("parameter_6");

    if (entity.hasOwnProperty("name") && entity.hasOwnProperty("description")) {
        visualFirst.style.visibility = "visible";
        visualFirst.textContent = "Name: " + entity.name;
        visualSecond.style.visibility = "visible";
        visualSecond.textContent = "Description: " + entity.description;

        if (entity.hasOwnProperty("intervalId")) {
            visualThird.style.visibility = "visible";
            visualThird.textContent = "Interval Id: " + entity.intervalId;
        }

        if (entity.hasOwnProperty("coordinatesId")) {
            visualFourth.style.visibility = "visible";
            visualFourth.textContent = "Coordinates Id: " + entity.coordinatesId;
        }

        if (entity.references.length > 0) {
            visualFifth.style.visibility = "visible";
            visualFifth.textContent = "References Ids: ";
            entity.references.forEach(function (reference) {
                visualFifth.textContent += reference + " ";
            })
        }

        if (entity.relationships.length > 0) {
            visualSixth.style.visibility = "visible";
            visualSixth.textContent = "Outgoing Events Ids: ";
            entity.relationships.forEach(function (relationship) {
                visualSixth.textContent += relationship + " ";
            })
        }
    }
}

function displayInterval(interval) {
    closeAnyForm();
    clearInfo();
    let entity = intervals.get(interval.target.id);
    let visualFirst = document.getElementById("parameter_1");
    let visualSecond = document.getElementById("parameter_2");
    let visualThird = document.getElementById("parameter_3");
    let visualFourth = document.getElementById("parameter_4");

    if (entity.hasOwnProperty("date") && entity.hasOwnProperty("duration")) {
        visualFirst.style.visibility = "visible";
        visualFirst.textContent = "Date: " + entity.date.year + ":" + entity.date.monthValue + ":" + entity.date.dayOfMonth;
        visualSecond.style.visibility = "visible";
        visualSecond.textContent = "Duration: " + entity.duration;

        if (entity.hasOwnProperty("commenceUncertainty")) {
            visualThird.style.visibility = "visible";
            visualThird.textContent = "Commence Uncertainty: " + entity.commenceUncertainty;
        }

        if (entity.hasOwnProperty("terminationUncertainty")) {
            visualFourth.style.visibility = "visible";
            visualFourth.textContent = "Termination Uncertainty: " + entity.terminationUncertainty;
        }
    }
}

function displayCoordinates(coordinate) {
    closeAnyForm();
    clearInfo();
    let entity = coordinates.get(coordinate.target.id);
    let visualFirst = document.getElementById("parameter_1");

    if (entity.hasOwnProperty("lonLat")) {
        visualFirst.style.visibility = "visible";
        visualFirst.textContent = "Coords: " + entity.lonLat;
    } else if (entity.hasOwnProperty("points")) {
        visualFirst.style.visibility = "visible";
        visualFirst.textContent = "Coords: " + entity.points;
    } else if (entity.hasOwnProperty("polygons")) {
        visualFirst.style.visibility = "visible";
        visualFirst.textContent = "Coords: " + entity.polygons;
    }
}

function displayReference(reference) {
    closeAnyForm();
    clearInfo();
    let entity = references.get(reference.target.id);
    let visualFirst = document.getElementById("parameter_1");
    let visualSecond = document.getElementById("parameter_2");
    let visualThird = document.getElementById("parameter_3");

    if (entity.hasOwnProperty("title") && entity.hasOwnProperty("author") && entity.hasOwnProperty("source")) {
        visualFirst.style.visibility = "visible";
        visualFirst.textContent = "Title: " + entity.title;
        visualSecond.style.visibility = "visible";
        visualSecond.textContent = "Author: " + entity.author;
        visualThird.style.visibility = "visible";
        visualThird.textContent = "Source: " + entity.source;
    }
}