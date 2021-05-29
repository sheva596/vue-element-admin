<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="车牌号"
        style="width: 180px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>

    <!-- 车辆表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="车辆ID" prop="id" align="center" min-width="8%">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" min-width="15%" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.plateNumber === 'null'"> 未识别 </span>
          <span v-else>{{ row.plateNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="12%" align="center">
        <template slot-scope="{ row }">
          <span> {{ row.color }} </span>
        </template>
      </el-table-column>
      <el-table-column label="驶入时间" min-width="18%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="离开时间" min-width="18%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.leftTime | parseTime(row.leftTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="花费" min-width="12%" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        min-width="24%"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页面 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 280px; margin-left: 50px"
        size="medium"
      >
        <el-image v-if="dialogStatus === 'update'" fit="contain" :src="imgUrl">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <el-form-item label="车牌号：" prop="plateNumber">
          <el-input
            v-model="temp.plateNumber"
            size="medium"
            placeholder="请输入车牌号"
          />
        </el-form-item>
        <el-form-item label="类型：" prop="plateNumber">
          <el-input
            v-model="temp.color"
            size="medium"
            placeholder="请输入车牌类型"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchRecordList,
  deleteRecord,
  createRecord,
  updateRecord
} from '@/api/car'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        plateNumber: '',
        color: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        plateNumber: [
          { required: true, message: '此为必填项', trigger: 'blur' }
        ],
        color: [{ required: true, message: '此为必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false
      fetchRecordList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createRecord(this.temp)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '临时停车记录添加成功',
                type: 'success',
                duration: 2000
              })
            })
            .catch(err => {
              console.error(err)
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      let fileUrl = this.temp.fileUrl
      let index = fileUrl.lastIndexOf('/')
      var fileName = fileUrl.substring(index + 1, fileUrl.length)
      this.imgUrl = 'http://localhost:8080/upload_images/' + fileName
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRecord(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除记录
    handleDelete(row, $index) {
      this.$confirm('确定要删除该记录吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteRecord(row.id).then(() => {
            this.list.splice($index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
