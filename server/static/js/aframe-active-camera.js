AFRAME.registerComponent('camera-listener', {
    init: function() {
        var sceneEl = this.el.sceneEl;
        // Get active camera
        sceneEl.addEventListener('camera-set-active', function(evt) {
            console.log(evt.detail.cameraEl.components.camera.camera) // active camera
        });
    }
})