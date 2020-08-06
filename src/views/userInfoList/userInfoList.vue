<template>
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        label-width="68px"
        class="demo-form-inline"
      >
        <!-- 姓名 -->
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="queryForm.username" placeholder="姓名" class="wid_140"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="queryForm.phone" placeholder="手机号" class="wid_140"></el-input>
        </el-form-item>

        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
          <!-- <el-button type="primary" size="mini" @click="exportData('/userInfo/exportUser')">导出数据</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width=""></el-table-column>
        <el-table-column prop="phone" label="手机号" width=""></el-table-column>
        <el-table-column prop="digit_account" label="数字钱包" width=""></el-table-column>
        <el-table-column prop="bankcard" label="银行卡号" :show-overflow-tooltip="true" width=""></el-table-column>
        <el-table-column prop="" label="用户状态" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.user_status == 0">不可用</span>
            <span v-if="scope.row.user_status == 1">可用</span>
          </template>
        </el-table-column>

        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button v-if="scope.row.user_status == 1"   @click="handle_frozen(scope.row)" type="text" size="small">冻结</el-button>
            <el-button v-else   @click="handle_frozen(scope.row)" type="text" size="small">解冻</el-button>
            <!-- <el-button v-if="scope.row.pre_amount_status == 0"  @click="handle_returnM(scope.row)" type="text" size="small">返预付</el-button>
            <el-button @click="handle_detail(scope.row)" type="text" size="small">详情</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block mar_t10">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="pageTotal"
          background
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <!-- M3 买入详情-->
    <el-dialog
      title="买入详情"
      :visible.sync="detail_dialogVisible"
      width
      center
      :close-on-click-modal="false"
      v-loading="detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail"
      >
      <!-- 业务信息 -->
      <el-form
        :inline="true"
        :model="detail_form"
        ref="detail_form"
        class="demo-form-inline"
        label-width="68px"
        disabled
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="detail_form.username" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="detail_form.phone" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankcard">
          <el-input v-model="detail_form.bankcard" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="买入数量" prop="digit_num">
          <el-input v-model="detail_form.digit_num" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="single_price">
          <el-input v-model="detail_form.single_price" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="总金额" prop="total_amount">
          <el-input v-model="detail_form.total_amount" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="pay_status">
          <el-input v-model="detail_form.pay_status" placeholder class="wid_180"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
        <!-- <el-button type="warning" @click="check_resolve('0')" size="mini">审核拒绝</el-button>
        <el-button type="primary" @click="check_resolve('1')" size="mini">审核通过</el-button> -->
      </span>
    </el-dialog>



  </div>
</template>
<script>

