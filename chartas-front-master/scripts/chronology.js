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
            "exporters/chronology?start=" + startDate + "&end=" + endDate)
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
                show(data);
            });

        return false;
    }

    let fr = new FileReader();

    fr.onload = function (e) {
        show(JSON.parse(e.target.result));
    };

    fr.readAsText(files.item(0));
    return false;
}

function findById(id) {
    for (const element of data.events) {
        if (element.id === id) {
            return element;
        }
    }
}

function show(items) {
    let container = document.getElementById('visualization');

    if (!items.hasOwnProperty("events")) {
        alert("No events found");
        return;
    }

    let options = {
        editable: true,
        onInitialDrawComplete: function () {
            logEvent("Timeline initial draw completed", {});
        },
    };

    data = items;

    let timeline = new vis.Timeline(container, data.events, options);
    timeline.focus(1);

    timeline.on("rangechange", function (properties) {
        rangeChanged(properties);
    });

    timeline.on("click", function (properties) {
        showSelected(properties);
    });

}

function rangeChanged(properties) {
    console.log("Range changed to [" + properties.start + ", " + properties.end + "]");
}

function showSelected(properties) {
    let label = document.getElementById("label");
    let parameterFirst = document.getElementById("parameter_1");
    let parameterSecond = document.getElementById("parameter_2");
    let parameterThird = document.getElementById("parameter_3");
    let parameterFourth = document.getElementById("parameter_4");
    let item = findById(properties.item);

    if (item !== undefined) {
        label.style.visibility = "visible";
        parameterFirst.style.visibility = "visible";
        parameterSecond.style.visibility = "visible";
        parameterThird.style.visibility = "visible";
        parameterFourth.style.visibility = "visible";

        label.textContent = "Name: " + item.content;
        parameterFirst.textContent = "Start: " + item.start;
        parameterSecond.textContent = "End: " + item.end;
        parameterThird.textContent = "Description: " + item.description;
        parameterFourth.textContent = "References: " + item.references.join(",");
    } else {
        label.style.visibility = "hidden";
        parameterFirst.style.visibility = "hidden";
        parameterSecond.style.visibility = "hidden";
        parameterThird.style.visibility = "hidden";
        parameterFourth.style.visibility = "hidden";
    }
}

function isNotCorrectDate(str) {
    let regEx = /^\d{4}-\d{2}-\d{2}$/;
    return str.match(regEx) == null;
}