<template>
    <div class="pad_5">
      <!-- M1 查询区域 -->
      <div class="query_fields pad_b_no">
        <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
            <!-- 查询 -->
            <el-form-item>
              <!-- <el-button type="primary" size='mini' @click="queryData">查询</el-button>
              <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button> -->

              <el-button  type="primary" size='mini' @click="handle_baseSet">基础设置</el-button>
              <el-button  type="success" size='mini' @click="handle_storeSet">库存设置</el-button>
              <!-- <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button> -->

            </el-form-item>
        </el-form>
      </div>
      <!-- M2 主列表 -->
      <div>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabs">

          <el-tab-pane label="银行卡管理" name="bank">
            <!-- 银行卡 查询条件-->
            <div>
              <el-form :inline="true" :model="queryForm_bank" ref="queryForm_bank" size="mini" class="demo-form-inline">
                <el-form-item >
                  <el-button type="primary" size='mini' @click="queryData('bank')">查询</el-button>
                  <el-button type="success" size='mini' @click="resetData('queryForm_bank')">重置</el-button>
                  <el-button type="primary" size='mini' @click="handle_refresh('bank')">刷新</el-button>
                  <el-button type="warning" size='mini' @click="handle_addBank('bank')">银行卡添加</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- 银行卡 列表 -->
            <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
              <el-table-column prop="account_username" label="姓名" width="" >
              </el-table-column>
              <el-table-column prop="card_bank" label="开户行" width="">
              </el-table-column>
              <el-table-column prop="account_no" label="银行卡号" width="">
              </el-table-column>
              <el-table-column prop="limit_amount" label="限额(万)" width="">
              </el-table-column>
              <el-table-column prop="" label="操作" width="">
              <template slot-scope="scope">
                <el-button  @click="handle_detail(scope.row,'bank')" type="text" size="small">修改</el-button>
                <el-button v-if="scope.row.account_status == 1"   @click="handle_frozen(scope.row,'bank')" type="text" size="small">删除</el-button>
                <!-- <el-button v-else   @click="handle_frozen(scope.row, 'bank')" type="text" size="small">解冻</el-button> -->
              </template>
              </el-table-column>
            </el-table>
            <!-- 银行卡 分页 -->
            <div class="block mar_t10">
                <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :total="pageTotal"
                background
                layout="total, prev, pager, next, jumper"
                >
                </el-pagination>
            </div>
          </el-tab-pane>

          <el-tab-pane label="支付宝管理" name="alipay">
            <!-- 支付宝 查询条件-->
            <div>
              <el-form :inline="true" :model="queryForm_zhi" ref="queryForm_zhi" size="mini" class="demo-form-inline">
                <el-form-item >
                  <el-button type="primary" size='mini' @click="queryData('zhi')">查询</el-button>
                  <el-button type="success" size='mini' @click="resetData('queryForm_zhi')">重置</el-button>
                  <el-button type="primary" size='mini' @click="handle_refresh('zhi')">刷新</el-button>
                  <el-button type="warning" size='mini' @click="handle_addBank('zhi')">支付宝添加</el-button>
                </el-form-item>
              </el-form>

            </div>
            <!-- 支付宝 列表 -->
            <el-table :data="tableData_zhi" v-loading="tableLoading_zhi" border stripe style="width: 100%">
              <el-table-column prop="account_username" label="姓名" width="" >
              </el-table-column>
              <el-table-column prop="account_no" label="支付宝账号" width="">
              </el-table-column>
              <el-table-column prop="limit_amount" label="限额(万)" width="">
              </el-table-column>
              <el-table-column prop="" label="操作" width="">
              <template slot-scope="scope">
                <el-button  @click="handle_detail(scope.row,'zhi')" type="text" size="small">修改</el-button>
                <el-button v-if="scope.row.account_status == 1"   @click="handle_frozen(scope.row,'zhi')" type="text" size="small">删除</el-button>
                <!-- <el-button v-else   @click="handle_frozen(scope.row, 'bank')" type="text" size="small">解冻</el-button> -->
              </template>
              </el-table-column>
            </el-table>
            <!-- 支付宝 分页 -->
            <div class="block mar_t10">
                <el-pagination
                @current-change="handleCurrentChange_zhi"
                :current-page="currentPage_zhi"
                :total="pageTotal_zhi"
                background
                layout="total, prev, pager, next, jumper"
                >
                </el-pagination>
            </div>
          </el-tab-pane>

          <el-tab-pane label="数字钱包管理" name="numAcc">
            <!-- 数字钱包 查询条件-->
            <div>
              <el-form :inline="true" :model="queryForm_numA" ref="queryForm_numA" size="mini" class="demo-form-inline">
                <el-form-item >
                  <el-button type="primary" size='mini' @click="queryData('numA')">查询</el-button>
                  <el-button type="success" size='mini' @click="resetData('queryForm_numA')">重置</el-button>
                  <el-button type="primary" size='mini' @click="handle_refresh('numA')">刷新</el-button>
                  <el-button type="warning" size='mini' @click="handle_addBank('numA')">数字钱包添加</el-button>
                </el-form-item>
              </el-form>

            </div>
            <!-- 数字钱包 列表 -->
            <el-table :data="tableData_numA" v-loading="tableLoading_numA" border stripe style="width: 100%">
              <!-- <el-table-column prop="account_username" label="姓名" width="" >
              </el-table-column> -->
              <el-table-column prop="account_no" label="数字钱包账户" width="">
              </el-table-column>
              <!-- <el-table-column prop="limit_amount" label="限额(万)" width="">
              </el-table-column> -->
              <el-table-column prop="" label="操作" width="">
              <template slot-scope="scope">
                <el-button  @click="handle_detail(scope.row,'numA')" type="text" size="small">修改</el-button>
                <el-button v-if="scope.row.account_status == 1"   @click="handle_frozen(scope.row,'numA')" type="text" size="small">删除</el-button>
                <!-- <el-button v-else   @click="handle_frozen(scope.row, 'bank')" type="text" size="small">解冻</el-button> -->
              </template>
              </el-table-column>
            </el-table>
            <!-- 数字钱包 分页 -->
            <div class="block mar_t10">
                <el-pagination
                @current-change="handleCurrentChange_numA"
                :current-page="currentPage_numA"
                :total="pageTotal_numA"
                background
                layout="total, prev, pager, next, jumper"
                >
                </el-pagination>
            </div>
          </el-tab-pane>



        </el-tabs>
      </div>
      <!-- M3 dialog 基础设置 -->
      <el-dialog
          title="基础设置"
          :visible.sync="baseSet_dialogVisible"
          width="43%"
          center
          :close-on-click-modal="false"
          v-loading="baseSet_loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          >

          <el-form :inline="true"
            :model="add_form"
            :rules="add_rules"
            ref="add_form"

            class="demo-form-inline valid_form"
            >


              <el-form-item label="单笔限额" prop="single_limit">
                  <el-input v-model="add_form.single_limit" placeholder="单笔限额" class="wid_140"></el-input>
                  <span class="zhushi">万</span>
              </el-form-item>
              <el-form-item label="穿透金额" prop="pass_amount" >
                  <el-input v-model="add_form.pass_amount" placeholder="穿透金额" class="wid_140"></el-input>
                  <span class="zhushi">个以上穿透交易 </span>
                  <span class="zhushi " style="color:green">（ {{ add_form.pass_amount }} </span>
                  <span class="zhushi">&nbsp;个以下库存交易</span>
                  <span class="zhushi" style="color:green">）</span>
              </el-form-item>
              <el-form-item label="交易时间" required>
                <el-col :span="11">
                  <el-form-item prop="begintime">
                    <el-time-picker
                      class="wid_140"
                      v-model="add_form.begintime"

                      :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                      }"
                      placeholder="开始时间">
                    </el-time-picker>
                  </el-form-item>
                </el-col>
                &nbsp;&nbsp;
                <el-col :span="11">
                  <el-form-item prop="endtime">
                    <el-time-picker
                      class="wid_140"

                      v-model="add_form.endtime"
                      :picker-options="{
                        selectableRange: '00:00:00 - 23:59:59'
                      }"
                      placeholder="结束时间">
                    </el-time-picker>
                  </el-form-item>

                </el-col>
              </el-form-item>

              <el-form-item label="推送电话" prop="phone" >
                  <el-input v-model="add_form.phone" placeholder="推送电话" class="wid_140"></el-input>
              </el-form-item>
              <el-form-item label="营业状态" prop="platform_enable" >
                <el-select v-model="add_form.platform_enable" placeholder="营业状态" class="wid_140">
                  <el-option
                    v-for="(item, index) of add_form.platform_enables"
                    :key="index"
                    :label="item.value"
                    :value="item.id"
                    >
                  </el-option>
                </el-select>
              </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
              <el-button @click="baseSet_dialogVisible = false" size="mini">取 消</el-button>
              <el-button type="primary" @click="save_add" size="mini">设 置</el-button>
          </span>
      </el-dialog>
      <!-- M5 dialog 库存设置 -->
      <el-dialog
          title="库存设置"
          :visible.sync="detail_check_dialogVisible"
          width="26%"
          center
          :close-on-click-modal="false"
          v-loading="detail_check_loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class=""
          >

          <el-form :inline="true" ref="detail_check_form" :model="detail_check_form"   class="demo-form-inline" >
              <div class="remain_wrap" v-if="detail_check_form.isStore">
                <span class="zhushi2">当前库存</span>
                <span class="zhushi2" style="color:green;">{{ detail_check_form.platform_account_remain  }}</span>
                <span class="zhushi2">个</span>
              </div>
               <el-form-item label="" prop="" >
                <el-select v-model="detail_check_form.change_type"  class="wid_100">
                  <el-option
                    v-for="(item, index) of detail_check_form.change_types"
                    :key="index"
                    :label="item.value"
                    :value="item.id"
                    >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="platform_account_change">
                  <el-input v-model="detail_check_form.platform_account_change" placeholder="请输入" class="wid_140"></el-input>
                  <span>个</span>
              </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
              <el-button @click="detail_check_dialogVisible = false" size="mini">关 闭</el-button>
              <el-button @click="save_storeSet" type="primary" size="mini">设 置</el-button>

          </span>
      </el-dialog>


      <!-- M6 dialog 添加/修改银行 -->
      <el-dialog
        :title="addTitle"
        :visible.sync="addBZ_dialogVisible"
        width="30%"
        center
        :close-on-click-modal="false"
        v-loading="addBZ_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="add_inputH"
        >
        <el-form :inline="false" :model="addBZ_form" :rules="addBZ_form_rules" ref="addBZ_form"   class="" label-width="68px" >
          <el-form-item label="姓名" prop="account_username" label-width="68px">
            <el-input v-model="addBZ_form.account_username" placeholder="姓名" class="wid_150"></el-input>
          </el-form-item>
          <el-form-item label="银行" prop="card_bank" label-width="68px">
            <el-input v-model="addBZ_form.card_bank" placeholder="银行" class="wid_150"></el-input>
          </el-form-item>
          <el-form-item label="卡号" prop="account_no" label-width="68px">
            <el-input v-model="addBZ_form.account_no" @blur="modiNo(addBZ_form.account_no)" placeholder="卡号" class="wid_150"></el-input>
          </el-form-item>
          <el-form-item label="限额" prop="limit_amount" label-width="68px">
            <el-input v-model="addBZ_form.limit_amount" placeholder="限额" class="wid_150"></el-input>
            <span>万</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addBZ_dialogVisible = false" size="mini">关 闭</el-button>
            <el-button @click="save_addBZ" type="primary" size="mini">确 定</el-button>
        </span>
      </el-dialog>
       <!-- M7 dialog 添加/修改支付宝 -->
      <el-dialog
        :title="addTitle"
        :visible.sync="addZZ_dialogVisible"
        width="30%"
        center
        :close-on-click-modal="false"
        v-loading="addZZ_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="add_inputH"
        >
        <el-form :inline="true" :model="addZZ_form" :rules="addZZ_form_rules" ref="addZZ_form"   class="demo-form-inline " label-width="68px" >
          <el-form-item label="姓名" prop="account_username" label-width="68px">
            <el-input v-model="addZZ_form.account_username" placeholder="姓名" class="wid_150"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account_no" label-width="68px">
            <el-input v-model="addZZ_form.account_no" placeholder="账号" class="wid_150"></el-input>
          </el-form-item>
          <el-form-item label="限额" prop="limit_amount" label-width="68px">
            <el-input v-model="addZZ_form.limit_amount" placeholder="限额" class="wid_150"></el-input>
            <span>万</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addZZ_dialogVisible = false" size="mini">关 闭</el-button>
            <el-button @click="save_addZZ" type="primary" size="mini">确 定</el-button>
        </span>
      </el-dialog>


      <!-- M8 dialog 添加/修改数字钱包-->
      <el-dialog
        :title="addTitle"
        :visible.sync="addSZ_dialogVisible"
        width="30%"
        center
        :close-on-click-modal="false"
        v-loading="addSZ_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="add_inputH"
        >
        <el-form :inline="true" :model="addSZ_form" :rules="addSZ_form_rules" ref="addSZ_form"   class="demo-form-inline " label-width="68px" >
          <!-- <el-form-item label="姓名" prop="account_username" label-width="68px">
            <el-input v-model="addZZ_form.account_username" placeholder="姓名" class="wid_150"></el-input>
          </el-form-item> -->
          <el-form-item label="钱包账号" prop="account_no" label-width="80px">
            <el-input
              v-model="addSZ_form.account_no"
              placeholder="钱包账号"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              class="wid_150"
              >
            </el-input>
          </el-form-item>
          <!-- <el-form-item label="限额" prop="limit_amount" label-width="68px">
            <el-input v-model="addZZ_form.limit_amount" placeholder="限额" class="wid_150"></el-input>
            <span>万</span>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addSZ_dialogVisible = false" size="mini">关 闭</el-button>
            <el-button @click="save_addSZ" type="primary" size="mini">确 定</el-button>
        </span>
      </el-dialog>


    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common'
