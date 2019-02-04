function getVh() {
    // ref: https://stackoverflow.com/a/8876069
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

var accordionNav = {
    padding: 10,

    links: [],

    top: new Set(),
    bottom: new Set(),

    register: function(links) {
        for (var i = 0; i < links.length; i++) {
            this.links.push(links[i]);
            // attach ref to linked element
            this.links[i].linkedElement = document.getElementById(this.links[i].getAttribute("href").substr(1));
            // sort order variable to prevent items getting mixed up on fast scrolls
            this.links[i].sortOrder = i;
            // add click listener for smooth scrolling
            this.links[i].addEventListener("click", function(e) {
                e.preventDefault();
                history.replaceState({}, "", "#" + this.linkedElement.id);
                this.linkedElement.scrollIntoView({
                    behavior: "smooth"
                });
            });
            // set required styles
            this.links[i].style.position = "fixed";
            this.links[i].style.right = "calc(65% + 50px)";
        }
    },

    addToTop: function(link) {
        this.top.add(link);
    },

    removeFromTop: function(link) {
        this.top.delete(link);
    },

    addToBottom: function(link) {
        this.bottom.add(link);
    },

    removeFromBottom: function(link) {
        this.bottom.delete(link);
    },

    topHeight: function() {
        var height = this.padding;
        var top = [...this.top];
        for (var i = 0; i < top.length; i++) {
            height += top[i].offsetHeight;
        }
        return height;
    },

    bottomHeight: function() {
        var height = this.padding;
        var bottom = [...this.bottom];
        for (var i = 0; i < bottom.length; i++) {
            height += bottom[i].offsetHeight;
        }
        return height;
    },

    renderTop: function() {
        var height = this.padding;
        // set is sorted to maintain correct order
        var top = [...this.top].sort((a, b) => a.sortOrder - b.sortOrder);
        for (var i = 0; i < top.length; i++) {
            top[i].style.top = height + 'px';
            top[i].style.bottom = '';
            height += top[i].offsetHeight;
        }
    },

    renderBottom: function() {
        var height = this.padding;
        // set is sorted to maintain correct order
        var bottom = [...this.bottom].sort((a, b) => b.sortOrder - a.sortOrder);
        for (var i = 0; i < bottom.length; i++) {
            bottom[i].style.top = '';
            bottom[i].style.bottom = height + 'px';
            height += bottom[i].offsetHeight;
        }
    },

    redraw: function() {
        // calculate positions of nav links
        for (var i = 0; i < this.links.length; i++) {
            var link = this.links[i];

            var positionTop = link.linkedElement.getBoundingClientRect().top;
            // subtract link's top padding to line it up with the content
            positionTop -= parseInt(window.getComputedStyle(link).paddingTop);
            var positionBottom = positionTop + link.offsetHeight;

            if (link.stuckToTop) {
                // check if link should unstick from top
                if (positionTop > accordionNav.topHeight() - link.offsetHeight) {
                    accordionNav.removeFromTop(link);
                    link.stuckToTop = false;
                    link.style.top = positionTop + "px";
                    link.style.bottom = '';
                }
            } else if (link.stuckToBottom) {
                // check if link should unstick from bottom
                if (positionBottom < (getVh() - (accordionNav.bottomHeight() - link.offsetHeight))) {
                    accordionNav.removeFromBottom(link);
                    link.stuckToBottom = false;
                    link.style.top = positionTop + "px";
                    link.style.bottom = '';
                }
            } else {
                if (positionTop <= accordionNav.topHeight()) {
                    // check if link should stick to top
                    accordionNav.addToTop(link);
                    link.stuckToTop = true;
                } else if (positionBottom >= (getVh() - accordionNav.bottomHeight())) {
                    // check if link should stick to bottom
                    accordionNav.addToBottom(link);
                    link.stuckToBottom = true;
                } else {
                    link.style.top = positionTop + "px";
                    link.style.bottom = '';
                }
            }
        }
        this.renderTop();
        this.renderBottom();
    },

    initialize: function() {
        // initial draw to position links
        this.redraw();
        // call redraw again to prevent overlapping links
        this.redraw();
        // if url hash present, scroll to it
        if (location.hash) {
            window.setTimeout(function() {
                document.getElementById(location.hash.substr(1)).scrollIntoView({
                    behavior: "smooth"
                });
            }, 1);
        }
    }
}