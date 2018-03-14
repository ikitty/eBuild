<template>
<div class="header">
    <div class="nav_logo">
        <router-link to="/">
            <img class="logo" src="~@/assets/logo.png" >
            <h3 >eBuild</h3>
        </router-link>
    </div>
    <div class="nav_right">
        <router-link to="/project_list">项目列表</router-link>
        <span class="gap">|</span>
        <router-link to="/project_add">新增项目</router-link>
        <span class="gap">|</span>
        <router-link to="/setting">全局设置</router-link>
        <!-- <span class="gap">|</span>
        <router-link to="/">其他工具</router-link> -->
        <span class="gap">|</span>
        <a href="javascript:;" @click="open('http://tgideas.qq.com')">关于</a>       
    </div>
</div>
</template>

<script>
    import {mapGetters} from 'vuex'
   
    export default {
        data(){
            return {
                // logoLink: '/'
            }
        },
        computed: {
            ...mapGetters(['task_list'])
            ,logoLink: function(){
                return this.task_list.length > 0 ? '/project_list' : '/'
            }
        },
        created(){
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link)
            }
        }
    }
</script>

<style scoped>
    .header {height:80px;padding:0px 15px;line-height:80px;background: #f8f8f8; border-bottom:1px solid #ddd;}
    .nav_logo {float:left;}
    .nav_logo .logo {float:left;height:35px;margin-top:22px;}
    .nav_logo h3 {float:left;padding-left:8px;font-size:20px;font-weight: normal;}

    .nav_right {float:right;}
    .nav_right a {float:left;padding:0px 10px;}
    .nav_right .gap {float:left;padding: 0 5px;font-size:12px;color: #ddd;}
</style>
