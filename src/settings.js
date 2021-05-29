module.exports = {
  title: '停车管理系统',

  /**
   * @type {boolean} true | false
   * @description 右侧是否显示设置菜单
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description 是否显示菜单logo
   */
  showSidebarLogo: true,

  /**
   * @type {boolean} true | false
   * @description 是否需要导航栏
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否需要修正头部
   */
  fixedHeader: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
