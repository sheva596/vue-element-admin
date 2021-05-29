<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="用户名"
        style="width: 180px;"
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <!-- 用户表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="用户ID"
        prop="id"
        align="center"
        min-width="8%"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户名"
        min-width="15%"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="密码"
        min-width="15%"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="8%"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="row.status === 0">正常</span>
          <span v-else>封禁</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色"
        min-width="12%"
        align="center"
      >
        <template slot-scope="{row}">
          <span v-if="row.roleId === 2">超级管理员</span>
          <span v-if="row.roleId === 1">普通用户</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        min-width="18%"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        min-width="24%"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 280px; margin-left:50px;"
        size="medium"
      >
        <el-form-item
          label="用户名："
          prop="username"
        >
          <el-input
            v-model="temp.username"
            size="medium"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item
          label="密码："
          prop="password"
        >
          <el-input
            v-model="temp.password"
            size="medium"
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item label="角色：">
          <el-select
            v-model="temp.roleId"
            class="filter-item"
            placeholder="默认为普通用户"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="默认为正常状态"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.statusId"
              :label="item.statusName"
              :value="item.statusId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchUserList, updateUser, deleteUser, createUser } from '@/api/user'
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
      roleOptions: [
        {
          roleId: 1,
          roleName: '普通用户'
        },
        {
          roleId: 2,
          roleName: '超级用户'
        }
      ],
      statusOptions: [
        {
          statusId: 0,
          statusName: '正常'
        },
        {
          statusId: 1,
          statusName: '封禁'
        }
      ],
      temp: {
        id: undefined,
        username: '',
        password: '',
        roleId: 1,
        status: 0
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
        username: [{ required: true, message: '此为必填项', trigger: 'blur' }],
        password: [
          {
            required: true,
            message: '此为必填项',
            trigger: 'blur'
          }
        ],
        roleId: [{ required: true, message: '此为必选项', trigger: 'change' }],
        status: [{ required: true, message: '此为必选项', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false
      fetchUserList(this.listQuery).then(response => {
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
        username: '',
        password: '',
        roleId: 1,
        status: 0
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
          createUser(this.temp)
            .then(() => {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '用户添加成功',
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
          updateUser(tempData).then(() => {
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
    // 删除用户
    handleDelete(row, $index) {
      this.$confirm('确定要删除该用户吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteUser(row.id).then(() => {
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
