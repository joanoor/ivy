<template>
  <div
    w-full
    h-full
    relative
    v-loading="data.loading"
    element-loading-text="地图数据载入中"
  >
    <div id="map-container" w-full h-full></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'
import { AliMapInfoStruct } from '@/types/alimap'
import { isString } from '@vue/shared'

interface MapData {
  infoWindow?: AMap.InfoWindow
  loading: boolean
}

const emit = defineEmits(['loaded', 'markerclick', 'markerdragging'])
const props = withDefaults(
  defineProps<{
    markers?: AliMapInfoStruct[]
    mode?: 'default' | 'custom'
    currentMarker2?: AliMapInfoStruct
  }>(),
  {
    markers: () => [],
    mode: 'default',
  }
)

const map = shallowRef<AMap.Map | null>(null) // 地图实例
const geocoder = shallowRef<any>(null)
const autoComplete = shallowRef<any>(null)
// @ts-ignore
const data: MapData = reactive({
  loading: false,
  // startPoint: [117.25, 31.83],
})

const currentMarker = ref<AliMapInfoStruct>({
  stationLatitude: 0,
  stationLongitude: 0,
  stationName: '',
  stationAddress: '',
})

onMounted(() => {
  if (!map.value) initMap()
})

/**
 * 初始化地图
 */
const initMap = () => {
  data.loading = true
  AMapLoader.load({
    key: '8111ec18f9d03ea87e8a3788a0fd839d',
    version: '2.0',
    plugins: ['AMap.AutoComplete', 'AMap.Geocoder'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then(AMap => {
      console.log('初始化地图')
      // 创建地图实例
      map.value = new AMap.Map('map-container', {
        resizeEnable: true,
        zoom: 13, // 级别
        viewMode: '2D', // 是否使用3D视图
        // center: data.startPoint,
      })
      console.log('初始化结束')
      map.value?.on('complete', () => {
        emit('loaded', map.value)
      })
    })
    .catch(e => {
      console.error(e)
    })
    .finally(() => {
      data.loading = false
    })
}

const addGeoCoder = () => {
  // 地址解析
  // @ts-ignore
  geocoder.value = new AMap.Geocoder()
}

const addAutoComplete = () => {
  addGeoCoder()
  // 地址自动补全
  // @ts-ignore
  autoComplete.value = new AMap.AutoComplete({
    input: 'tipinput',
  })
  // 监听补全选择的操作
  autoComplete.value?.on('select', handleSelectAutoComplete)
}

// let lastMarker: AMap.Marker = null
/**
 * 在地图上创建marker
 */
const addMarkers = () => {
  props.markers.forEach(m => {
    const lnglat: AMap.Vector2 = [+m.stationLongitude, +m.stationLatitude]
    const markerContent =
      '' +
      '<div class="custom-content-marker">' +
      `   <img width="25" height="35" src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">` +
      `   <div class="content">${m.totalEquipmentNumber ?? ''}</div>` +
      '</div>'
    const marker = new AMap.Marker({
      // @ts-ignore
      map: map.value,
      content: markerContent,
      // icon: new AMap.Icon({
      //   image:
      //     'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
      //   size: new AMap.Size(25, 35),
      //   imageSize: new AMap.Size(25, 35),
      // }),
      position: new AMap.LngLat(lnglat[0], lnglat[1]),
      offset: new AMap.Pixel(-13, -30),
    })

    // const markerContentActive =
    //   '' +
    //   '<div class="custom-content-marker">' +
    //   '   <img width="25" height="35" src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-blue.png">' +
    //   `   <div class="content">${m.totalEquipmentNumber ?? ''}</div>` +
    //   '</div>'
    marker.on('click', () => {
      // console.log('触发了点击事件')
      // lastMarker.setContent()
      // marker.setContent(markerContentActive)
      clickMarker(m)
    })
  })
}

/**
 * 在地图上创建可拖动的marker
 * @param lnglat
 */
const addDraggleMarker = (lnglat?: [number, number]) => {
  if (!lnglat) {
    decodeLngLat([
      map.value?.getCenter().lng,
      map.value?.getCenter().lat,
    ] as any)
  } else {
    decodeLngLat(lnglat)
  }
  const marker = new AMap.Marker({
    // @ts-ignore
    map: map.value,
    position: lnglat || map.value?.getCenter(),
    icon: new AMap.Icon({
      image:
        'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
      size: new AMap.Size(25, 35),
      imageSize: new AMap.Size(25, 35),
    }),
    offset: new AMap.Pixel(-13, -30),
    // 设置是否可以拖拽
    draggable: true,
    cursor: 'move',
    // 设置拖拽效果
    // raiseOnDrag: true,
  })
  marker.on('dragging', handleDragging)
}

/**
 * 监听autoComplete的select操作，创建坐标
 * @param e
 */
const handleSelectAutoComplete = e => {
  clearThingsOnMap()
  addDraggleMarker([e.poi.location.lng, e.poi.location.lat])
  moveMapTo([e.poi.location.lng, e.poi.location.lat])
  decodeLngLat([e.poi.location.lng, e.poi.location.lat])
}

// 监听拖动marker的操作
const handleDragging = e => {
  decodeLngLat([e.lnglat.lng, e.lnglat.lat])
  emit('markerdragging', currentMarker)
}

// 获取坐标点的信息
const getPointerInfo = () => currentMarker.value

// 将地图中心移动到指定经纬度
const moveMapTo = (lnglat: [number, number] | string) => {
  if (isString(lnglat)) {
  } else {
    map.value?.setCenter(lnglat)
  }
}

const setMapZoom = (zoom = 13) => {
  map.value?.setZoom(zoom)
}

const setMapFitView = () => {
  map.value?.setFitView()
}

// 关闭高德地图的infoWindow
const closeInfoWindow = () => {
  data.infoWindow?.close()
}

const destroyMap = () => {
  console.log('准备销毁地图')
  clearThingsOnMap()
  map.value && map.value.destroy()
}

/*************************以下是内部方法******************************/

/**
 * 通过点的经纬度获取当前点的信息，包括adcode、address、lng、lat
 */
const decodeLngLat = (lnglat: [number, number]) => {
  geocoder.value?.getAddress(lnglat, function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
      currentMarker.value.stationAreaNo =
        result.regeocode.addressComponent.adcode
      currentMarker.value.stationAddress = result.regeocode.formattedAddress
      currentMarker.value.stationLongitude = lnglat[0]
      currentMarker.value.stationLatitude = lnglat[1]
    } else {
      console.error('根据经纬度查询地址失败')
    }
  })
}

const decodePos = (location: string) => {
  return new Promise<[number, number]>((resolve, reject) => {
    geocoder.value.getLocation(location, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        // result中对应详细地理坐标信息
        const lnglat = result.geocodes[0].location
        resolve(lnglat)
      }
    })
  })
}

