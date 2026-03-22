<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="header-icon" size="20" @click="collapseMenu">
                <Fold />
            </el-icon>
            <ul class="flex-box">
                <li v-for="(item, index) in menuStore.selectMenu" :key="item?.meta.path" class="flex-box tab"   
                    :class="{ 'selected': item?.meta.path === route.path }">
                    <router-link :to="item?.meta.path" class="text flex-box">
                        <el-icon size="20">
                            <component :is="item?.meta.icon" />
                        </el-icon>
                        {{ item?.meta.name }}
                    </router-link>
                    <el-icon class="close" @click="closeTab(item, index)">
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown @command="handleClick">
                <div class="el-dropdown-link flex-box">
                    <el-avatar :src="userInfo.avatar" />
                    <p class="user-name">{{ userInfo.name }}</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="cancel">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useMenuStore } from '@/store/menu'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const userInfo = JSON.parse(localStorage.getItem('pz_userInfo') || '{}')
function collapseMenu() {
    menuStore.collapseMenu()
}

// 接收要关闭的项和原数组中的索引（仅用于计算跳转目标）
function closeTab(closeItem: any, originIndex: number) {
    // 如果当前项是选中项
    if (closeItem.meta.path === route.path) {
        let targetPath = ''
        const currentList = menuStore.selectMenu
        // 优先跳转到下一个，否则跳转到前一个
        if (originIndex < currentList.length - 1) {
            targetPath = currentList[originIndex + 1]?.meta.path || ''
        } else if (originIndex > 0) {
            targetPath = currentList[originIndex - 1]?.meta.path || ''
        } else if (originIndex === 0) {
            ElMessage({
                message: '不能关闭最后一个标签页',
                type: 'warning'
            })
            return
        }
        if (targetPath) {
            router.push(targetPath)
        } else {
            router.push('/') 
        }
    }
    //如果删除的是非选中项,则直接调用closeMenu删除
    menuStore.closeMenu(closeItem.meta.path)
}

function handleClick(command: string) {
    if (command === 'cancel') {
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('menu')
        router.push('/login')
    }
}
</script>

<style scoped lang="less">
.flex-box {
    display: flex;
    align-items: center;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;

    .header-left {
        height: 100%;

        ul {
            height: 100%;

            .tab {
                height: 100%;
                padding: 0 10px;

                .text {
                    margin: 0 5px;
                }

                .close {
                    opacity: 0;
                    cursor: pointer;
                    color: #000;
                    font-size: 14px;
                }

                a {
                    color: #000;
                }

                &.selected {
                    background-color: #f5f5f5;

                    a {
                        color: #409eff;
                    }

                    i {
                        color: #409eff;
                    }
                }
            }
        }

        .header-icon {
            width: 45px;
            height: 100%;
        }

        .header-icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }



        .tab:hover {
            background-color: #f5f5f5;

            .close {
                opacity: 1;
            }
        }
    }

    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }
}
</style>
