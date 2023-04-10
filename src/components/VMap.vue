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
  areaName: { type: String, default: '浙江省' },
  // 显示下级行政区级数,行政区级别包括：国家、省/直辖市、市、区/县4个级别
  subdistrict: { type: Number, default: 0 },
  // 是否返回行政区边界坐标点 all / base
  extensions: { type: String, default: 'all' },
  // 搜索范围[对应文档 https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.DistrictSearch]
  level: { type: String, default: 'province' },
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
  // 是否绘制点位
  isDrawPoint: { type: Boolean, default: true },
  // 点位数据
  pointData: {
    type: Array,
    default: () => [
      {
        // 唯一值
        iden: '点位1',
        // 坐标
        lngLat: [120.212192, 30.162905],
        // marker点位基于坐标的偏移量
        offset: [-13, -30],
        // 自定义图标(Object可设置精灵图定位，String为图标地址)
        icon: {
          // 图标大小
          size: [25, 34],
          // 图标地址
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
          // 图标所用的图片大小
          imageSize: [135, 40],
          // 图标取图偏移量(背景图定位)
          imageOffset: [-9, -3],
        },
      },
      {
        // 唯一值
        iden: '点位2',
        // 坐标
        lngLat: [120.081729, 30.20564],
        // marker点位基于坐标的偏移量
        offset: [-13, -30],
        // 自定义图标(Object可设置精灵图定位，String为图标地址)
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
      },
      {
        // 唯一值
        iden: '点位3',
        // 坐标
        lngLat: [120.200556, 30.209451],
        // marker点位基于坐标的偏移量
        offset: [-13, -30],
        // 自定义图标(Object可设置精灵图定位，String为图标地址)
        icon: {
          // 图标大小
          size: [25, 34],
          // 图标地址
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
          // 图标所用的图片大小
          imageSize: [135, 40],
          // 图标取图偏移量(背景图定位)
          imageOffset: [-95, -3],
        },
      },
    ],
  },
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

    // 渲染点位
    renderPoint()
  })
}

// 渲染点位
const renderPoint = () => {
  const { isDrawPoint, pointData }: any = props

  if (isDrawPoint) {
    const makers = []

    for (let i = 0; i < pointData.length; i++) {
      // 定义图标
      let icon = pointData[i].icon
      if (typeof pointData[i].icon !== 'string') {
        icon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(...pointData[i].icon.size),
          // 图标的取图地址
          image: pointData[i].icon.image,
          // 图标所用图片大小
          imageSize: new AMap.Size(...pointData[i].icon.imageSize),
          // 图标取图偏移量
          imageOffset: new AMap.Pixel(...pointData[i].icon.imageOffset),
        })
      }
      // 定义maker
      const maker = new AMap.Marker({
        position: new AMap.LngLat(...pointData[i].lngLat),
        offset: new AMap.Pixel(...pointData[i].offset),
        // content: `<div class="map_content">我是内容</div>`,
        icon,
      })
      // 点位添加点击事件
      maker.on('click', function () {
        console.log(pointData[i])
      })
      // 添加maker
      makers.push(maker)
    }
    // 添加点位到地图
    mapInstance.value.add(makers)
  }
}

// 加载地图
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

::v-deep(.map_content) {
  width: 100px;
  height: 30px;
  background-color: rgba(110, 194, 194, 0.8);
  line-height: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

::v-deep(.amap-logo),
::v-deep(.amap-copyright) {
  opacity: 0;
}
</style>
