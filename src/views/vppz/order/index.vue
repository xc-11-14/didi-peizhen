<template>
    <panelHead :route="route" />
    <div class="form">
        <el-form :model="searchForm" :inline="true">
            <el-form-item prop="out_trade_no">
                <el-input v-model="searchForm.out_trade_no" placeholder="请输入订单号" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData.list">
        <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left" />
        <el-table-column prop="hospital_name" label="就诊医院" />
        <el-table-column prop="service_name" label="陪诊服务" />
        <el-table-column label="陪护师头像">
            <template #default="scope">
                <el-image :src="scope.row.companion.avatar" style="width: 40px; height: 40px;" />
            </template>
        </el-table-column>
        <el-table-column prop="companion.mobile" label="陪护师手机号" width="120" />
        <el-table-column prop="price" label="总价" />
        <el-table-column prop="paidPrice" label="已支付" />
        <el-table-column label="下单时间" width="120">
            <template #default="scope">
                {{ dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
        </el-table-column>
        <el-table-column label="订单状态">
            <template #default="scope">
                <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state || '未知状态' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="service_state" label="接单状态" />
        <el-table-column prop="tel" label="联系人手机号" width="120" />
        <el-table-column label="操作 " width="100" fixed="right">
            <template #default="scope">
                <el-popconfirm v-if="scope.row.trade_state === '待服务'" width="220" :icon="InfoFilled"
                    icon-color="#626AEF" title="是否确认完成?" @confirm="confirmEvent(scope.row.out_trade_no)">
                    <template #reference>
                        <el-button type="primary" link>服务完成</el-button>
                    </template>
                </el-popconfirm>
                <el-button type="primary" link disabled v-else>暂无服务</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
    </div>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
import { adminList, updateOrder } from '@/api/index'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute()
const tableData = ref<{
    list: Array<any>
    total: number
}>({
    list: [],
    total: 0
})

const paginationData = ref({
    pageNum: 1,
    pageSize: 10
})

//表单搜索
const searchForm = ref({
    out_trade_no: '',
})

//查询
const onSubmit = () => {
    getListData({ out_trade_no: searchForm.value.out_trade_no })
}

// 请求列表数据
const getListData = (pramas = {}) => {
    adminList({ ...paginationData.value, ...pramas }).then(({ data }) => {
        const { list, total } = data.data
        list.forEach((item: any) => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        })
        tableData.value = {
            list,
            total
        }
    })
}

//点击页码
const handleSizeChange = (val: number) => {
    paginationData.value.pageSize = val
    getListData()
}
const handleCurrentChange = (val: number) => {
    paginationData.value.pageNum = val
    getListData()
}

onMounted(async () => {
    const res = await adminList({
        pageNum: paginationData.value.pageNum,
        pageSize: paginationData.value.pageSize
    })
    tableData.value = res.data.data
})

//映射逻辑
const statusMap = (state: string | null | undefined): string => {
    const obj: Record<string, string> = {
        '已取消': 'info',
        '待服务': 'warning',
        '已完成': 'success',
    }
    // 兜底处理 undefined/null
    return obj[state ?? ''] ?? 'info'
}

const confirmEvent = (id: string) => {
    updateOrder({ id }).then(({ data }) => {
        if (data.code === 10000) {
            getListData()
        }
    })
}
</script>

<style scoped lang="less">
.form {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0px 10px 10px;
    background-color: #fff;
}
</style>
