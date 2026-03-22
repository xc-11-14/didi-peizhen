<template>
    <panelHead :route="route" />
    <!-- 全屏容器 -->
    <el-container class="full-container" height="100vh">
        <!-- 主内容区 -->
        <el-container class="main-container">
            <el-main class="main-content">
                <!-- 顶部统计卡片行 -->
                <el-row :gutter="20" class="top-row">
                    <!-- 用户信息卡片 -->
                    <el-col :span="8">
                        <el-card class="user-card">
                            <div class="user-info">
                                <img :src="dashboardData.user.user_img" class="user-avatar" />
                                <span class="username">{{ dashboardData.user.user_name }}</span>
                            </div>
                            <div class="line"></div>
                            <div class="user-detail">
                                <p>当前权限: &nbsp;{{ dashboardData.user.permission }}</p>
                                <p>登录的ip: &nbsp;{{ dashboardData.user.ip }}</p>
                            </div>
                        </el-card>
                    </el-col>

                    <!-- 数据统计卡片 -->
                    <el-col :span="16">
                        <el-card class="stat-card">
                            <el-row :gutter="10">
                                <el-col :span="12" v-for="(item, index) in dashboardData.types" :key="item.state">
                                    <div class="stat-item">
                                        <div class="dimg" :style="{ backgroundColor: rander[item.state] }">
                                            <img :src="rander[index]">
                                        </div>
                                        <div class="stat-info">
                                            <span class="stat-num">{{ item.num }}</span>
                                            <span class="stat-label">{{ item.state }}</span>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>

                <!-- 折线图区域 -->
                <el-card class="chart-card">
                    <v-chart :option="chartOption" class="chart" autoresize />
                </el-card>
            </el-main>
        </el-container>
    </el-container>
</template>


<script setup lang="ts">
import { indexData } from '@/api/index'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
const route = useRoute()
const dashboardData = ref<any>({
    user: {},
    types: [],
    typeList: []
})
const rander = ref<any>({
    '0': '/images/dzf.png',
    '1': '/images/dfw.png',
    '2': '/images/ywc.png',
    '3': '/images/yqx.png',
    '待支付': "#d95d53",
    '待服务': "#6d67b1",
    '已完成': "#5ab4e2",
    '已取消': "#5ebf5b",
})
onMounted(() => {
    indexData().then(({ data }) => {
        dashboardData.value = data.data
    })
})
// 声明并初始化 chartOption
const chartOption = ref<any>({
    xAxis: {
        type: 'category',
        data: dashboardData.value.typeList.map((item: any) => item.date)
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '订单数',
            data: dashboardData.value.typeList.map((item: any) => item.order_sum),
            type: 'line'
        }
    ]
})
watch(() => dashboardData.value.typeList,
    (newList) => {
        if (!newList || newList.length === 0) return
        chartOption.value = {
            xAxis: {
                type: 'category',
                data: newList.map((item: any) => item.date),
            },
            yAxis: { type: 'value' },
            series: [
                {
                    name: '订单数',
                    type: 'line',
                    smooth: true,
                    data: newList.map((item: any) => item.order_sum),
                    itemStyle: { color: '#5ac8aa' },
                    lineStyle: { color: '#5ac8aa' }
                }
            ],
            // tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
        }
    },
    { immediate: true, deep: true })
</script>

<style scoped lang="less">
/* 全屏容器 */
.full-container {
    width: calc(100vw - 269px);
    margin: 0;
    padding: 0;

    .main-container {
        display: flex;
        flex-direction: column;

        .main-content {
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;

            .user-card {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 26px;


                    .user-avatar {
                        width: 80px;
                        height: 80px;
                        border-radius: 4px;
                    }

                    .username {
                        font-size: 22px;
                        font-weight: 600;
                    }
                }

                .line {
                    border: 0.5px solid #e4e7ed;
                }

                .user-detail {
                    margin-top: 26px;

                    .user-detail p {
                        margin: 8px 0 0 0;
                        color: #666;
                    }
                }
            }

            .stat-card {
                display: flex;
                align-items: center;

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px;
                    margin-bottom: 20px;

                    .dimg {
                        height: 50px;
                        width: 50px;

                        img {
                            height: 45px;
                            width: 45px;
                            margin-left: 3px;
                            margin-top: 3px;
                        }
                    }

                    .stat-info {
                        display: flex;
                        flex-direction: column;

                        .stat-num {
                            font-size: 24px;
                            font-weight: 600;
                            line-height: 1.2;
                        }

                        .stat-label {
                            font-size: 14px;
                            color: #666;
                        }
                    }
                }
            }

            .chart-card {
                height: calc(100vh - 480px);
                margin-top: 20px;
                padding: 20px;
                display: flex;
                flex-direction: column;
            }

            .chart {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>