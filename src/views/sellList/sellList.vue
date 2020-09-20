<template>
<!-- 卖出管理 -->
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
        <!-- 创建时间 -->
        <el-form-item label="创建时间" prop="createtime">
          <el-date-picker
            v-model="queryForm.startTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            :picker-options="pickerOptions_register1"
          ></el-date-picker>
          <el-date-picker
            v-model="queryForm.endTime"
            type="date"
            class="wid_140"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            :picker-options="pickerOptions_register2"
          ></el-date-picker>
        </el-form-item>
        <!-- 卖出数量 -->
        <el-form-item label="卖出数量" >
          <el-col :span="24">
            <el-form-item prop="startNum">
              <el-input v-model.number="queryForm.startNum" placeholder="最小数量" class style="width:70px"></el-input>-
            </el-form-item>
            <el-form-item prop="endNum">
              <el-input v-model.number="queryForm.endNum" placeholder="最大数量" class style="width:70px"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 订单状态 -->
        <el-form-item label="订单状态" prop="pay_status" >
            <el-select v-model="queryForm.pay_status" placeholder="请选择订单状态" class="wid_140">
              <el-option
                v-for="(item, index) of queryForm.pay_statuss"
                :key="index"
                :label="item.value"
                :value="item.id"
                >
              </el-option>
            </el-select>
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
      <el-table :row-class-name="tableRowClassName" :data="tableData" v-loading="tableLoading" border  style="width: 100%">
        <el-table-column prop="username" label="姓名" width="80"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="110"></el-table-column>
        <el-table-column prop="account_no" label="银行卡号" width="180"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" :show-overflow-tooltip="true" width="110"></el-table-column>
        <el-table-column prop="digit_num" label="卖出数量" :show-overflow-tooltip="true" width="80"></el-table-column>
        <!-- 原始单价 -->
        <el-table-column prop="" label="单价(元)" :show-overflow-tooltip="true" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.single_price/100  }}</span>
          </template>
        </el-table-column>
        <!-- 实际交易单价(元) -->
        <el-table-column prop="" label="实际成交单价(元)" :show-overflow-tooltip="true" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.deal_single_price/100  }}</span>
          </template>
        </el-table-column>
        <!-- 原始总金额 -->
         <el-table-column prop="" label="原始总金额(元)" :show-overflow-tooltip="true" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.deal_pre_total_price / 100  }}</span>
          </template>
        </el-table-column>
        <!-- 现在总金额 -->
        <el-table-column prop="" label="总金额(元)" :show-overflow-tooltip="true" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.total_amount / 100  }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="交易方式" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.pass_type == 1">穿透</span>
            <span v-else>库存</span>
          </template>
        </el-table-column>
         <el-table-column prop="" label="状态" width="300">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_status == 1">已付款</span>
            <span v-if="scope.row.amount_status == 0">未放款</span>
            <span v-if="scope.row.amount_status == 1">已放款</span>
            <span v-if="scope.row.pre_amount_status == 0">未返</span>
            <span v-if="scope.row.pre_amount_status == 1">已返</span>
            <span v-if="scope.row.deal_status == 1">未终止</span>
            <span v-else>已终止</span>
            <span v-if="scope.row.order_status == 0">不可用</span>
            <span v-if="scope.row.order_status == 1">可用</span>
            <span v-if="scope.row.order_status == 2">交易失败</span>
            <span v-if="scope.row.order_status == 3">交易超时</span>

          </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="订单状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_status == 1">已付款</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="放款状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.amount_status == 0">未放款</span>
            <span v-if="scope.row.amount_status == 1">已放款</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="预付状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.pre_amount_status == 0">未返</span>
            <span v-if="scope.row.pre_amount_status == 1">已返</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="终止状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.deal_status == 1">未终止</span>
            <span v-else>已终止</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="订单状态" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.order_status == 0">不可用</span>
            <span v-if="scope.row.order_status == 1">可用</span>
            <span v-if="scope.row.order_status == 2">交易失败</span>
            <span v-if="scope.row.order_status == 3">交易超时</span>
          </template>
        </el-table-column> -->
        <el-table-column prop label="操作" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button v-if="scope.row.order_status == 2" @click="handle_viewFail(scope.row)" type="text" size="small">查看失败</el-button>
            <el-button v-else @click="handle_fail(scope.row)" type="text" size="small">交易失败</el-button>

            <el-button v-if="scope.row.amount_status == 0 && scope.row.order_status != 2"  @click="handle_store(scope.row)" type="text" size="small">放款</el-button>

            <el-button v-if="scope.row.pre_amount_status == 0 && scope.row.order_status != 2"  @click="handle_returnM(scope.row)" type="text" size="small">实际成交价</el-button>
            <el-button v-if="scope.row.pre_amount_status != 0 && scope.row.order_status != 2" @click="handle_viewRM(scope.row)" type="text" size="small">查看实际成交价</el-button>

            <el-button v-show="scope.row.amount_status != 1 || scope.row.pre_amount_status !=1" v-if="scope.row.deal_status == 1 && scope.row.order_status != 2" @click="handle_break(scope.row)" type="text" size="small">终止</el-button>
            <el-button v-show="scope.row.amount_status != 1 || scope.row.pre_amount_status !=1" v-if="scope.row.deal_status != 1 && scope.row.order_status != 2" @click="handle_viewBR(scope.row)" type="text" size="small">终止原因</el-button>

            <el-button @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
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

     <!-- M4 查看/修改终止交易 -->
    <el-dialog
      title="终止交易"
      :visible.sync="break_dialogVisible"
      width="30%"
      center
      :close-on-click-modal="false"
      v-loading="break_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class=""
      >
      <el-form
        :inline="true"
        :model="break_form"
        ref="break_form"
        :rules="break_form_rules"
        class="demo-form-inline"
        label-width="80px"
        >
        <el-form-item label="终止原因" prop="terminate_reason" >
            <el-input type="textarea" :disabled="!break_form.showBreakR" v-model="break_form.terminate_reason" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="break_dialogVisible = false" size="mini">关 闭</el-button>
          <el-button type="primary" v-if="break_form.showBreakR" @click="break_resolve" size="mini">确 定</el-button>
        </span>
    </el-dialog>

    <!-- M6 查看/设置交易失败 -->
    <el-dialog
      title="交易失败"
      :visible.sync="fail_dialogVisible"
      width="30%"
      center
      :close-on-click-modal="false"
      v-loading="fail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class=""
      >
      <el-form
        :inline="true"
        :model="fail_form"
        ref="fail_form"
        :rules="fail_form_rules"
        class="demo-form-inline"
        label-width="80px"
        >
        <el-form-item label="失败原因" prop="failed_reason" >
            <el-input type="textarea" :disabled="!fail_form.showFailR" v-model="fail_form.failed_reason" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="fail_dialogVisible = false" size="mini">关 闭</el-button>
          <el-button type="primary" v-if="fail_form.showFailR" @click="fail_resolve" size="mini">确 定</el-button>
        </span>
    </el-dialog>


    <!-- M5 修改/查看 实际成交价 -->
    <el-dialog
      title="卖出实际成交价"
      :visible.sync="return_dialogVisible"
      width="30%"
      center
      :close-on-click-modal="false"
      v-loading="return_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="return_label"
      >
      <el-form
        :inline="true"
        :model="return_form"
        ref="return_form"
        :rules="return_form_rules"
        class="demo-form-inline"
        label-width="120px"
        >
        <p><span>提交订单时的卖出价格：</span><span>{{return_form.single_price / 100}}</span>元</p>
        <el-form-item label="实际成交价" prop="deal_single_price" >
          <el-input :disabled="!return_form.showReturnR" v-model="return_form.deal_single_price" placeholder="实际交易单价" class="wid_140"></el-input>
          <span> 元</span>
        </el-form-item>
        <p class="tipError" v-show="tipError">{{ tipMsg }}</p>
        <el-form-item label="实际价格" prop="deal_pre_total_price" >
          <el-input :disabled="true" v-model="deal_pre_total_price"  class="wid_140"></el-input>
          <span> 元</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="return_dialogVisible = false" size="mini">关 闭</el-button>
          <el-button type="primary" v-show="!tipError" v-if="return_form.showReturnR" @click="return_resolve" size="mini">确 定</el-button>
        </span>
    </el-dialog>

    <!-- M3 卖出详情-->
    <el-dialog
      title="卖出详情"
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
        <el-form-item label="银行账号" prop="account_no">
          <el-input v-model="detail_form.account_no" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="卖出数量" prop="digit_num">
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
        <el-form-item label="订单号" prop="orderid">
          <el-input v-model="detail_form.orderid" placeholder class="wid_1001"></el-input>
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
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import { getToken } from "../../utils/auth.js";
import {
  isvalidPhone,
  validNum100,
  filterSpace,
  validZNum,
  validNum20,
  validNum2,
  getFloat,
  myIsNaN,
  validFloat2,
  calcuReturn,
  save2num
} from "../../utils/validate";
import axios from "axios";
export default {
  name: "buyList",
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
    // 校验数字
    let validRate=(val,value,callback)=>{
      if (!value){
          callback(new Error('请输入值'))
      }else  if (!validFloat2(value)){
          callback(new Error('输入正整数或两位以内的小数'))
      }else {
          callback()
      }
    }
    let validZ=(val,value,callback)=>{
      if (!value){
          callback(new Error('请输入值'))
      }else  if (!calcuReturn(value)){
          callback(new Error('输入正数'))
      }else {
          callback()
      }
    }
    return {
      tipMsg:"",
      // 创建时间
      pickerOptions_register1: {
        disabledDate: time => {
          let vm = this;
          if (vm.queryForm.endTime != "") {
            return time.getTime() > new Date(vm.queryForm.endTime).getTime();
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions_register2: {
        disabledDate: time => {
          let vm = this;
          if (vm.queryForm.startTime != "") {
            let minTime = new Date(vm.queryForm.startTime).getTime();
            const day31 = (31 - 1) * 24 * 3600 * 1000;
            let maxTime = minTime + day31;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            return (
              time.getTime() < new Date(vm.queryForm.startTime).getTime() ||
              time.getTime() > maxTime
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      tipError:false,//预付费错误提示
      roleId: "",
      platformId:'',
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
        createtime: "",
        startTime: "",
        endTime:'',
        startNum: "",
        endNum:'',
        pay_status:'',
        pay_statuss:[
          {
            id:1,
            value:'已付款'
          }
        ],
      },
      value1: "",

      // 用户详情
      detail_dialogVisible: false,
      detail_loading: false,
      detail_form: {
        username: "",
        phone: "",
        account_no:'',
        digit_num:'',
        single_price:'',
        total_amount:'',
        pay_status:'',
        orderid:'',
      },
      // 终止交易
      break_dialogVisible:false,
      break_loading:false,
      break_form:{
        deal_status:'0',
        digit_num:'',
        order_type:'1',
        orderid:'',
        userid:'',
        terminate_reason:'',
        showBreakR:true,
      },
      break_form_rules:{
        terminate_reason:[
          { required: true, message: '请输入终止原因', trigger: 'blur' }
        ]
      },

      // 交易失败
      fail_dialogVisible:false,
      fail_loading:false,
      fail_form:{
        order_status:'2',
        username:'',
        orderid:'',
        phone:'',
        failed_reason:'',
        showFailR:true,

        digit_num:'',
        order_type:'',
        userid:'',
      },
      fail_form_rules:{
        failed_reason:[
          { required: true, message: '请输入失败原因', trigger: 'blur' }
        ]
      },


      // 返预扣
      return_dialogVisible:false,
      return_loading:false,
      return_form:{
        showReturnR:true,
        orderid:'',
        digit_num:'',
        pre_amount_status:'1',
        deal_single_price:'',
        pre_total_price:'',

        // 实际返预付费价格
        deal_pre_total_price:'',
        single_price:'',
        username:'',
        phone:'',
      },
      return_form_rules:{
        deal_single_price:[
          { required: true, validator:validRate, trigger: 'blur' },
        ]
      },
    };
  },
  created() {
    // 获取roleId
    this.roleId = this.$store.getters.roleId;
    this.platformId = this.$store.getters.platformid;
    // 根据roleId控制角色类的显示
    //console.log(this.roleId)

    // 初始化 主列表数据
    this.getTableDataList(1);
  },
  computed:{
    deal_pre_total_price:{
      get:function(){
        if(this.return_form.deal_single_price){
          let val = (this.return_form.single_price - this.return_form.deal_single_price*100<=1)
          if(val){
            this.tipError = false;
            return save2num(this.return_form.deal_single_price*this.return_form.digit_num,'sell')
          }else{
            // 给出提示，隐藏确认按钮
            this.tipMsg = '最低允许成交价为：'+ (this.return_form.single_price-1)/100
            this.tipError = true;
          }
        }
      },
      set:function(v){

        this.deal_pre_total_price  = val;
      }
    },
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
          startTime: this.queryForm.startTime,
          endTime: this.queryForm.endTime,
          startNum:this.queryForm.startNum,
          endNum: this.queryForm.endNum,
          pay_status:this.queryForm.pay_status

        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/orderInfo/sellList`, param)
        .then(res => {
          if (res.data.code == "0000") {

            this.tableLoading = false;
            this.tableData = res.data.data.sellOrderList;
            // 分页 总数
            this.pageTotal = res.data.data.page.pageTotal;
          }else{
            this.tableLoading = false;
            this.m_message(res.data.msg,'error');
          }
        })
        .catch(err => {});
    },

    // 设置终止交易行的特殊样式
    tableRowClassName({row, rowIndex}){
      if (row.deal_status == '0') {

        return 'warning-row';
      }
      return '';

    },
    // 放款
    handle_store(row) {
      this.$confirm("是否放款?", "放款", {
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
            amount_status:'1',
            orderid:row.orderid,
            platformid:this.platformId,
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/orderInfo/updateAmountStatus`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.m_message(res.data.msg, "success");
              // 刷新
              loading.close();
              this.handle_refresh();
            } else {
              loading.close();
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },


    // 操作-交易失败*
    handle_fail(row){
      this.fail_dialogVisible = true;
      this.fail_form.failed_reason = '';
      this.fail_form.username = row.username;
      this.fail_form.orderid = row.orderid;
      this.fail_form.phone = row.phone;
      this.fail_form.showFailR = true;
      this.fail_form.digit_num = row.digit_num;
      this.fail_form.order_type = row.order_type;
      this.fail_form.userid = row.userid;
    },
    // 保存-交易失败*
    fail_resolve(){
      if(this.m_valid_addForm('fail_form')){
        let param = {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            failed_reason: this.fail_form.failed_reason,
            order_status: this.fail_form.order_status,
            orderid:this.fail_form.orderid,
            phone:this.fail_form.phone,
            username:this.fail_form.username,
            failed_reason:this.fail_form.failed_reason,

            digit_num:this.fail_form.digit_num,
            order_type:this.fail_form.order_type,
            userid:this.fail_form.userid,
          }
        };
        this.fail_loading = true;
        this.$http
          .post(`${commonUrl.baseUrl}/orderInfo/orderTransactionFailed`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.fail_loading = false;
              this.fail_dialogVisible = false;
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              this.fail_loading = false;
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      }
    },
    // 操作-查看交易失败*
    handle_viewFail(row){
      this.fail_dialogVisible = true;
      this.fail_form.showFailR = false;
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          orderid: row.orderid,
        }
      };
      this.fail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/orderInfo/selectOrderInfo`, param)
        .then(res => {
          console.log(res)
          if (res.data.code == "0000") {
            let result = res.data.data.orderInfo;
            this.fail_form.failed_reason = result.failed_reason;
            this.fail_loading = false;
          }else{
            this.fail_loading = false;
            this.m_message(res.data.msg, 'warning');
          }
        })
        .catch(err => {});
    },



    // 操作-查看实际成交金额
    handle_viewRM(row){
      this.return_dialogVisible = true;
      this.return_form.showReturnR = false;
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          orderid: row.orderid,
        }
      };
      this.return_loading = true;
      this.$http
      .post(`${commonUrl.baseUrl}/orderInfo/selectOrderInfo`, param)
      .then(res => {

        if (res.data.code == "0000") {
          let result = res.data.data.orderInfo;
          this.return_form.single_price = result.single_price
          this.return_form.digit_num = result.digit_num
          this.return_form.deal_single_price = result.deal_single_price / 100;
          this.return_loading = false;
        }else{
          this.return_loading = false;
          this.m_message(res.data.msg, 'warning');
        }
      })
      .catch(err => {});
    },
    // 操作-实际成交金额
    handle_returnM(row) {
      this.return_dialogVisible = true;
      this.resetData('return_form')
      this.return_form.showReturnR = true;
      this.return_form.orderid = row.orderid,
      this.return_form.digit_num = row.digit_num,
      this.return_form.pre_total_price = row.pre_total_price
      this.return_form.total_amount = row.total_amount
       // 买入时单价
      this.return_form.single_price = row.single_price


      this.return_form.username = row.username
      this.return_form.phone = row.phone
    },
    // 提交-实际成交价
    return_resolve(){
      if(this.m_valid_addForm('return_form')){
        let param = {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            orderid:this.return_form.orderid,
            deal_single_price:this.return_form.deal_single_price*100,
            pre_amount_status:this.return_form.pre_amount_status,
            // pre_total_price:this.return_form.pre_total_price,
            // digit_num:this.return_form.digit_num,
            username:this.return_form.username,
            phone:this.return_form.phone,
            order_type:1,
            total_amount:save2num(this.deal_pre_total_price*100,'sell'),
            deal_pre_total_price:this.return_form.total_amount
          }
        };
        this.return_loading = true;
        this.$http
        .post(`${commonUrl.baseUrl}/orderInfo/updatePreAmountStatus`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.return_loading = false;
            this.return_dialogVisible = false;
            this.m_message(res.data.msg, "success");
            // 刷新
            this.handle_refresh();
          } else {
            this.return_loading = false;
            this.m_message(res.data.msg, "warning");
          }
        })
        .catch(err => {});
      }
    },

    // 操作-终止交易
    handle_break(row){
      this.break_dialogVisible = true;
      this.break_form.digit_num = row.digit_num;
      this.break_form.orderid = row.orderid;
      this.break_form.userid = row.userid;

      this.break_form.showBreakR = true;
    },
    // 提交-终止交易
    break_resolve(){
      if(this.m_valid_addForm('break_form')){
        let param = {
          data: {
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,

            deal_status: this.break_form.deal_status,
            digit_num: this.break_form.digit_num,
            order_type: this.break_form.order_type,
            orderid:this.break_form.orderid,
            userid:this.break_form.userid,
            terminate_reason:this.break_form.terminate_reason,
          }
        };
        this.break_loading = true;
        this.$http
          .post(`${commonUrl.baseUrl}/orderInfo/dealTransaction`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.break_loading = false;
              this.break_dialogVisible = false;
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              this.break_loading = false;
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      }
    },

    // 操作-查看终止原因
    handle_viewBR(row){
      this.break_dialogVisible = true;
      this.break_form.showBreakR = false;
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          orderid: row.orderid,
        }
      };
      this.break_loading = true;
      this.$http
      .post(`${commonUrl.baseUrl}/orderInfo/selectOrderInfo`, param)
      .then(res => {

        if (res.data.code == "0000") {
          let result = res.data.data.orderInfo;
          this.break_form.terminate_reason = result.terminate_reason;
          this.break_loading = false;
        }else{
          this.detail_loading = false;
          this.m_message(res.data.msg, 'warning');
        }
      })
      .catch(err => {});
    },

    // 卖出详情
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
            this.detail_form.account_no = result.account_no;
            this.detail_form.orderid = result.orderid;
            this.detail_form.digit_num = result.digit_num;
            this.detail_form.single_price = result.single_price /100;
            this.detail_form.total_amount = result.total_amount / 100;

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
    // 清空预览图
    clearPreviewImgs(){
      this.idcard_back_url_srcList = [];
      this.idcard_front_url_srcList = [];
      this.blink_url_srcList = [];
      this.head_url_srcList = [];
      this.openmouth_url_srcList=[];
      this.shake_url_srcList=[];

      this.all_url_srcList = [];
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
<style scoped>
  .el-table >>> tr.warning-row {
    background: #F2F2F2 !important;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .wid_1001{
    width:229px;

  }

  .return_label >>> .el-form-item__label{
    text-align: left;
  }

  .return_label .tipError{
    font-size: 12px;
    color:red;
    margin-top:0;
  }
  .return_label .el-form-item{
    margin-bottom:25px;
  }
</style>
