<template>
    <div id="app">
        <hd></hd>
        <transition name="fade" mode="out-in">
            <router-view class="fade"></router-view>
        </transition>

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
* {margin: 0;padding: 0;list-style: none;}
body {font: 400 14px/1.5 'Microsoft Yahei', Arial;}
a {text-decoration: none; color: #555 }
a:hover {color:#000}

.fade {transition: all 0.2s ease;}
.fade-leave-active {opacity:0.0}
.fade-enter-active {opacity:1}
</style>