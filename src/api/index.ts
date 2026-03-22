import http from '@/utils/request'
//发送验证码
export const getCode = (data: {
    tel: string
}) => {
    return http.post('/get/code', data)
}

//注册用户
export const register = (data: {
    userName: string
    validCode: string
    passWord: string
}) => {
    return http.post('/user/authentication', data)
}

//登录
export const login = (data: {
    userName: string
    passWord: string
}
) => {
    return http.post('/login', data)
}

//权限管理
export const authAdmin = (params: {
    pageNum: number
    pageSize: number
}) => {
    return http.get('/auth/admin', { params })
}

//菜单权限数据
export const userGetMenu = () => {
    return http.get('/user/getmenu')
}

//菜单权限修改
export const userSetMenu = (data: {
    name: string
    permissions: string
    id: number
}) => {
    return http.post('/user/setmenu', data)
}

//菜单权限列表
export const menuList = (params: {
    pageNum: number
    pageSize: number
}) => {
    return http.get('/menu/list', { params })
}

//权限下拉列表
export const menuSelect = () => {
    return http.get('/menu/selectlist')
}

//用户数据修改
export const updateUser = (data: {
    name: string
    permissions_id: number | string
    mobile: string
}) => {
    return http.post('/update/user', data)
}

//用户菜单权限
export const menuPermissions = () => {
    return http.get('/menu/permissions')
}

//陪护师头像列表
export const photoList = () => {
    return http.get('/photo/list')
}

//陪护师创建
export const companion = (data: {
    id: number
    mobile: string
    active: number
    age: number
    avatar: string
    name: string
    sex: string
}) => {
    return http.post('/companion', data)
}

//陪护师列表
export const companionList = (params: {
    pageNum: number
    pageSize: number
}) => {
    return http.get('/companion/list', { params })
}

//陪护师删除
export const companionDelete = (data: {
    id: Array<string>
}) => {
    return http.post('/delete/companion', data)
}

//订单列表
export const adminList = (params: {
    pageNum: number
    pageSize: number
    out_trade_no?: string
}) => {
    return http.get('/admin/order', { params })
}

//服务状态完成
export const updateOrder = (data: {
    id: string
}) => {
    return http.post('/update/order', data)
}

//首页数据
export const indexData = () => {
    return http.get('/report')
}