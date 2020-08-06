import {
  asyncRoutes,
  constantRoutes
} from '@/router'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

//处理 动态路由数据
function setServeMap(routerMap) {
  console.log(routerMap)
  //深克隆
  let cloneData = JSON.parse(JSON.stringify(routerMap))

  // 父级id ===  子级 pid
  return cloneData.filter(father => {

    let branchArr = cloneData.filter(child => father['id'] == child['pid']);
    branchArr.length > 0 ? father['children'] = branchArr : ''

    return father['pid'] == 0 // 目前一级 pid：0
  })

}
// 修正数据
function modifyKeys(data) {

  for (let i = 0; i < data.length; i++) {
    //父级
    let item = data[i];
    if (item.children) {
      // 父级 path

      // alwaysShow: true
      let _index = item.path.indexOf('/');
      if( _index > -1){
        var _icon_name = item.path.slice(_index+1);
      }
      item['component']  = 'Layout';  // 一级菜单强行加 Layout
      item['alwaysShow'] = true;
      // meta
      item['meta'] = {
        title: item.menu_name,
        icon: _icon_name
      }
      if (item.hasOwnProperty('children')) {
        //注意 children是数组
        for (let i = 0; i < item.children.length; i++) {

          // meta
          item['children'][i]['meta'] = {
            title: item.children[i].menu_name
          }
          // component  name
          item.children[i]['name']  = item.children[i].path;
          item.children[i]['component'] = item.children[i].path;
        }
      }
    }
  }

  return data;
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
const fya_routerMap = {
  Layout: () => import('@/layout/index'),

  // ##1账单列表(/billingList) #买入 卖出
  buyList: () => import('@/views/buyList/buyList'), // ##买入
  sellList: () => import('@/views/sellList/sellList'), // ##卖出

  // ##2用户管理(/user) #用户信息 #钱包验证
  userInfoList: () => import('@/views/userInfoList/userInfoList'), // ##用户信息
  walletVerity: () => import('@/views/walletVerity/walletVerity'), // ##钱包验证

  // ##3系统设置(/system) ##基础设置##设置管理
  baseSystem: () => import('@/views/baseSystem/baseSystem'), // ##基础设置
  systemManage: () => import('@/views/systemManage/systemManage'),//##设置管理

// ===============================================================================================

  // **1系统管理(system)   #角色管理 #平台账号管理
  sysRole: () => import('@/views/sysRole/sysRole'), // **角色管理
  sysUser: () => import('@/views/sysUser/sysUser'), // **平台账号管理

  refusedCause: () => import('@/views/refusedCause/refusedCause'), //审核原因
  messageInfo: () => import('@/views/messageInfo/messageInfo'),  //消息提示

  // **2机构管理(mechanism)  #添加/审核机构   #机构查询  #分润查询
  addOrCheckAgent: () => import('@/views/addOrCheckAgent/addOrCheckAgent'), //**添加/审核机构
  agentList: () => import('@/views/agentList/agentList'), //**机构查询
  payoffList: () => import('@/views/payoffList/payoffList'), //**分润查询
  openAccountProfit:() => import('@/views/openAccountProfit/openAccountProfit'), //**开户分成

  agentCheck: () => import('@/views/agentCheck/agentCheck'), //机构审核
  agentDetails: () => import('@/views/agentDetails/agentDetails'), //机构列表
  subordinateAgent: () => import('@/views/subordinateAgent/subordinateAgent'), // 机构下属查询
  travelerCheck: () => import('@/views/travelerCheck/travelerCheck'), // 角落向导审核

  // **3用户管理(customer)  #用户查询   #交易查询    #收益查询    #提现记录
  userList: () => import('@/views/userList/userList'), //**用户查询
  transactionList: () => import('@/views/transactionList/transactionList'), //**交易查询
  incomeList: () => import('@/views/incomeList/incomeList'), //**收益查询
  withdrawList: () => import('@/views/withdrawList/withdrawList'), //**提现记录
  transferaccounts: () => import('@/views/transferaccounts/transferaccounts'), //**转账记录
  identityCheckList: () => import('@/views/identityCheckList/identityCheckList'), //**认证审核
  // **4风控管理()  #用户风控   #资金风控    #资金冻结订单查询
  userWind: () => import('@/views/userWind/userWind'), //**用户风控
  fundsWind: () => import('@/views/fundsWind/fundsWind'), //**资金风控
  freezeOrderList: () => import('@/views/freezeOrderList/freezeOrderList'), //**资金冻结订单查询
  // **5财务管理()  #交易对账   #出款对账    #数据导出
  transactionCheck: () => import('@/views/transactionCheck/transactionCheck'), //**交易对账
  paymentCheck: () => import('@/views/paymentCheck/paymentCheck'), //**出款对账
  dataExport: () => import('@/views/dataExport/dataExport'), //**数据导出
  // 推送管理    push
  IMpush: () => import('@/views/IMpush/IMpush')  //信息推送
}

function generateAsyncRouter(routerMap, serverRouterMap) {
  serverRouterMap.forEach(function (item, index) {
    item.component = routerMap[item.component]
    if (item.children && item.children.length > 0) {
      generateAsyncRouter(routerMap, item.children)
    }
  })
  return serverRouterMap;
}
const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // }
  generateRoutes({
    commit
  }, list) {
    return new Promise(resolve => {

      const fya_list = setServeMap(list)
      const gp_list = modifyKeys(fya_list)
      console.dir(gp_list)
      // debugger

      // 测试 后台 传来的 路由表
      const asyncRouterMap = generateAsyncRouter(fya_routerMap, gp_list)
      asyncRouterMap.push({
        path: '*',
        redirect: '/404',
        hidden: true
      })
      commit('SET_ROUTES', asyncRouterMap)
      resolve(asyncRouterMap)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
