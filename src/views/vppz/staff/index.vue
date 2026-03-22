<template>
    <panelHead :route="route" />
    <div class="btns">
        <el-button @click="open()" type="primary" size="small" icon="Plus">新建</el-button>
        <el-popconfirm width="220" :icon="InfoFilled" icon-color="#626AEF" title="是否确认删除?" @confirm="confirmEvent">
            <template #reference>
                <el-button :icon="Delete" type="danger" size="small">删除</el-button>
            </template>
        </el-popconfirm>
    </div>
    <el-table :data="tableData.list" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="id" prop="id" />
        <el-table-column label="昵称" prop="name" />
        <el-table-column label="头像">
            <template #default="scope">
                <el-image :src="scope.row.avatar" style="width: 50px; height: 50px;" />
            </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" />
        <el-table-column label="性别" prop="sex" />
        <el-table-column label="年龄" prop="age" />
        <el-table-column label="是否生效" prop="active" />
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
    <el-dialog v-model="dialogFormVisable" :before-close="beforeClose" title="陪护师添加" width="500px">
        <el-form :rules="rules" ref="formRef" label-position="left" label-width="100px" :model="form">
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id" />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisable = true">点击上传</el-button>
                <el-image v-else :src="form.avatar" style="width: 100px; height: 100px;" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option label="男" value="1" />
                    <el-option label="女" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" type="number" :min="18" :max="50" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="是否生效" prop="active">
                <el-radio-group v-model="form.active">
                    <el-radio :value="1">生效</el-radio>
                    <el-radio :value="0">失效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </template>
    </el-dialog>
    <el-dialog v-model="dialogImgVisable" :before-close="beforeCloseImg" title="选择图片" width=" 680px">
        <div class="image-list">
            <div v-for="(item, index) in fileList" :key="item.name" class="img-box" @click="selectIndex = index">
                <div v-if="selectIndex === index" class='select'>
                    <el-icon color='#fff'>
                        <Check />
                    </el-icon>
                </div>
                <el-image :src="item.url" style="width: 140px; height: 140px;" />
            </div>
        </div>
        <template #footer>
            <el-button @click="dialogImgVisable = false">取消</el-button>
            <el-button type="primary" @click="confirmImg">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { photoList, companion, companionList, companionDelete } from '@/api'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { InfoFilled, Delete, Check } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
    // 请求列表数据
    getListData()
    photoList().then(({ data }) => {
        fileList.value = data.data
    }).catch((err) => {
        console.log(err)
    })
})

const tableData: any = ref({
    list: [],
    total: 0
})

const paginationData = ref({
    pageNum: 1,
    pageSize: 10
})

// 请求列表数据
const getListData = () => {
    companionList(paginationData.value).then(({ data }) => {
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

const dialogFormVisable = ref(false)
const dialogImgVisable = ref(false)
const selectIndex = ref<any>(0)
const beforeClose = () => {
    dialogFormVisable.value = false
    formRef.value.resetFields()
}
const beforeCloseImg = () => {
    dialogImgVisable.value = false
}
const formRef = ref<any>()
const form = ref({
    id: 1,
    mobile: '',
    active: 1,
    age: 18,
    avatar: '',
    name: '',
    sex: '',
})

const rules = ref({
    name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    avatar: [{ required: true, message: '请选择头像', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
})
const fileList = ref<any>([])
const confirm = async (formEL: any) => {
    if (!formEL) return
    //手动触发检验
    await formEL.validate((valid: boolean, fields: any) => {
        if (valid) {
            companion(form.value).then(({ data }) => {
                if (data.code === 10000) {
                    ElMessage.success('添加成功')
                    dialogFormVisable.value = false
                    beforeClose()
                    getListData()
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    })
}

const open = (rowData = {}) => {
    dialogFormVisable.value = true
    nextTick(() => {
        //如果是编辑
        if (rowData) {
            Object.assign(form.value, rowData)
        }
    })
}

const confirmImg = () => {
    form.value.avatar = fileList.value[selectIndex.value].url
    dialogImgVisable.value = false
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
const selectTableData = ref<any>([])
const handleSelectionChange = (val: any) => {
    selectTableData.value = val
}
const confirmEvent = () => {
    if (selectTableData.value.length === 0) {
        ElMessage.error('请选择至少一个要删除的项')
        return
    }
    companionDelete({
        id: selectTableData.value
    }).then(({ data }) => {
        if (data.code === 10000) {
            ElMessage.success('删除成功')
            getListData()
        } else {
            ElMessage.error(data.message)
        }
    })
}
</script>

<style scoped lang="less">
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}

.image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .img-box {
        position: relative;

        .select {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 24px;
            height: 24px;
            background-color: #67c23a;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .el-image {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
</style>