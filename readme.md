# Accordion Nav
A small script which creates an accordion-style navigation pane, where each heading is in line with it's content. [Click here](https://krismania.github.io/accordion-nav/) for a live example.

![Accordion Nav Example](https://krismania.github.io/accordion-nav/accordion-nav.gif)

## Usage
Your document should contain a list of links to one side, and a main content area composed of `<section>`s. The
navigation links should correspond to the section IDs. In this example, the nav links have a common class to make
passing them to the script easier.
```
<div class="wrapper">
    <section id="section1">
        ...
    </section>
    <section id="section2">
        ...
    </section>
    <section id="section3">
        ...
    </section>
</div>

<nav>
    <ul>
        <li><a class="accordion" href="#section1">Section One</a></li>
        <li><a class="accordion" href="#section2">Section Two</a></li>
        <li><a class="accordion" href="#section3">Section Three</a></li>
    </ul>
</nav>
```

At the end of the body, include the following:
```
<script src="accordion-nav.js"></script>
<script>
    window.addEventListener('load', function() {
        accordionNav.register(document.getElementsByClassName("accordion"));
        window.addEventListener('scroll', function(e) {accordionNav.redraw()});
        accordionNav.initialize();
    });
</script>
```

The headings should now follow the content as the page is scrolled.

See the above example for a more complete demonstration of usage.
