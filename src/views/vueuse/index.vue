<script lang="ts">
import { defineComponent } from 'vue'
import { useMouse } from '@vueuse/core'

export default defineComponent({
  name: 'VueUse',
  setup() {
    const { x, y } = useMouse()

    return {
      x,
      y,
    }
  },
})
</script>

<template>
  <div>
    <h1>测试 vueUse 的鼠标坐标</h1>

    <h3>Mouse: {{ x }} x {{ y }}</h3>

    <div class="content">我是内容</div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  width: 100px;
  height: 30px;
  background-color: #6ec2c2;
  line-height: 30px;
  text-align: center;
}
</style>
