AFRAME.registerComponent('set-sky', {
    schema: { default: '' },
    init: function() {
        var data = this.data;
        console.log(data);
        var sky = document.querySelector('#vue360');
        this.el.addEventListener('click', function(e) {
            sky.emit('fadeout');

            setTimeout(function() {
                /*sky.setAttribute('src', this.data);*/
                console.log(this);
            }, 1000);

            setTimeout(function() {
                sky.emit('fadein');
            }, 1000);

        });
    }
});