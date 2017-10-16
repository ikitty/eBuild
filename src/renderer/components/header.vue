<template>
<div class="header">
    <div class="nav_logo">
        <router-link :to="logoLink">
            <img class="logo" src="~@/assets/logo.png" >
            <h3 >eBuild</h3>
        </router-link>
    </div>
    <div class="nav_right">
        <router-link to="/project_add">新增项目</router-link>
        <span class="gap">|</span>
        <router-link to="/setting">全局设置</router-link>
        <span class="gap">|</span>
        <a href="#">其他工具</a>
        <span class="gap">|</span>
        <a href="javascript:;" @click="open('http://tgideas.qq.com')">关于</a>       
    </div>
</div>
</template>

<script>
    import {mapState} from 'vuex'
   
    export default {
        data(){
            return {
                // logoLink: '/'
            }
        },
        computed: {
            ...mapState({
                project_list: (state) =>state.Core.project_list
            })
            ,logoLink: function(){
                return this.project_list.length > 0 ? '/project_list' : '/'
            }
        },
        created(){
                console.log(this.logoLink)
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            }
        }
    }
</script>

<style scoped>
    .header {height:80px;padding:0px 20px;line-height:80px;background: #f8f8f8; border-bottom:1px solid #ddd;}
    .nav_logo {float:left;}
    .nav_logo .logo {float:left;height:35px;margin-top:22px;}
    .nav_logo h3 {float:left;padding-left:10px;font-size:18px;font-weight: normal;}

    .nav_right {float:right;}
    .nav_right a {float:left;padding:0px 10px;}
    .nav_right .gap {float:left;padding: 0 5px;font-size:12px;color: #ddd;}
</style>
