function save() {
    let hostName = document.getElementById("hostname").value;
    localStorage.setItem("hostname", hostName);
    location.reload(false);
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("hostname").placeholder = localStorage.getItem("hostname");
    document.getElementById("current_hostname").innerHTML = localStorage.getItem("hostname");
}, false);
