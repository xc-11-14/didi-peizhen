<template>
  <el-row class='login-container'>
    <div class="box">
      <el-card>
        <template #header>
          <div class='card-header'>
            <img :src="imgURL">
          </div>
        </template>
        <div class="jump-link">
          <el-link type="primary" @click="handleChange">{{ formType === 1 ? '返回登录' : '注册账号' }}</el-link>
        </div>
        <el-form @keyup.enter="handleSubmit(loginFormRef)" :model="loginForm" label-width="0px" :rules="rules"
          ref="loginFormRef">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" placeholder="请输入手机号" :prefix-icon="UserFilled"></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input v-model="loginForm.passWord" type="password" placeholder="请输入密码" :prefix-icon="Lock"></el-input>
          </el-form-item>
          <el-form-item v-show="formType === 1" prop="validCode">
            <el-input v-model="loginForm.validCode" placeholder="请输入验证码" :prefix-icon="Lock">
              <template #append>
                <span @click="countDownChange"
                  :style="{ cursor: flag ? 'not-allowed' : 'pointer', color: flag ? '#409eff' : '#909399' }">
                  {{ countdown.validTest }}
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit(loginFormRef)"
              :style="{ width: '100%', height: '40px', backgroundColor: registerLoading || loginLoading ? '#8dbeee' : '#409eff', disabled: registerLoading || loginLoading ? true : false }">
              {{ formType === 0 ? (loginLoading ? '登录中' : '登录') : (registerLoading ? '注册中' : '注册') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getCode, register, login, menuPermissions } from '../../api'
import { useMenuStore } from '../../store/menu.ts'

const menuStore = useMenuStore()
const imgURL = new URL('../../../public/images/login-head.png', import.meta.url).href
//表单数据
const loginForm = ref<{
  userName: string
  passWord: string
  validCode: string
}>({
  userName: '',
  passWord: '',
  validCode: ''
})
// 登录/注册切换状态
const formType = ref<number>(0)
// 点击切换登录/注册
function handleChange() {
  formType.value = formType.value ? 0 : 1
}
//表单检验
const rules = ref({
  userName: [{ validator: validUser, trigger: 'blur' }],
  passWord: [{ validator: validPass, trigger: 'blur' }],
})
//账号校验规则
function validUser(rule: any, value: string, callback: any) {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else {
    const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  }
}
//密码校验规则
function validPass(rule: any, value: string, callback: any) {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const reg = /^[a-zA-Z0-9.]{6,16}$/
    if (!reg.test(value)) {
      callback(new Error('密码格式不对,请输入6-16位数字、字母或点号'))
    } else {
      callback()
    }
  }
}

//发送短信
const countdown = ref<{
  validTest: string
  time: number
}>({
  validTest: '获取验证码',
  time: 60
})

let flag: boolean = false
function countDownChange() {
  //如果已发送验证码，不能再次发送
  if (flag) {
    return
  }
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  //判断手机号是否正确
  if (!phoneReg.test(loginForm.value.userName) || !loginForm.value.userName) {
    ElMessage({
      message: '请输入正确的手机号',
      type: 'warning'
    })
    return
  }
  //倒计时
  const timer = setInterval(() => {
    if (countdown.value.time <= 0) {
      countdown.value.time = 60
      countdown.value.validTest = '获取验证码'
      flag = false
      clearInterval(timer)
    } else {
      countdown.value.time--
      countdown.value.validTest = `${countdown.value.time}秒后重新获取`
    }
  }, 1000)
  flag = true
  //发送验证码
  getCode({
    tel: loginForm.value.userName
  }).then((response) => {
    // 从 response.data 里取业务数据
    const data = response.data
    if (data.code === 10000) {
      ElMessage({
        message: '验证码发送成功',
        type: 'success'
      })
    }
  }).catch(() => {
    // 失败后重置倒计时
    flag = false
    countdown.value.time = 60
    countdown.value.validTest = '获取验证码'
    clearInterval(timer)
  })
}
const router = useRouter()
const loginFormRef = ref<any>()
const loginLoading = ref<boolean>(false)
const registerLoading = ref<boolean>(false)
//表单提交
const handleSubmit = async (formEl: any) => {
  if (!formEl) return
  // 手动触发表单校验
  try {
    // 校验表单,validate()是组件库自带的校验方法，在input下面提示校验错误信息
    await formEl.validate()

    if (formType.value === 1) {
      // 注册逻辑
      registerLoading.value = true
      const response = await register({
        userName: loginForm.value.userName,
        validCode: loginForm.value.validCode,
        passWord: loginForm.value.passWord
      })
      if (response.data.code === 10000) {
        ElMessage.success('注册成功，请登录')
        // 注册成功后切换到登录页面
        formType.value = 0
        // 注册成功后清空表单
        loginForm.value = { userName: '', passWord: '', validCode: '' }
      } else {
        return registerLoading.value = false
      }
    } else {
      // 登录逻辑
      try {
        //将注册成功的手机号和密码赋值给登录表单
        loginForm.value.userName = loginForm.value.userName
        loginForm.value.passWord = loginForm.value.passWord
        //按钮显示加载状态
        loginLoading.value = true
        // 登录请求
        const { data: loginRes } = await login({
          userName: loginForm.value.userName,
          passWord: loginForm.value.passWord
        })

        if (loginRes.code === -1) {
          return loginLoading.value = false
        }

        // 存储用户信息
        localStorage.setItem('pz_token', loginRes.data.token)
        localStorage.setItem('pz_userInfo', JSON.stringify(loginRes.data.userInfo))
        menuPermissions().then(({ data }) => {
          // 处理动态路由（绑定组件）
          menuStore.dynamicMenu(data.data).forEach((item: any) => {
            router.addRoute('main', item)
          })
          ElMessage.success('登录成功')
          router.push({ path: '/' })
        })
      } catch (error) {
        console.error('登录异常：', error)
      }
    }
  } catch (error) {
    // 表单校验失败的提示
    ElMessage.error('手机号或密码有误，请检查后重试')
  }
}
</script>

<style scoped lang="less">
.login-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 150px;
  background: url('@/assets/bg.png');
  z-index: 0;
}

:deep(.el-card__header) {
  padding: 0
}

.login-container {
  height: 100%;

  .box {
    position: relative;
    overflow: hidden;
    padding: 6px;
    width: 400px;

    .card-header {
      background: conic-gradient(#73d7d5, #076cc4);

      img {
        width: 430px;
      }
    }

    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }
}

.box::before {
  content: '';
  position: absolute;
  left: -50%;
  top: -50%;
  width: 800px;
  height: 800px;
  background-image: conic-gradient(transparent, transparent, #73d7d5, #076cc4);
  animation: Rotate 2s linear infinite;
  z-index: -1;
}

@keyframes Rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>