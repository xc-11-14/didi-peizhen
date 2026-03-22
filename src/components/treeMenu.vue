<template>
    <template v-for="item in props.menuData">
        <!-- 递归调用treeMenu组件，渲染子菜单 -->
        <el-menu-item @click="handleClick(item)" v-if="!item.children || item.children.length === 0"
            :index="item.meta.path" :key="item.meta.path">
            <el-icon size="20">
                <!-- 动态渲染图标用 <component :is="变量值" /> -->
                <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.name }}</span>
        </el-menu-item>
        <el-sub-menu :key="item.meta.name" :index="item.meta.name" v-else>
            <template #title>
                <el-icon size="20">
                    <!-- 动态渲染图标用 <component :is="变量值" /> -->
                    <component :is="item.meta.icon" />
                </el-icon>
                <span>{{ item.meta.name }}</span>
            </template>
            <!-- 递归调用treeMenu组件，渲染子菜单 -->
            <treeMenu :menuData="item.children" :index="item.meta.path" />
        </el-sub-menu>
    </template>

</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMenuStore } from '@/store/menu'

const router = useRouter();
const props = defineProps(["menuData", "index"])
const menuStore = useMenuStore()
//点击菜单添加标签页
const handleClick = (item: any) => {
    // 调用添加菜单方法
    menuStore.addMenu(item)
    // 跳转到点击的路由
    router.push(item.meta.path);
}

</script>

<style scoped lang="less">

</style>
