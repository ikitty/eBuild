<template>
<div class="header">
    <div class="nav_logo">
        <img class="logo" src="~@/assets/logo.png" >
        <h3 >eBuild</h3>
    </div>
    <div class="nav_right">
        <router-link to="/project_add">新增项目</router-link>
        <a target="_blank" href="#">全局设置</a>       
        <a target="_blank" href="#">其他工具</a>       
        <a href="javascript:;" @click="open('http://tgideas.qq.com')">关于</a>       
    </div>
</div>
</template>

<script>
    export default {
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            }
        }
    }
</script>

<style scoped>
    .header {height:80px;padding:0px 20px;line-height:80px;border-bottom:1px solid #ddd;}
    .nav_logo {float:left;}
    .nav_logo .logo {float:left;height:35px;margin-top:22px;}
    .nav_logo h3 {float:left;padding-left:10px;font-weight: normal;}

    .nav_right {float:right;}
    .nav_right a {float:left;padding:0px 10px;}
</style>
