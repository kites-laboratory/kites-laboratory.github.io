window.onload = function () {
    rmCheck = document.getElementById("rememberMe");
    loginInput = document.getElementById("login");
    passInput = document.getElementById("password");
    if (localStorage.checkbox && localStorage.checkbox !== "") {
        //console.error("load true " + localStorage.username + " --- " + localStorage.password);
        $("#rememberMe").prop('checked', true);
        loginInput.value = localStorage.username;
        passInput.value = localStorage.password;
    } else {
        //console.error("load false");
        $("#rememberMe").prop('checked', false);
        loginInput.value = "";
        passInput.value = "";
    }
};
$(document).ready(function () {
    // Check and confirm flatmaps
    flatmapsChange(localStorage.usedFlatmaps === 'true');

    // Start check and update patches
    external.invoke('start_update');
});
function patchingStatusReady() {
    $("#download-progress-bar")
        .css("width", "100%")
        .attr("aria-valuenow", "100")
        .removeClass("bg-warning")
        .removeClass("bg-danger")
        .addClass("bg-success");
    $("#download-progress-text").text("Ready");
    $("#button-play").prop('disabled', false);
    $("#password").prop('disabled', false);
}

function patchingStatusError(errorMsg) {
    $("#download-progress-bar")
        .css("width", "100%")
        .attr("aria-valuenow", "100")
        .removeClass("bg-success")
        .removeClass("bg-warning")
        .addClass("bg-danger");
    $("#download-progress-text").text("Failure: " + errorMsg);
}

function patchingStatusDownloading(nbDownloaded, nbTotal, bytesPerSec) {
    var percentage = (100 * nbDownloaded) / nbTotal;
    if (bytesPerSec > 0) {
        var downloadSpeed = " - " + humanFileSize(bytesPerSec) + "/s";
    } else {
        var downloadSpeed = "";
    }
    $("#download-progress-bar").css("width", percentage + "%").attr("aria-valuenow", percentage)
        .removeClass("bg-success")
        .removeClass("bg-danger")
        .addClass("bg-warning");
    $("#download-progress-text").text("Downloading: " + nbDownloaded + "/" + nbTotal + downloadSpeed);
}

function patchingStatusInstalling(nbInstalled, nbTotal) {
    var percentage = (100 * nbInstalled) / nbTotal;
    $("#download-progress-bar").css("width", percentage + "%").attr("aria-valuenow", percentage)
        .removeClass("bg-success")
        .removeClass("bg-danger")
        .addClass("bg-warning");
    $("#download-progress-text").text("Installing: " + nbInstalled + "/" + nbTotal);
}

function patchingStatusPatchApplied(fileName) {
    $("#download-progress-bar")
        .css("width", "100%")
        .attr("aria-valuenow", "100")
        .removeClass("bg-warning")
        .removeClass("bg-danger")
        .addClass("bg-success");
    $("#download-progress-text").text("Successfully applied patch: " + fileName);
}

function notificationInProgress() {
    //  $('#notificationInProgressToast').toast('show');
}

function resetCache() {
    external.invoke('reset_cache');
    // $('#cacheResetToast').toast('show');
}

// Note: Function taken from https://stackoverflow.com/a/20732091
function humanFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kiB', 'MiB', 'GiB', 'TiB'][i];
}
function startGame() {
    lsRememberMe();
    var login = document.getElementById('login').value;
    var password = document.getElementById('password').value;
    if (login == "" || password == "") {
        return false;
    }
    // Invoke the patcher's 'login' function
    external.invoke(JSON.stringify({
        function: 'login',
        parameters: {
            'login': login, 'password': password
        }
    }));
    return true;
}
function openURL(url) {
    external.invoke(JSON.stringify({
        function: 'open_url',
        parameters: {
            'url': url
        }
    }));
    return true;
}
function grfOn() {
    external.invoke('grfon');
    alert("Done!");
    return true;
}
function grfOff() {
    external.invoke('grfoff');
    alert("Done!");
    return true;
}
function flatmapsClick() {
    let flatmapsOption = $("#flatmapsOption");
    let usedFlatmaps = false;
    if (flatmapsOption.hasClass("disabled")) {
        usedFlatmaps = true;
    } else {
        usedFlatmaps = false;
    }
    flatmapsChange(usedFlatmaps);
}

