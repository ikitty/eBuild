<template>
    <div id="app">
        <hd></hd>
        <router-view></router-view>
    </div>
</template>

<script>
    import hd from './components/header'
    export default { 
        name: 'ebuild',
        components: {hd}
    }
</script>

<style>
* {margin: 0;padding: 0;}
body {font: 400 14px/1.5 'Source Code Pro', Arial;}
a {text-decoration: none; color: #333 }
a:hover {color:#000}
</style>