import commonUrl from "../../utils/common";
import { getToken } from "../../utils/auth.js";
import {
  isvalidPhone,
  validNum100,
  filterSpace,
  validZNum,
  validNum20,
  validNum2,
  getFloat
} from "../../utils/validate";
import axios from "axios";
export default {
  name: "userInfoList",
  data() {
    let validMobile = (rule, value, callback) => {
      if (value == "" || value == undefined) {
        callback();
      } else {
        let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确手机号"));
        } else {
          callback();
        }
      }
    };

    return {


      roleId: "",

      // 主列表
      tableLoading: false,
      tableData: [],

      // 分页
      pageTotal: 1,
      currentPage: 1,
      detail_pageTotal: 0,
      detail_currentPage: 1,
      // 查询参数
      queryForm: {
        username: "",
        phone:'',
      },
      value1: "",

      // 用户详情
      detail_dialogVisible: false,
      detail_loading: false,
      detail_form: {
        username: "",
        phone: "",
        bankcard:'',
        digit_num:'',
        single_price:'',
        total_amount:'',
        pay_status:'',

      },

    };
  },
  created() {
    // 获取roleId
    this.roleId = this.$store.getters.roleId;
    // 根据roleId控制角色类的显示
    //console.log(this.roleId)

    // 初始化 主列表数据
    this.getTableDataList(1);
  },
  methods: {
    // 初始化 主列表数据
    getTableDataList(pageNum) {
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 创建时间
          username: this.queryForm.username,
          phone:this.queryForm.phone,
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/userInfo/userInfoList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res)
            this.tableLoading = false;
            this.tableData = res.data.data.userInfoList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }else{
            this.tableLoading = false;
            this.m_message(res.data.msg,'error');
          }
        })
        .catch(err => {});
    },
    // 冻结/解冻
    handle_frozen(row) {
      let content='',title='',flg;
      if(row.user_status == 1 ){
        title="冻结";
        content="是否冻结该用户?";
        flg='0'
      }else{
        title="解冻";
        content="是否解冻该用户?";
        flg='1'
      }
      this.$confirm(content, title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        const loading = this.$loading({
              lock: true,
              text: '加载中.....',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
        let param = {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            user_status:flg,
            userid:row.userid,
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/userInfo/updateUserStatus`, param)
          .then(res => {
            if (res.data.code == "0000") {
              loading.close();
              this.m_message(res.data.msg, "success");

              // 刷新
              this.handle_refresh();
            } else {
              loading.close();
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },
    // 返预付
    handle_returnM(row) {
      this.$confirm("是否返预付?", "返预付", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        let param = {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            pre_amount_status:'1',
            orderid:row.orderid,
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/orderInfo/updatePreAmountStatus`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },
    // 买入详情
    handle_detail(row) {
      this.detail_dialogVisible = true;
      // 清空详情信息
      this.resetData("detail_form");
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          orderid: row.orderid,
        }
      };
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/orderInfo/selectOrderInfo`, param)
        .then(res => {

          if (res.data.code == "0000") {

            let result = res.data.data.orderInfo;

            this.detail_form.username = result.username;
            this.detail_form.phone = result.phone;
            this.detail_form.bankcard = result.bankcard;

            this.detail_form.digit_num = result.digit_num;
            this.detail_form.single_price = result.single_price;
            this.detail_form.total_amount = result.total_amount;

            this.detail_form.pay_status = result.pay_status == 1?'已付款':'未付款';

            this.detail_loading = false;
          }else{
            this.detail_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
    },
    // 审核通过/审核不通过
    check_resolve(status){
      let param = {
        data:{
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          identityid:this.detail_form.identityid,
          idcard_check_status:status,
          phone:this.detail_form.phone
        }
      }
      if(status == '0'){
        param.data.cosHeadUrl = this.detail_form.denyData.cosHeadUrl;
        param.data.cosOpenmouthUrl = this.detail_form.denyData.cosOpenmouthUrl;
        param.data.cosShakeUrl =this.detail_form.denyData.cosShakeUrl;
        param.data.cosBlinkUrl = this.detail_form.denyData.cosBlinkUrl;
        param.data.cosIdcardFrontUrl =this.detail_form.denyData.cosIdcardFrontUrl;
      }
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/identityInfo/updateIdentityCheckStatus`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.m_message(res.data.msg, 'success')
            this.detail_loading = false;
            // 关闭并更新
            this.detail_dialogVisible = false;
            this.handle_refresh();
          }else{
            this.detail_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
    },

    // 导出数据
    exportData(url) {
      const token = getToken();
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios({
        method: "post",
        url: `${commonUrl.baseUrl}${url}`,
        // headers里面设置token
        headers: {
          Authorization: token
        },
        data: {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            // pageNum: pageNum,
            // pageSize: 10,
            // 创建时间
            startTime: this.queryForm.startTime,
            endTime: this.queryForm.endTime,
            // createtime: this.queryForm.createtime,
            // 会员状态
            memberType: this.queryForm.memberType,
            // 会员充值时间
            startMemberTime: this.queryForm.startMemberTime,
            endMemberTime: this.queryForm.endMemberTime,
            username: this.queryForm.username,
            up_username: this.queryForm.up_username,
            grand_username: this.queryForm.grand_username,
            agent_name: this.queryForm.agent_name
          }
        },
        // 二进制流文件，一定要设置成blob，默认是json
        responseType: "blob"
      })
        .then(res => {
          loading.close();
          // console.log(res.headers['content-disposition'])
          let fileName = res.headers["content-disposition"];

          const link = document.createElement("a");
          const blob = new Blob([res.data], { type: "text/csv" });

          link.style.display = "none";
          link.href = URL.createObjectURL(blob);

          link.setAttribute("download", `${fileName}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(err => {
          loading.close();
        });
    },
    // 查询按钮
    queryData() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 重置按钮
    resetData(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }

      // 创建时间
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";

      // 会员充值时间
      this.queryForm.startMemberTime = "";
      this.queryForm.endMemberTime = "";
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(this.currentPage);
      // this.currentPage = 1;
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
      //console.log(`当前页: ${val}`);
    },

    // 新增 校验规则
    m_valid_addForm(formName) {
      let flag = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          flag = true;
          return true;
        } else {
          flag = false;
          return false;
        }
      });
      return flag;
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    },

  }
};
</script>