function flatmapsChange(usedFlatmaps) {
    let flatmapsOption = $("#flatmapsOption");
    if (usedFlatmaps) {
        // Enable faltmaps
        flatmapsOption.removeClass("disabled");
        flatmapsOption.find("i").attr("class", "bi bi-check-square")
        flatmapsOption.find("span").html("(Enabled)");
    } else {
        flatmapsOption.addClass("disabled");
        flatmapsOption.find("i").attr("class", "bi bi-x-square")
        flatmapsOption.find("span").html("(Disabled)");
    }

    localStorage.usedFlatmaps = usedFlatmaps;

    external.invoke(JSON.stringify({
        function: 'flatmaps_option',
        parameters: {
            'enabled': usedFlatmaps
        }
    }));
}


function lsRememberMe() {
    //event.preventDefault();
    //console.error("clicked " + loginInput);
    if ($("#rememberMe").prop('checked') && $("#login").value !== "") {
        localStorage.username = loginInput.value;
        localStorage.password = passInput.value;
        localStorage.checkbox = $("#rememberMe").value;
    } else {
        //console.error("false");
        localStorage.username = "";
        localStorage.password = "";
        localStorage.checkbox = "";

    }
}

/** // Pending check server staus
if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
} else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET", "https://muhro.eu/flux/?module=server&action=status-xml", false);
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;
var peak = xmlDoc.getElementsByTagName('peakOnline')[0].childNodes[0].nodeValue;
var players = xmlDoc.getElementsByTagName('playersOnline')[0].childNodes[0].nodeValue;
var vendors = xmlDoc.getElementsByTagName('vendorsOnline')[0].childNodes[0].nodeValue;
var onlinetotal = xmlDoc.getElementsByTagName('allOnline')[0].childNodes[0].nodeValue;
var loginserver = xmlDoc.getElementsByTagName('loginServer')[0].childNodes[0].nodeValue;
var charserver = xmlDoc.getElementsByTagName('charServer')[0].childNodes[0].nodeValue;
var mapserver = xmlDoc.getElementsByTagName('mapServer')[0].childNodes[0].nodeValue;

if (loginserver = 1) { var Loginserver = "Online"; }
if (loginserver = 0) { var Loginserver = "Offline"; }

if (mapserver = 1) { var Mapserver = "Online"; }
if (mapserver = 0) { var Mapserver = "Offline"; }

if (charserver = 1) { var Charserver = "Online"; }
if (charserver = 0) { var Charserver = "Offline"; }

if (Charserver = "Online") { var charcolor = "green"; } else { var charcolor = "red"; }

if (Mapserver = "Online") { var mapcolor = "green"; } else { var mapcolor = "red"; }

if (Loginserver = "Online") { var logincolor = "green"; } else { var logincolor = "red"; }

*/

// Parse News from XML
if (window.XMLHttpRequest) {
    xmlrsshttp = new XMLHttpRequest();
} else {
    xmlrsshttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlrsshttp.open("GET", "http://127.0.0.1:88/patcher-web/news/feed.xml", false);
// xmlrsshttp.open("GET", "https://kites-laboratory.github.io/patcher-web/news/feed.xml", false);
xmlrsshttp.send();
xmlRssDoc = xmlrsshttp.responseXML;
var title = new Array();
var url = new Array();
var desc = new Array();
var time = new Array();
var newsc = Math.min(xmlRssDoc.getElementsByTagName("entry").length, 5);
for (var i = 1; i <= newsc; i++) {
    let url_path = xmlRssDoc.getElementsByTagName('id')[i].childNodes[0].nodeValue.split("/");
    let discord_url = "https://discord.com/channels/847686882111258644/1121974498757984337/" + url_path.slice(-1);
    
    console.log(xmlRssDoc.getElementsByTagName('content')[0]);
    title[i] = xmlRssDoc.getElementsByTagName('title')[i].childNodes[0].nodeValue;
    url[i] = discord_url;
    desc[i] = xmlRssDoc.getElementsByTagName('content')[i-1].childNodes[0].nodeValue;
    time[i] = xmlRssDoc.getElementsByTagName('published')[i-1].childNodes[0].nodeValue;
    time[i] = time[i].slice(0, 10);
}
