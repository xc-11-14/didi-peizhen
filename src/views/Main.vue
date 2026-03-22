<template>
    <div class="common-layout">
        <el-container>
            <el-aside :width="menuStore.isCollapse ? '64px' : '200px'">
                <Aside />
            </el-aside>
            <el-container>
                <el-header><NavHeader /></el-header>
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import Aside from '../components/aside.vue'
import NavHeader from '../components/navHeader.vue'
import { useMenuStore } from '@/store/menu'
const menuStore = useMenuStore()
</script>

<style scoped lang="less">
.common-layout {
    height: 100%;
    .el-container {
        height: 100%;
    }
}
</style>
