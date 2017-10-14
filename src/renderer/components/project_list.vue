<template>
<div class="project_list">
    <ul>
        <li v-for="(item, index) in projList" :key="index">{{item.name}}({{item.path}})</li>
    </ul>
</div>
</template>

<script>
    const store = window.localStorage
    export default {
        data(){
            return {
                projList: []
            }
        }
        ,created(){
            let D = store.getItem('eBuild')
            D = JSON.parse(D) || []
            this.projList = D
        }
        ,methods: {
        }
    }
</script>

<style scoped>
    .project_list {width: 500px;margin: 0 auto;padding: 20px 0; }
    .project_list li  {border-bottom: 1px solid #ccc;padding: 8px 0;}

</style>
