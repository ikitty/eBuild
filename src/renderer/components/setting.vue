<template>
<div class="project_add">
    <div class="mod_tit">全局设置</div>
    <div class="row">
        <el-checkbox v-model="transRem">开启px2rem</el-checkbox>
        , 1rem = <el-input class="ipt_ratio" v-model="remPxRatio"></el-input> px
    </div>
    <div class="row">
        <el-checkbox v-model="checkSyntax">同步前进行语法检查</el-checkbox>
    </div>
    <div class="row">
        <el-checkbox v-model="codeMinify">代码压缩</el-checkbox>
    </div>
    <div class="row">
        <el-checkbox v-model="removeProtocolHead">去协议头</el-checkbox>
    </div>
    <div class="row">
        <div class="row_btn">
            <el-button type="primary" @click="save">保存</el-button>
        </div>
    </div>
</div>
</template>

<script>
    import {mapMutations } from 'vuex'
    const store = window.localStorage

    export default {
        data(){
            return {
                transRem: true,
                remPxRatio: 50,
                checkSyntax: false,
                codeMinify: false,
                removeProtocolHead: true
            }
        }
        ,created(){
        }
        ,methods: {
            ...mapMutations(['addCount'])
            ,save() {
                //TODO
                this.$router.push({name: 'index'})
            }
        }
    }
</script>

<style scoped>
    .mod_tit {padding-top: 20px;font-size: 22px;padding-bottom:10px;color: #555;}
    .project_add {width: 500px;margin: 0 auto;padding: 20px 0; font-size: 14px;}
    .project_add .row {margin: 20px 0;}
    .project_add .row_btn {padding: 15px 0 0;}
    .project_add .row_btn button {margin-right: 10px;}
    .project_add .sel {width:100%;}

    .ipt_ratio {width: 40px;height: 20px;}

</style>

