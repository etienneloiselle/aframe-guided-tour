/* Variable globale - pour socketio */

var socket;
var hotspotList = [];
var controlPanelElem;



function getAllUrlParams(url) {

    // get query string from url (optional) or window

    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here

    var obj = {};

    // if query string exists

    if (queryString) {

        // stuff after # is not part of query string, so get rid of it

        queryString = queryString.split('#')[0];

        // split our query string into its component parts

        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {

            // separate the keys and the values

            var a = arr[i].split('=');



            // in case params look like: list[]=thing1&list[]=thing2

            var paramNum = undefined;

            var paramName = a[0].replace(/\[\d*\]/, function(v) {

                paramNum = v.slice(1, -1);

                return '';

            });



            // set parameter value (use 'true' if empty)

            var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];



            // (optional) keep case consistent

            paramName = paramName.toLowerCase();

            paramValue = paramValue.toLowerCase();



            // if parameter name already exists

            if (obj[paramName]) {

                // convert value to array (if still string)

                if (typeof obj[paramName] === 'string') {

                    obj[paramName] = [obj[paramName]];

                }

                // if no array index number specified...

                if (typeof paramNum === 'undefined') {

                    // put the value on the end of the array

                    obj[paramName].push(paramValue);

                }

                // if array index number specified...
                else {

                    // put the value at that index number

                    obj[paramName][paramNum] = paramValue;

                }

            }

            // if param name doesn't exist yet, set it
            else {

                obj[paramName] = paramValue;

            }

        }

    }



    return obj;

} /* function getAllUrlParams() */





// Called by Networked-Aframe when connected to server

function onConnect(evt) {

    console.log("onConnect", new Date());
    console.log('clientConnected event. clientId =', evt.detail.clientId);
    console.log(NAF.clientId);
    console.log(evt.detail.clientId);

    jQuery("#connection-list ul").append('<li class="connected-client" data-clientid="' + evt.detail.clientId + '"><i class="far fa-desktop"><span>' + evt.detail.clientId + '</span></i></li>');
    jQuery('#connection-list ul li[data-clientid="' + NAF.clientId + '"]').addClass("is-local-client");
    /* if (getAllUrlParams().remote == "remote") {

        console.log("I'M THE REMOTE CONTROL !!");*/



    document.body.addEventListener('entityCreated', function(evt) {
        console.error('clientConnected event. clientId =', evt.detail.clientId);
        jQuery(".networked-camera")[0].setAttribute('camera', 'active', true);
        jQuery(".networked-camera")[0].setAttribute('multitouch-look-controls', true);
    });

    /*} */

}





function onDisconnected(evt) {

    console.log("client disconected: " + evt.detail.clientId);
    jQuery('#connection-list ul li[data-clientid="' + evt.detail.clientId + '"]').remove();
    /*if (jQuery(".networked-camera").length < 1) {
        jQuery("#main-camera")[0].setAttribute('camera', 'active', true);
    }*/
}





function genererNavScene() {

    $(".scene").each(function(index, element) {
        var sceneName = $(element).attr("data-name");
        var sceneId = $(element).attr("id");
        $("#scene-nav").append('<a class="scene-thumbnail" href="javascript: changeScene(\'' + sceneId + '\', false)">' + sceneName + '</a>');
        console.log(index);

    });

}



function changeScene(scene, fromRemote) {
    console.log('function changeScene(scene)');



    if (fromRemote == false) {
        NAF.connection.broadcastData("aframeCommand", scene);
    }



    vue360.emit('fadeout');
    setTimeout(function() {
        vue360.setAttribute('material', 'src', '#' + scene);
        setHotspots(scene);
        console.log(this);
    }, 500);



    setTimeout(function() {
        vue360.emit('fadein');
    }, 500);

}



function setHotspots(scene) {
    console.log("setHotspots(" + scene + ")");
    $(".hotspot").remove();
    $.each(hotspotList[scene], function(index, value) {
        console.log(value);
    });

};

function disconnectLocal() {
    AFRAME.scenes[0].removeAttribute('networked-scene');
    jQuery(".connected-client").remove();
}



// On mobile remove elements that are resource heavy

var isMobile = AFRAME.utils.device.isMobile();

jQuery(document).on("click", ".is-local-client", function() {
    disconnectLocal();
});

$(document).ready(function() {

    controlPanelElem = jQuery("#control-panel");
    /* Va chercher la liste json des hotspots */
    $.ajax({
            url: "../hotspots/hotspots.json",
            cache: false
        })
        .done(function(data) {
            console.log(data);
            hotspotList = data;
        });





    /* Quand un client ce déconnecte */
    document.body.addEventListener('clientDisconnected', function(evt) {
        onDisconnected(evt);
    });

    document.body.addEventListener('clientConnected', function(evt) {
        onConnect(evt);
    });



    NAF.connection.subscribeToDataChannel("aframeCommand", function(senderId, dataType, data, targetId) {
        changeScene(data, true);
        console.log(data);
    });

    jQuery("#btn-menu").click(function() {
        if (controlPanelElem.hasClass("actif")) {
            controlPanelElem.removeClass("actif");
        } else {
            controlPanelElem.addClass("actif");
        }
    });

    /* Ajoute les scènes */
    genererNavScene();
});