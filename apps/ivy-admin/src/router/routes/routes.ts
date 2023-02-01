import { AppRouteRecordRaw } from '../types'

export const baseRoutes: AppRouteRecordRaw[] = [
  {
    name: 'assessment',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '首页',
      icon: 'example',
    },
  },
  {
    name: 'deleteRecord',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'assessmentView',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'assessmentRecord',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'createAssessment',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'standardManage',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'lawsRepository',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'modelConfig',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'riskGradeLibrary',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'assessmentModel',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'assessmentFactorConfig',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
  {
    name: 'dataAnalysis',
    component: () => import('@/views/error/index.vue'),
    meta: {
      title: '导航页',
      icon: 'example',
    },
  },
]
