AFRAME.registerComponent('is-visible', {
    schema: {
        default: '',
    },

    init: function() {
        console.log(this.el);
    },

    /**
     * If tracking an object, this will be called on every tick.
     * If looking at a position vector, this will only be called once (until further updates).
     */
    update: function() {},

    tick: function(t) {
        camera.updateMatrix();
        camera.updateMatrixWorld();
        var frustum = new THREE.Frustum();
        frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        if (frustum.containsPoint(this.el.getAttribute("position"))) {
            this.el.emit('isVisible');
        } else {
            this.el.emit('notVisible');
        }

    }
});