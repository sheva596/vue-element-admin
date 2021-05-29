<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px">
    <el-table-column label="Plate_No" min-width="200">
      <template slot-scope="{ row }">
        {{ row.plateNumber }}
      </template>
    </el-table-column>
    <el-table-column label="Color" width="195" align="center">
      <template slot-scope="{ row }"> {{ row.color }} </template>
    </el-table-column>
    <el-table-column label="Cost" width="100" align="center">
      <template slot-scope="{ row }"> ¥{{ row.cost }} </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getParkingRecordList } from '@/api/dashboard'

export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       success: 'success',
  //       pending: 'danger'
  //     }
  //     return statusMap[status]
  //   },
  //   orderNoFilter(str) {
  //     return str.substring(0, 30)
  //   }
  // },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getParkingRecordList().then(response => {
        // console.log(response.data)
        this.list = response.data
      })
    }
  }
}
</script>