// 点击地图上的marker
const clickMarker = (marker: AliMapInfoStruct) => {
  if (map.value) emit('markerclick', marker)
}

// 打开提示信息框
const openInfoWindow = (marker: AliMapInfoStruct) => {
  if (map.value) {
    const lnglat: AMap.Vector2 = [
      +marker.stationLongitude,
      +marker.stationLatitude,
    ]

    //构建信息窗体中显示的内容
    const info: string[] = []
    info.push(
      `<div style="padding:0px 0px 0px 4px;"><b>${marker.stationName}</b>`
    )
    data.infoWindow = new AMap.InfoWindow({
      content: info.join('<br/>'), //使用默认信息窗体框样式，显示信息内容
      offset: new AMap.Pixel(0, -30),
    })
    if (map.value) {
      data.infoWindow.open(map.value, lnglat)
    }
  }
}

const clearThingsOnMap = () => {
  map.value?.clearMap()
  map.value?.clearInfoWindow()
}

onBeforeRouteLeave(() => {
  destroyMap()
})

defineExpose({
  addAutoComplete,
  currentMarker, // 当前点
  addMarkers, // 添加点
  clickMarker, // 点击点
  addDraggleMarker, // 可拖拽点
  getPointerInfo,
  clearThingsOnMap,
  moveMapTo,
  setMapZoom,
  setMapFitView,
  closeInfoWindow,
  openInfoWindow,
  decodePos,
  decodeLngLat,
  addGeoCoder,
})
</script>

<style lang="scss">
.amap-info-close {
  display: none;
}

.custom-content-marker {
  position: relative;
  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: -4px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
}

.amap-sug-result {
  z-index: 9999 !important;
  display: none;
}
</style>
