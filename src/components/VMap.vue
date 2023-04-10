<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader'
import './initMap.js'

defineOptions({
  name: 'VMap',
})

const props = defineProps({
  // 地图样式
  mapStyle: {
    type: String,
    default: 'amap://styles/darkblue',
  },
  // 地图配置
  apiConfig: {
    type: Object,
    default: () => ({
      version: '2.0',
      key: 'd594dce215ba1945908095cf0043d0d9',
      plugins: ['AMap.DistrictSearch'],
    }),
  },
  // 区域名
  areaName: { type: String, default: '杭州市' },
  // 显示下级行政区级数,行政区级别包括：国家、省/直辖市、市、区/县4个级别
  subdistrict: { type: Number, default: 0 },
  // 是否返回行政区边界坐标点 all / base
  extensions: { type: String, default: 'all' },
  // 搜索范围[对应文档 https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.DistrictSearch]
  level: { type: String, default: 'city' },
  // 边界线配置
  polylineConfig: {
    type: Object,
    default: () => ({
      // 是否显示边界线
      show: true,
      // 是否显示边界以外的区域
      showOuter: false,
      // 边界线条颜色
      strokeColor: '#99ffff',
      // 边界线条粗细
      strokeWeight: 2,
    }),
  },
  // 地图是否支持双击鼠标放大
  doubleClickZoom: { type: Boolean, default: true },
  // 中心点坐标
  center: { type: Array, default: () => [119.357833, 29.848254] },
  // 初始地图缩放等级
  zoom: { type: Number, default: 9 },
  // 地图显示的缩放级别范围
  zooms: { type: Array, default: () => [8, 18] },
})

const mapInstance = ref(null)
// 新增一个渲染边界的方法
const renderPolyLine = (bounds = []) => {
  const { polylineConfig } = props

  if (polylineConfig.show) {
    for (let i = 0; i < bounds.length; i++) {
      new AMap.Polyline({
        path: bounds[i],
        strokeColor: polylineConfig.strokeColor,
        strokeWeight: polylineConfig.strokeWeight,
        map: mapInstance.value,
      })
    }
  }
}
// 初始化地图
const initMapInstance = (AMap: any) => {
  const options: {
    [key: string]: any
  } = {
    mapStyle: props.mapStyle,
    doubleClickZoom: props.doubleClickZoom,
    center: props.center,
    zoom: props.zoom,
    zooms: props.zooms,
  }
  // 初始化district对象
  const district = new AMap.DistrictSearch({
    level: props.level,
    extensions: props.extensions,
    subdistrict: props.subdistrict,
  })

  // 搜索区域
  district.search(props.areaName, function (status, result) {
    const bounds = result.districtList[0].boundaries

    // 获取区域各坐标
    const mask = []
    for (let i = 0; i < bounds.length; i += 1) {
      mask.push([bounds[i]])
    }

    // options中设置mask，超出mask的区域就不显示
    options.mask = mask

    mapInstance.value = new AMap.Map('map', options)

    // 渲染边界
    renderPolyLine(bounds)
  })
}

const loadAMap = () => {
  AMapLoader.load({
    key: 'd594dce215ba1945908095cf0043d0d9',
    version: '2.0',
    plugins: ['AMap.DistrictSearch'], // 你所使用到的插件
  }).then((AMap) => {
    initMapInstance(AMap)
  })
}
onMounted(() => {
  loadAMap()
})
</script>

<template>
  <div id="map" ref="mapInstance" />
</template>

<style scoped lang="scss">
#map {
  width: 100vw;
  height: 100vh;
}

.amap-container {
  background-image: unset;
}
</style>
