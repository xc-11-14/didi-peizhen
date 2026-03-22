import { defineStore } from 'pinia'
import { ref } from 'vue'

// 菜单元数据接口
interface MenuMeta {
  path: string
  name: string
  meta: MenuMeta
  icon?: string
  describe?: string
  id?: string
  children?: MenuMeta[]
  component?: any
}

export const useMenuStore = defineStore('menu', () => {
  // 从 localStorage 获取菜单状态（默认值）
  localStorage.getItem('menu') ? JSON.parse(localStorage.getItem('menu') || '{}') : {
    isCollapse: false,
    selectMenu: [],
    routerList: [],
  }
  // ========== 状态定义 ==========
  // 菜单是否折叠（默认不折叠）
  const isCollapse = ref<boolean>(false)
  // 选中的标签页（数组存储）
  const selectMenu = ref<MenuMeta[]>([])
  // 动态路由列表（数组存储）
  const routerList = ref<MenuMeta[]>([])

  // ========== 核心方法 ==========
  // 折叠/展开菜单
  function collapseMenu() {
    isCollapse.value = !isCollapse.value
  }

  // 添加标签页
  function addMenu(menu: MenuMeta) {
    //去重,如果不存在,则添加
    const isExist = selectMenu.value.findIndex(item => item.meta.path === menu.meta.path)
    if (isExist === -1) {
      selectMenu.value.push(menu)
    }
  }

  // 关闭指定标签页
  function closeMenu(path: string) {
    const index = selectMenu.value.findIndex(item => item.meta.path === path)
    if (index !== -1) {
      selectMenu.value.splice(index, 1)
    }
  }

  // 动态路由处理
  function dynamicMenu(payload: MenuMeta[]) {
    if (!Array.isArray(payload) || payload.length === 0) {
      routerList.value = []
      return []
    }

    // Vite 懒加载匹配 views 下所有 .vue 文件
    const modules = import.meta.glob('../views/**/**/*.vue')

    // 递归绑定组件
    function routerSet(router: MenuMeta[]) {
      router.forEach((item) => {
        // 无子路由时绑定组件
        if (!item.children || item.children.length === 0) {
          const componentPath = `../views${item.meta.path}/index.vue`
          // 组件路径不存在时，默认绑定 404 页面（避免路由报错）
          item.component = modules[componentPath]
        } else {
          // 有子路由则递归处理
          routerSet(item.children)
        }
      })
    }

    // 深拷贝避免修改源数据
    const routes = JSON.parse(JSON.stringify(payload)) as MenuMeta[]
    routerSet(routes)

    // 更新路由列表
    routerList.value = routes
    return routes
  }

  // ========== 返回外部可访问的状态/方法 ==========
  return {
    isCollapse,
    selectMenu,
    routerList,
    collapseMenu,
    addMenu,
    closeMenu,
    dynamicMenu,
  }
}, {
  persist: true,
})