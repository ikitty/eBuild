<template>
<div id="wrapper">
    <main>
    </main>
</div>
</template>

<script>

export default {
    name: 'index',
    methods: {
        open(link) {
            this.$electron.shell.openExternal(link)
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Source Sans Pro', sans-serif; }
a {text-decoration:none;color:#333;}
a:hover {color:#888;}

#wrapper {
    background:
    radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, .9) 100%
    );
    height: 100vh; padding: 0px 0px; width: 100vw; }

</style>
