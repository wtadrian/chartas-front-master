fetch("http://" + localStorage.getItem("hostname"))
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log('Status code problem: ' + response.status);
                return;
            }

            console.log(response);
            document.getElementById("mode").textContent = "Online";
        }
    )
    .catch(function(err) {
        console.log(err.textContent);
        document.getElementById("mode").textContent = "Offline";
    });
