<template>
    <panelHead :route="route" />
    <el-table :data="tableData.list">
        <el-table-column label="id" prop="id" />
        <el-table-column label="昵称" prop="name" />
        <el-table-column label="所属组别" prop="permissions_id">
            <template #default="scope">
                {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" />
        <el-table-column label="状态" prop="active">
            <template #default="scope">
                <el-tag :type="scope.row.active === 1 ? 'success' : 'danger'">
                    {{ scope.row.active === 1 ? '正常' : '禁用' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon style="margin-right: 5px;">
                        <Clock />
                    </el-icon>
                    {{ scope.row.create_time }}
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" size="small" />
    </div>
    <el-dialog v-model="dialogFormVisable" :before-close="beforeClose" title="添加权限" width="500px">
        <el-form :rules="rules" ref="formRef" label-position="left" label-width="100px" :model="form">
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入权限名称" />
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px;">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { authAdmin, menuSelect, updateUser } from '@/api'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
const route = useRoute()
const tableData: any = ref({
    list: [],
    total: 0
})

const formRef = ref<any>()

const paginationData = ref({
    pageNum: 1,
    pageSize: 10
})

interface PermissionOption {
    id: number;
    name: string;
}

const options = ref<PermissionOption[]>([]);

// 请求列表数据
const getListData = () => {
    authAdmin(paginationData.value).then(({ data }) => {
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

onMounted(() => {
    getListData()
    menuSelect().then(({ data }) => {
        options.value = data.data
    })
})

const permissionName = (id: number) => {
    const item = options.value.find((item) => item.id === id);
    return item ? item.name : '超级管理员';
};

function open(rowData: any) {
    dialogFormVisable.value = true
    Object.assign(form.value, { name: rowData.name, permissions_id: rowData.permissions_id, mobile: rowData.mobile })
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

//弹窗
const dialogFormVisable = ref(false)
const form = ref({
    name: '',
    permissions_id: '',
    mobile: '',
})

const rules = ref({
    name: [{ required: true, message: '请输入昵称' }],
    permissions_id: [{ required: true, message: '请选择菜单权限' }],
})

const beforeClose = () => {
    dialogFormVisable.value = false
}

//表单提交
const confirm = async (formEL: any) => {
    if (!formEL) return
    //手动触发检验
    await formEL.validate((valid: boolean) => {
        if (valid) {
            const { name, permissions_id, mobile } = form.value
            updateUser({ name, permissions_id, mobile }).then(({ data }) => {
                if (data.code === 10000) {
                    ElMessage.success('操作成功')
                    beforeClose()
                    getListData()
                } else {
                    ElMessage.error(data.msg || '操作失败')
                }
            })
        } else {
            ElMessage.error('请填写完整信息')
        }
    })
}

</script>

<style scoped lang="less">
.flex-box {
    display: flex;
    align-items: center;
}
</style>