<template>
  <el-menu :style="{'width': menuStore.isCollapse ? '64px' : '200px'}"
    active-text-color="#ffd04b" 
    background-color="#545c64" 
    class="aside-menu" 
    :default-active="route.path"
    text-color="#fff" 
    @open="handleOpen" 
    @close="handleClose" 
    :collapse="menuStore.isCollapse">
    <p class="logo-lg">{{ menuStore.isCollapse ? 'DIDI' : 'DIDI陪诊' }}</p>
    <treeMenu :menuData="menuData" />
  </el-menu>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useMenuStore } from "@/store/menu";

const menuStore = useMenuStore()
const route = useRoute()
// 当前激活菜单对应的完整路由路径
const menuData = menuStore.routerList;
const handleOpen = () => { };
const handleClose = () => { };
</script>
<style scoped lang="less">
.aside-menu {
  height: 100vh;
  transition: none;

  .logo-lg {
    font-size: 20px;
    text-align: center;
    color: #fff;
    line-height: 50px;
    height: 50px;
  }
}
</style>