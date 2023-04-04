export const SIDE_BAR_MINI_WIDTH = 48
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80

export const enum ContentEnum {
  // auto width
  FULL = 'full',
  // fixed width
  FIXED = 'fixed',
}

// menu theme const enum
export const enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export const enum SettingButtonPositionEnum {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}

export const enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

/**
 * 权限模式
 */
export const enum PermissionModeEnum {
  // role
  // 角色权限
  ROLE = 'ROLE',
  // black
  // 后端
  BACK = 'BACK',
  // route mapping
  // 路由映射
  ROUTE_MAPPING = 'ROUTE_MAPPING',
}

// Route switching animation
// 路由切换动画
export const enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

export const AUTH_TOKEN = 'AUTH_TOKEN'