import {isvalidPhone, validNum100, filterSpace,myIsNaN,validzzs,validBankCode} from '../../utils/validate'
export default {
    name: 'agentCheck',
    data(){
        // 校验手机号
        let validPhone=(rule, value,callback)=>{
            if (!value){
                callback(new Error('请输入电话号码'))
            }else  if (!isvalidPhone(value)){
                callback(new Error('请输入正确手机号码'))
            }else {
                callback()
            }
        }
        // 校验银行卡号
        let validBC = (val,value,callback)=>{
            if (!value){
                callback(new Error('请输入值'))
            }else  if (!validBankCode(value)){
                callback(new Error('请输入正确的银行卡号'))
            }else {
                callback()
            }
        }
        // 校验数字
        let validRate=(val,value,callback)=>{
            if (!value){
                callback(new Error('请输入值'))
            }else  if (!myIsNaN(value)){
                callback(new Error('请输入合理的数'))
            }else {
                callback()
            }
        }
        // 校验正整数
        let validZZS=(val,value,callback)=>{
            if (!value){
                callback(new Error('请输入值'))
            }else  if (!validzzs(value)){
                callback(new Error('请输入大于0的整数'))
            }else {
                callback()
            }
        }

        return {
            // 标题
            addTitle:'',
            // 角色ID
            roleId:'',
            platformId:'',
            // 主列表标签
            activeName:'bank',
            // 加载
            baseSet_loading:false,
            // 银行卡/支付宝/数字钱包 主列表
            tableLoading:false,
            tableData:[],
            tableLoading_zhi:false,
            tableData_zhi:[],
            tableLoading_numA:false,
            tableData_numA:[],
            // 银行卡/支付宝/数字钱包 分页
            pageTotal: 1,
            currentPage:1,
            pageTotal_zhi: 1,
            currentPage_zhi:1,
            pageTotal_numA: 1,
            currentPage_numA:1,
            // 查询参数
            queryForm: {

                single_limit:'',
                pass_amount:'',
                phone:'',


            },
            queryForm_bank:{

            },
            queryForm_zhi:{

            },
            queryForm_numA:{

            },
            // dialog add
            baseSet_dialogVisible: false,
            detail_dialogVisible:false,
            detail_loading:false,
            detail_check_dialogVisible:false,
            detail_check_loading:false,

            // 基础设置
            add_form:{
              single_limit: '',
              pass_amount:'',
              phone:'',
              begintime:'',
              endtime:'',
              platform_enables:[
                {
                  id:0,
                  value:'停业'
                },
                {
                  id:1,
                  value:'营业'
                }
              ],
              platform_enable:'',
              platformid:'',
            },
            // 基础设置 规则
            add_rules:{
                single_limit:[
                    { required: true, validator:validRate, trigger: 'blur' },
                ],
                pass_amount:[
                    { required: true, validator:validRate, trigger: 'blur' },

                ],
                // address:[
                //     { required: true, message: '请输入地址', trigger: 'blur' }
                // ],
                phone:[
                    { required: true, trigger: 'blur', validator: validPhone }
                ],
                platform_enable: [
                    { required: true, message: '请选择营业状态', trigger: 'change' }
                ],
                begintime: [
                  { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endtime: [
                  { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
                ],

            },

            // 修改
            detail_form:{
                regions:[],
                cities:[],
                // 机构编号
                agentid:'',
                // 机构名称
                single_limit:'',
                // 穿透金额
                pass_amount:'',
                // 业务地区
                province_code:'',
                city_code:'',
                // 交易时间
                address:'',
                // 贝壳分成
                virtual_rate:'',
                // 出行分成
                account_rate:'',
                // 电话
                phone:'',
                // 邮箱
                email:'',
                // 合同编号
                contract_no:'',
                // 开户行
                bank_code:'',
                // 开户名
                account_user:'',
                // 账号
                account_no:'',
                // 开户地
                account_regions:'',
                account_cities:[],
                account_province_code:'',
                account_city_code:'',
            },
            detail_agentName:'',
            // 库存设置
            detail_check_form:{
              // 是否显示目前库存量
              isStore:false,
              change_types:[
                  {
                      id:0,
                      value:'减少'
                  },
                  {
                      id:1,
                      value:'增加'
                  },
              ],
              platformid:'',
              change_type:1,
              // 库存增量
              platform_account_change:'',
              // 目前库存
              platform_account_remain:'',
            },
            // 库存设置 规则
            detail_check_rules:{
              platform_account_change:[
                 { required: true, validator:validZZS, trigger: 'blur' },
              ]
            },


            // 添加银行卡、支付宝、数字钱包
            addBZ_dialogVisible:false,
            addBZ_loading:false,
            addBZ_form:{
              account_type:'0',
              account_username:'',
              card_bank:'',
              account_no:'',
              limit_amount:'',
              accountid:'',
            },
            addBZ_form_rules:{
              account_username:[
                { required: true, message: '请输入姓名', trigger: 'blur' }
              ],
              card_bank:[
                { required: true, message: '请输入银行', trigger: 'blur' }
              ],
              account_no:[
                { required: true, validator:validBC, trigger: 'blur' },
              ],
              limit_amount:[
                { required: true, validator:validRate, trigger: 'blur' },
              ]
            },

            // 支付宝
            addZZ_dialogVisible:false,
            addZZ_loading:false,
            addZZ_form:{
              account_type:'2',
              account_username:'',
              account_no:'',
              limit_amount:'',
              accountid:'',
            },
            addZZ_form_rules:{
              account_username:[
                { required: true, message: '请输入姓名', trigger: 'blur' }
              ],
              account_no:[
                { required: true, message:'支付宝账户必填', trigger: 'blur' },
              ],
              limit_amount:[
                { required: true, validator:validRate, trigger: 'blur' },
              ]
            },

            // 数字钱包
            addSZ_dialogVisible:false,
            addSZ_loading:false,
            addSZ_form:{
              account_type:'1',
              account_username:'',
              card_bank:'',
              account_no:'',
              limit_amount:'',
              accountid:'',
            },
            addSZ_form_rules:{
              // account_username:[
              //   { required: true, message: '请输入姓名', trigger: 'blur' }
              // ],
              // card_bank:[
              //   { required: true, message: '请输入银行', trigger: 'blur' }
              // ],
              account_no:[
                { required: true,  message: '请输入钱包账号', trigger: 'blur' },
              ],
              // limit_amount:[
              //   { required: true, validator:validRate, trigger: 'blur' },
              // ]
            },

        }
    },
    created(){
        // 初始化roleId platformId
        this.roleId = this.$store.getters.roleId;
        this.platformId = this.$store.getters.platformid;


        // 初始化 银行卡 主数据列表
        this.getTableDataList(1)
        // 初始化 支付宝 主列表数据
        this.getTableDataList_zhi(1);
        // 初始化 数字钱包 主列表数据
        this.getTableDataList_numA(1);
    },
    methods:{
      // 银行卡失去焦点时处理空格问题
      modiNo(val){
        this.addBZ_form.account_no = filterSpace(val);
      },
      // 标签切换
      handleTabs(tab, event) {
       if(tab.paneName === 'alipay'){

       }else{

       }
      },
      // 初始化 银行卡 主数据列表
      getTableDataList(pageNum){
        let param = {
            data:{
                // 公有
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
                pageNum: pageNum,
                pageSize: 10,
                platformid:this.platformId,
            }
        }
        this.tableLoading = true
        this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/bankCardList`, param).then(res=>{
            if(res.data.code == '0000'){
              let _data = res.data.data.getBankCardList;
              let __data = _data.map(item => {
                if(item.limit_amount > 0){
                  item.limit_amount = item.limit_amount / 1000000
                }
                return item;
              });

              this.tableData = __data;
              // 分页总数
              this.pageTotal = res.data.data.page.pageTotal;
              this.tableLoading = false
            }
        }).catch(err=>{

        })

      },
      // 初始化 支付宝 主列表数据
      getTableDataList_zhi(pageNum){
        let param = {
            data:{
                // 公有
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
                pageNum: pageNum,
                pageSize: 10,
                platformid:this.platformId,
            }
        }
        this.tableLoading_zhi = true
        this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/alipayList`, param).then(res=>{
            if(res.data.code == '0000'){
              let _data = res.data.data.getBankCardList;
              let __data = _data.map(item => {
                if(item.limit_amount > 0){
                  item.limit_amount = item.limit_amount / 1000000
                }
                return item;
              });

              this.tableData_zhi = __data;
              // 分页总数
              this.pageTotal_zhi = res.data.data.page.pageTotal;
              this.tableLoading_zhi = false
            }
        }).catch(err=>{

        })
      },
      // 初始化 数字钱包 主列表数据
      getTableDataList_numA(pageNum){
        let param = {
            data:{
                // 公有
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
                pageNum: pageNum,
                pageSize: 10,
                platformid:this.platformId,
            }
        }
        this.tableLoading_numA = true
        this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/numberAccountList`, param).then(res=>{
            if(res.data.code == '0000'){
              let _data = res.data.data.numberAccountList;

              this.tableData_numA = _data;
              // 分页总数
              this.pageTotal_numA = res.data.data.page.pageTotal;
              this.tableLoading_numA = false
            }
        }).catch(err=>{

        })
      },


      // 银行卡/支付宝添加
      handle_addBank(type){

        if(type === 'bank'){
          this.addBZ_dialogVisible = true;
          this.addTitle = "添加银行卡"
          this.addBZ_form.accountid = '';
          this.resetForm('addBZ_form')
        }else if(type == 'zhi'){
          this.addZZ_dialogVisible = true;
          this.addTitle = "添加支付宝"
          this.addZZ_form.accountid = '';
          this.resetForm('addZZ_form')
        }else{
          this.addSZ_dialogVisible = true;
          this.addTitle = "添加数字钱包"
          this.addSZ_form.accountid = '';
          this.resetForm('addSZ_form')
        }
      },
      // 添加/修改银行卡
      save_addBZ(){
        if(this.m_valid_addForm('addBZ_form')){
          let param = {
            data:{
                // 公有
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
                platformid:this.platformId,

                account_no:this.addBZ_form.account_no,
                account_type:this.addBZ_form.account_type,
                account_username:this.addBZ_form.account_username,
                card_bank:this.addBZ_form.card_bank,
                limit_amount:this.addBZ_form.limit_amount*1000000,
            }
          }
          if(this.addBZ_form.accountid){
            param.data.accountid = this.addBZ_form.accountid ;
          }
          this.addBZ_loading = true
          this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/saveAccount`, param).then(res=>{
              if(res.data.code == '0000'){
                this.addBZ_loading = false;
                this.addBZ_dialogVisible = false;
                this.m_message(res.data.msg,'success');
                this.handle_refresh('bank')
              }else{
                this.addBZ_loading = false;
                this.m_message(res.data.msg,'error');
              }
          }).catch(err=>{

          })
        }

      },
      // 添加/修改支付宝
      save_addZZ(){
        if(this.m_valid_addForm('addZZ_form')){
          let param = {
            data:{
              // 公有
              signInUserId: this.$store.getters.userId,
              signInRoleId: this.$store.getters.roleId,
              platformid:this.platformId,

              account_no:this.addZZ_form.account_no,
              account_type:this.addZZ_form.account_type,
              account_username:this.addZZ_form.account_username,
              limit_amount:this.addZZ_form.limit_amount*1000000,
            }
          }
          if(this.addZZ_form.accountid){
            param.data.accountid = this.addZZ_form.accountid ;
          }
          this.addZZ_loading = true
          this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/saveAccount`, param).then(res=>{
              if(res.data.code == '0000'){
                this.addZZ_loading = false;
                this.addZZ_dialogVisible = false;
                this.m_message(res.data.msg,'success');
                this.handle_refresh('zhi')
              }else{
                this.addZZ_loading = false;
                this.m_message(res.data.msg,'error');
              }
          }).catch(err=>{

          })

        }
      },
      // 添加/修改数字钱包
      save_addSZ(){
        if(this.m_valid_addForm('addSZ_form')){
          // 去空格
          let _account_no =filterSpace(this.addSZ_form.account_no);
          let param = {
            data:{
              // 公有
              signInUserId: this.$store.getters.userId,
              signInRoleId: this.$store.getters.roleId,
              platformid:this.platformId,

              account_no:_account_no,
              account_type:this.addSZ_form.account_type,
              account_username:'',//不需要传
              limit_amount:'',//不需要传
            }
          }
          if(this.addSZ_form.accountid){
            param.data.accountid = this.addSZ_form.accountid ;
          }
          this.addSZ_loading = true
          this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/saveAccount`, param).then(res=>{
              if(res.data.code == '0000'){
                this.addSZ_loading = false;
                this.addSZ_dialogVisible = false;
                this.m_message(res.data.msg,'success');
                this.handle_refresh('numA')
              }else{
                this.addSZ_loading = false;
                this.m_message(res.data.msg,'error');
              }
          }).catch(err=>{

          })

        }
      },
      // 操作-库存设置
      handle_storeSet(){
        this.detail_check_dialogVisible = true
          // 清空数据
          this.resetForm('detail_check_form');
          let param  = {
            data:{
              signInUserId: this.$store.getters.userId,
              signInRoleId: this.$store.getters.roleId,
              platformid:this.platformId,
            }
          }
          this.baseSet_loading = true
          this.$http.post(`${ commonUrl.baseUrl}/platformInfo/getPlatformInfo`,param).then(res=>{
              if(res.data.code == '0000'){

                this.baseSet_loading = false
                let result = res.data.data.platformInfo;
                this.detail_check_form.platformid = result.platformid;

                let _remain = result.platform_account_remain;
                this.detail_check_form.platform_account_remain = _remain;
                if(_remain >  0){
                  this.detail_check_form.isStore = true;
                }else{
                  this.detail_check_form.isStore = false;
                }

              }else{
                this.baseSet_loading = false;
                this.m_message(res.data.msg, 'error')
              }
          }).catch(err=>{  })
      },
      // 保存-库存设置
      save_storeSet(){
          if(this.m_valid_addForm('detail_check_form')){
              let param = {
                  data: {
                    signInUserId: this.$store.getters.userId,
                    signInRoleId: this.$store.getters.roleId,
                    platformid: this.detail_check_form.platformid,
                    change_type: this.detail_check_form.change_type,
                    platform_account_change:this.detail_check_form.platform_account_change
                  }
              }
              this.detail_check_loading = true
              this.$http.post(`${ commonUrl.baseUrl}/platformInfo/changePlatforAccountNumber`, param).then(res=>{
                  if(res.data.code == '0000'){

                      this.detail_check_loading = false
                      this.detail_check_dialogVisible = false
                      this.m_message(res.data.msg, 'success')

                  }else{
                    this.detail_check_loading = false
                    this.m_message(res.data.msg, 'error')
                  }
              }).catch(err=>{})
          }
      },
      // 操作-基础按钮
      handle_baseSet(){
          this.baseSet_dialogVisible = true
          // 清空数据
          this.resetForm('add_form');
          let param  = {
            data:{
              signInUserId: this.$store.getters.userId,
              signInRoleId: this.$store.getters.roleId,
              platformid:this.platformId,
            }
          }
          this.baseSet_loading = true
          this.$http.post(`${ commonUrl.baseUrl}/platformInfo/updatePlatform`,param).then(res=>{
              if(res.data.code == '0000'){
                  this.baseSet_loading = false
                  let result = res.data.data.platformInfo;


                  this.add_form.platformid = result.platformid;
                  this.add_form.single_limit = result.single_limit / 1000000;
                  this.add_form.pass_amount = result.pass_amount;
                  console.log(result.begintime)
                  this.add_form.begintime =  this.formatDate(result.begintime);
                  this.add_form.endtime =  this.formatDate(result.endtime);

                  this.add_form.phone = result.phone;
                  this.add_form.platform_enable = result.platform_enable;


              }else{
                this.baseSet_loading = false;
                this.m_message(res.data.msg, 'error')
              }
          }).catch(err=>{  })

      },
      // 保存-基础设置
      save_add(){
        // 校验
        if(this.m_valid_addForm('add_form')){

          let param = {
              data:{

                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,

                begintime: this.formateDate_q(this.add_form.begintime),
                endtime: this.formateDate_q(this.add_form.endtime),
                pass_amount: this.add_form.pass_amount,
                phone: this.add_form.phone,
                platform_enable: this.add_form.platform_enable,
                platformid: this.add_form.platformid,
                single_limit: this.add_form.single_limit*1000000
              }
          }
          this.baseSet_loading = true
          this.$http.post(`${commonUrl.baseUrl}/platformInfo/updatePlatformInfo`, param).then(res=>{

              if(res.data.code == '0000'){
                  this.baseSet_loading = false
                  this.baseSet_dialogVisible = false
                  this.m_message('基础设置成功','success')
                  this.handle_refresh();
              }else{
                  this.baseSet_loading = false
                  this.m_message(res.data.msg,'error')
              }


          }).catch(err=>{
              console.log(err)
          })

          }
      },
      // 刷新 主列表
      handle_refresh(type){
        if(type === 'bank'){
          this.getTableDataList(this.currentPage);
        }else if(type== 'zhi'){
          this.getTableDataList_zhi(this.currentPage_zhi);
        }else{
           this.getTableDataList_numA(this.currentPage_numA);
        }
      },
      // 查询按钮
      queryData(type){
        if(type === 'bank'){
           this.getTableDataList(this.currentPage);
        }else{
          this.getTableDataList_zhi(this.currentPage_zhi);
        }
      },
      // 重置查询条件
      resetData(formName){
        if(this.$refs[formName]){
              this.$refs[formName].resetFields();
          }
      },
      // 修改银行卡/支付宝/数字钱包
      handle_detail(row,type){
        if(type === 'bank'){
          this.addBZ_dialogVisible = true
          this.addTitle = "修改银行卡"
          this.addBZ_form.accountid = row.accountid;
          this.resetForm('addBZ_form');
          this.addBZ_loading = true
          // 初始化数据
          let param = {
            data:{
              accountid:row.accountid,
              signInUserId: this.$store.getters.userId,
              signInRoleId: this.$store.getters.roleId,
            }
          }
          this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/updateAccount`, param)
          .then(res=>{
            if(res.data.code == '0000'){
              let _data = res.data.data.accountInfo;
              this.addBZ_form.account_username = _data.account_username;
              this.addBZ_form.card_bank = _data.card_bank;
              this.addBZ_form.account_no = _data.account_no;
              this.addBZ_form.limit_amount = _data.limit_amount / 1000000;
              this.addBZ_loading = false;
            }else{
              this.addBZ_loading = false;
              this.m_message(res.data.msg, 'error');
            }
          }).catch(err=>{})
        }else if(type == 'numA'){ //数字钱包
          this.addSZ_dialogVisible = true
          this.addTitle = "修改数字钱包"
          this.addSZ_form.accountid = row.accountid;
          this.resetForm('addSZ_form');
          this.addSZ_loading = true
          // 初始化数据
          let param = {
            data:{
              accountid:row.accountid,
              signInUserId: this.$store.getters.userId,
              signInRoleId: this.$store.getters.roleId,
            }
          }
          this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/updateAccount`, param)
          .then(res=>{
            if(res.data.code == '0000'){
              console.log(res)
              let _data = res.data.data.accountInfo;
              this.addSZ_form.account_no = _data.account_no;
              this.addSZ_loading = false;
            }else{
              this.addSZ_loading = false;
              this.m_message(res.data.msg, 'error');
            }
          }).catch(err=>{})
        }else{ //支付宝
          this.addZZ_dialogVisible = true
          this.addTitle = "修改支付宝"
          this.addZZ_form.accountid = row.accountid;
          this.resetForm('addZZ_form');
          this.addZZ_loading = true
          // 初始化数据
          let param = {
            data:{
              accountid:row.accountid,
              signInUserId: this.$store.getters.userId,
              signInRoleId: this.$store.getters.roleId,
            }
          }
          this.$http.post(`${ commonUrl.baseUrl }/platformAccountInfo/updateAccount`, param)
          .then(res=>{
            if(res.data.code == '0000'){
              let _data = res.data.data.accountInfo;
              this.addZZ_form.account_username = _data.account_username;
              this.addZZ_form.card_bank = _data.card_bank;
              this.addZZ_form.account_no = _data.account_no;
              this.addZZ_form.limit_amount = _data.limit_amount / 1000000;
              this.addZZ_loading = false;
            }else{
              this.addZZ_loading = false;
              this.m_message(res.data.msg, 'error');
            }
          }).catch(err=>{})
        }


      },


      // 删除
      handle_frozen(row,type) {
        let content='',title='',flg;
        if(row.account_status == 1 ){
          title="删除";
          content="是否删除该用户?";
          flg='0'
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
              account_status:flg,
              accountid:row.accountid,
            }
          };
          this.$http
            .post(`${commonUrl.baseUrl}/platformAccountInfo/deleteAccount`, param)
            .then(res => {
              if (res.data.code == "0000") {
                loading.close()
                this.m_message(res.data.msg, "success");
                // 刷新
                if(type === 'bank'){
                  this.handle_refresh('bank');
                }else if(type == 'numA'){
                  this.handle_refresh('numA');
                }else{
                  this.handle_refresh('zhi');
                }

              } else {
                loading.close()
                this.m_message(res.data.msg, "warning");
              }
            })
            .catch(err => {});
        });
      },

      // 重置表单数据
      resetForm(formName) {
          if(this.$refs[formName]){
              this.$refs[formName].resetFields();
          }
      },

      // 处理后台传递的参数HHmmss=>HH:mm:ss
      formatDate(date){
        date = String(date);
        let zarr = ['0','0','0','0','0','0']
        if(date.length<6){
          date = zarr.slice(0,6-date.length).join('')+date               
        }
        // if(date.length == 5){
        //   date = '0'+date;
        // }
        if(date.length == 6){
          let today = new Date();
          let YYYY = today.getFullYear();
          let MM = today.getMonth();
          let DD = today.getDate();
          var h_HH = date.slice(0,2);
          var h_mm = date.slice(2,4);
          var h_ss = date.slice(4);
          //console.log(`${YYYY},${MM},${DD},${h_HH},${h_mm},${h_ss}`)
          // var s = Number(h_HH*3600) + Number(h_mm*60) + Number(h_ss);
          return new Date(YYYY,MM,DD,h_HH,h_mm,h_ss);
        }
      },
      // 处理前台日期格式
      formateDate_q(date){
        date = new Date(date);
        let strHours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //获取小时,如果小于10,前面补个0
        let strMinutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //获取分,如果小于10,前面补个0
        let strSeconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //获取秒,如果小于10,前面补个0
        return `${strHours}${strMinutes}${strSeconds}`;
      },
      // 银行卡 分页
      handleCurrentChange(val){
        this.currentPage = val
        this.handle_refresh('bank');
      },
      // 支付宝 分页
      handleCurrentChange_zhi(val){
        this.currentPage_zhi = val
        this.handle_refresh('zhi');
      },
      // 数字钱包分页
      handleCurrentChange_numA(val){
        this.currentPage_numA = val
        this.handle_refresh('numA');
      },
      // 清空校验规则
      clearValid(validForm){
          if(this.$refs[validForm]){
              this.$refs[validForm].resetFields()
          }
      },



      // 新增 校验规则
      m_valid_addForm(formName) {
          let  flag  = false ;
          this.$refs[formName].validate((valid) => {
              if (valid) {
              flag = true;
              return true
              } else {
              flag = false;
              return false;
              }
          });
          return flag;
      },
      // 提示信息 message:提示信息   type 提示类型
      m_message(message,type){
          this.$message({
              message,
              type
          })
      },
    }
}
</script>

<style scoped>
.zhushi{
  font-size:12px;
  color:lightsalmon ;
}
.zhushi2{
  font-size: 14px;
  color:lightsalmon ;
}
.wid_100{
  width:76px;
}
.remain_wrap{
  text-align: center;
  padding-bottom:20px;
}
.wid_150{
  width:200px;
}
.add_inputH .el-form-item{
  margin-bottom:25px;
}
</style>
