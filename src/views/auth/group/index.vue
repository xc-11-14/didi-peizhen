<template>
    <panelHead :route="route" />
    <div class="btns">
        <el-button @click="open(null)" type="primary" size="small" icon="Plus">新建</el-button>
    </div>
    <el-table :data="tableData.list">
        <el-table-column label="id" prop="id" />
        <el-table-column label="昵称" prop="name" />
        <el-table-column label="菜单权限" prop="permissionName" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div>
        <el-dialog v-model="dialogFormVisable" :before-close="beforeClose" title="添加权限" width="500px">
            <el-form :rules="rules" ref="formRef" label-position="left" label-width="100px" :model="form">
                <el-form-item label="名称" prop="id" v-show="false">
                    <el-input v-model="form.id" />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入权限名称" />
                </el-form-item>
                <el-form-item label="权限" prop="permissions">
                    <el-tree ref="treeRef" style="max-width: 600px;" :data="permissionData" show-checkbox node-key="id"
                        :default-checked-keys="[4, 5]" :default-expanded-keys="[2]" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { userGetMenu, userSetMenu, menuList } from '@/api'
import { ElMessage, ElTree } from 'element-plus'
import { useRoute } from 'vue-router'
const route = useRoute()
// 控制弹窗是否显示
const dialogFormVisable = ref(false)
// 表单数据（初始化空值）
const form = ref({
    id: 1,
    name: '',
    permissions: ''
})

// 权限树形结构菜单数据
const permissionData = ref([])
// 表格数据
const tableData = ref({
    list: [],
    total: 0
})
// 分页数据
const paginationData = ref({
    pageNum: 1,
    pageSize: 10
})
// 树形组件ref（指定类型）
const treeRef = ref()
// 表单ref
const formRef = ref()
// 表单校验规则
const rules = ref({
    name: [
        { required: true, message: '请输入权限名称', trigger: 'blur' }
    ],
})

// 获取菜单权限数据
onMounted(() => {
    userGetMenu().then(({ data }) => {
        // 后端返回的菜单数据兜底为数组
        const menus = Array.isArray(data.data) ? data.data : []
        permissionData.value = menus
        // 请求列表数据
        getListData()
    })
})

// 请求列表数据
const getListData = () => {
    menuList(paginationData.value).then(({ data }) => {
        const { list , total } = data.data 
        tableData.value.list = list
        tableData.value.total = total
    })
}

// 打开弹窗
const open = (rowData: any = {}) => {
    dialogFormVisable.value = true
    nextTick(() => {
        if (rowData) {
            Object.assign(form.value, {id: rowData.id,name: rowData.name})
            treeRef.value.setCheckedKeys(rowData.permission) 
        }
    })
}

// 弹窗关闭前的回调函数
const beforeClose = () => {
    dialogFormVisable.value = false
}

// 表单提交
const confirm = async (formEL: any) => {
    if (!formEL) return
    //手动触发检验
    await formEL.validate((valid: boolean, fields: any) => {
        if (valid) {
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
            userSetMenu({
                name: form.value.name,
                permissions: permissions,
                id: form.value.id
            }).then(({ data }) => {
                ElMessage.success('操作成功')
                dialogFormVisable.value = false
                getListData()
            })
        } else {
            ElMessage.error('请填写完整信息')
        }
    })
}
</script>

<style scoped lang="less">
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>