<template>
  <div class="components-container">
    <div class="editor-container">
      <dropzone
        id="myVueDropzone"
        url="http://localhost:8080/file/receive"
        @dropzone-removedFile="dropzoneR"
        @dropzone-success="dropzoneS"
      />
    </div>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'

export default {
  name: 'DropzoneDemo',
  components: { Dropzone },
  methods: {
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: '上传成功', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: '删除成功', type: 'success' })
    }
  }
}
</script>

