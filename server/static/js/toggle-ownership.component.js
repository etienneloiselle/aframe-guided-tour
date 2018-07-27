/**
 * Rotate the entity every frame if you are the owner.
 * When you press enter take ownership of the entity,
 * spin it in the opposite direction and change its color.
 */
AFRAME.registerComponent('toggle-ownership', {
    schema: {
        speed: { default: 0.01 },
        direction: { default: 1 }
    },

    init() {
        var that = this;
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('mousedown', this.onMouseDown);

        NAF.utils.getNetworkedEntity(this.el).then((el) => {
            if (NAF.utils.isMine(el)) {
                that.updateColor();
            } else {
                that.updateOpacity(0.5);
            }

            // Opacity is not a networked attribute, but change it based on ownership events
            let timeout;

            el.addEventListener('ownership-gained', e => {
                that.updateOpacity(1);
            });

            el.addEventListener('ownership-lost', e => {
                that.updateOpacity(0.5);
            });

            el.addEventListener('ownership-changed', e => {
                clearTimeout(timeout);
                console.log(e.detail)
                if (e.detail.newOwner == NAF.clientId) {
                    //same as listening to 'ownership-gained'
                } else if (e.detail.oldOwner == NAF.clientId) {
                    //same as listening to 'ownership-lost'
                } else {
                    that.updateOpacity(0.8);
                    timeout = setTimeout(() => {
                        that.updateOpacity(0.5);
                    }, 200)
                }
            });
        });
    },

    onKeyUp(e) {
        return;
    },

    onMouseDown(e) {
        if (NAF.clientId !== "") {
            if (NAF.utils.isMine(this.el) !== true) {
                console.log("Taking Ownership of the camera");
                NAF.utils.takeOwnership(this.el);
            }
        }
    },

    updateColor() {
        return;
    },

    updateOpacity(opacity) {
        this.el.setAttribute('material', 'opacity', opacity);
    },

    tick() {
        // Only update the component if you are the owner.
        if (!NAF.utils.isMine(this.el)) {
            return;
        }

        this.el.object3D.rotateY(this.data.speed * this.data.direction);

        const rotation = this.el.object3D.rotation;
        this.el.setAttribute('rotation', {
            x: THREE.Math.radToDeg(rotation.x),
            y: THREE.Math.radToDeg(rotation.y),
            z: THREE.Math.radToDeg(rotation.z),
        });
    }
});