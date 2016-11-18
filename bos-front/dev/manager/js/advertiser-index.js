/**
 * @file config.js
 * @author songxing
 */
var ManagerAdvertiser = (function ($) {
    'use strict';
    var ManagerAdvertiser = function () {
        this.accountType = '0';
        this.allSales = null;
        this.allOpertions = null;
        this.filterAry = ['revenue_type', 'clients_status', 'creator_uid', 'operation_uid'];
    };

    ManagerAdvertiser.prototype = {
        _oColumnTitle: {
            res: 0,
            msg: '操作成功',
            obj: null,
            map: null,
            list: [{
                field: 'clientid',
                title: 'id'
            }, {
                field: 'date_created',
                title: '新建时间'
            }, {
                field: 'clientname',
                title: '广告主名称'
            }, {
                field: 'qualifications',
                title: '资质',
                width: 180
            }, {
                field: 'username',
                title: '登录账号'
            }, {
                field: 'contact',
                title: '联系人'
            }, {
                field: 'email',
                title: '联系方式'
            }, {
                field: 'revenue_type',
                title: '支持计费方式'
            }, {
                field: 'clients_status',
                title: '运营状态'
            }, {
                field: 'balance',
                title: '推广金',
                column_set: ['sortable']
            }, {
                field: 'gift',
                title: '赠送金',
                column_set: ['sortable']
            }, {
                field: 'total',
                title: '总余额',
                column_set: ['sortable']
            }, {
                field: 'operation_uid',
                title: '运营顾问'
            }, {
                field: 'creator_uid',
                title: '销售顾问'
            }, {
                field: 'clientid',
                title: '操作'
            }]
        },
        _oRechargeDetailColumnTitle: {
            res: 0,
            msg: '操作成功',
            obj: null,
            map: null,
            list: [{
                field: 'date',
                title: '申请时间'
            }, {
                field: 'clientname',
                title: '充值对象'
            }, {
                field: 'amount',
                title: '充值金额'
            }, {
                field: 'contact_name',
                title: '申请人'
            }, {
                field: 'status',
                title: '状态',
                column_set: ['sortable']
            }]
        },
        _oGiftDetailColumnTitle: {
            res: 0,
            msg: '操作成功',
            obj: null,
            map: null,
            list: [{
                field: 'created_at',
                title: '申请时间'
            }, {
                field: 'contact',
                title: '赠送对象'
            }, {
                field: 'amount',
                title: '赠送金额'
            }, {
                field: 'gift_info',
                title: '赠送原因',
                width: '200px'
            }, {
                field: 'contact_name',
                title: '申请人'
            }, {
                field: 'status',
                title: '状态',
                column_set: ['sortable']
            }]
        },

        _fnRun: function () {
            this._fnGetAllSales();
            // this._fnCreateTable();
        },
        _fnSetFilter: function () {
            var filter = {};
            for (var i = 0, j = this.filterAry.length; i < j; i++) {
                filter[this.filterAry[i]] = $('input[name=select_' + this.filterAry[i] + ']').val();
            }
            if (this.accountType === '1') {
                filter.broker_id = $('input[name=select_broker_brief_name]').val();
            }
            $('input[name=filter]').val(JSON.stringify(filter));
        },
        _fnGetAllSales: function () {
            var accountTypeStr = 'ADVERTISER';
            if (+this.accountType === 1) {
                accountTypeStr = 'BROKER';
            }
            var _this = this;

            // if (!this.allSales) {
            var param = {
                account_type: accountTypeStr
            };
            $.post(API_URL.manager_common_sales, param, function (json) {
                if (json && json.res === 0) {
                    _this.allSales = json.obj ? json.obj : {};
                    $.post(API_URL.manager_common_operation, param, function (json2) {
                        if (json2 && json2.res === 0) {
                            _this.allOpertions = json2.obj ? json2.obj : {};
                            _this._fnCreateTable();
                        }
                        _this = null;
                    }).fail(function () {
                        Helper.fnPrompt('服务器请求失败，请稍后重试！');
                    });
                }
            }).fail(function () {
                Helper.fnPrompt('服务器请求失败，请稍后重试！');
            });
            // }
        },

        _fnGetRevenueType: function (val) {
            var i;
            var aPl = [];
            if (val) {
                for (i = 0; i < CONSTANT.revenue_type_array.length; i++) {
                    if (+val & CONSTANT.revenue_type_array[i]) {
                        aPl.push(CONSTANT.revenue_type_array[i]);
                    }
                }
            }
            return aPl;
        },

        _fnExportRevenueTypeName: function (val) {
            var s = '';
            if (val && val.length > 0) {
                $.each(val, function (index, el) {
                    s += '<span>' + LANG.revenue_type[el] + '</span><br>';
                });
            }
            return s;
        },

        _fnCustomColumn: function (td, sData, oData, row, col, table) {
            var thisCol = table.nameList[col];
            var html = '';
            if (this.accountType === '0') {
                switch (thisCol) {
                    case 'clientname':
                        html += '<span class="table-edit clientname" data-field ="clientname" data-data="' + sData + '">全称: ' + sData + '</span>';
                        html += '<span class="table-edit brief_name" data-field ="brief_name" data-data="' + oData.brief_name + '">简称: ' + oData.brief_name + '</span>';
                        break;
                    case 'qualifications':
                        var _qualJson = sData ? JSON.parse(sData) : {};
                        html += '<span class="table-edit address" data-field ="address" data-data="' + oData.address + '">地址: ' + (oData.address ? oData.address : '-') + '</span>';
                        html += '<span class="license-edit">营业执照: '
                        + (_qualJson.business_license && _qualJson.business_license.image ? '<a class="fancybox text-warning" href="' + _qualJson.business_license.image + '" class="fancybox">查看</a>' : '-') + '<span class="img business_license" data-field ="qualifications"></span></span>';
                        html += '<span class="license-edit">网络文化经营许可证: '
                        + (_qualJson.network_business_license && _qualJson.network_business_license.image ? '<a class="fancybox text-warning" href="' + _qualJson.network_business_license.image + '" class="fancybox">查看</a>' : '-') + '<span class="img network_business_license" data-field ="qualifications"></span></span>';
                        break;
                    case 'contact':
                        html += '<span class="table-edit ' + thisCol + '" data-field ="' + thisCol + '" data-data="' + sData + '">';
                        html += sData;
                        html += '</span>';
                        break;
                    case 'email':
                        html += '<span class="table-edit email" data-field="email" data-data="' + oData.email + '">邮箱：' + oData.email + '</span>';
                        html += '<span class="table-edit contact_phone" data-field="contact_phone" data-data="' + oData.contact_phone + '">手机：' + oData.contact_phone + '</span>';
                        html += '<span class="table-edit qq" data-field="qq" data-data="' + oData.qq + '">QQ：' + oData.qq + '</span>';
                        break;
                    case 'revenue_type':
                        var aRevenueType = this._fnGetRevenueType(sData);
                        html += '<span class="table-edit ' + thisCol + '" data-field ="' + thisCol + '" data-data="' + aRevenueType + '">' + this._fnExportRevenueTypeName(aRevenueType) + '</span>';
                        break;
                    case 'operation_uid':
                        html += '<span class="table-edit ' + thisCol + '" data-data="' + sData + '" data-field ="' + thisCol + '">';
                        html += (sData ? oData.operation_username + '<br />' + oData.operation_contact_phone : '-');
                        html += '</span>';
                        break;
                    case 'creator_uid':
                        html += '<span class="table-edit ' + thisCol + '" data-data="' + sData + '" data-field ="' + thisCol + '">';
                        html += (sData ? oData.creator_username + '<br />' + oData.creator_contact_phone : '');
                        html += '</span>';
                        break;
                    case 'clients_status':
                        html += (+sData ? '运营中' : '已暂停');
                        break;
                    case 'balance':
                    case 'gift':
                    case 'total':
                        html += sData !== '' ? Helper.fnFormatMoney(sData) : '';
                        break;
                    case 'clientid':
                        if (col > 1) {
                            if (+oData.clients_status) {
                                html += '<button type="button" class="btn btn-default js-account-stop" data-clientid="' + oData.clientid + '"><i class="fa fa-pause"></i>停用</button>';
                            }
                            else {
                                html += '<button type="button" class="btn btn-default js-account-start" data-clientid="' + oData.clientid + '"><i class="fa fa-play"></i>启用</button>';
                            }
                            html += '<button type="button" class="btn btn-default js-recharge-apply" data-clientname="' + oData.clientname + '" data-clientid="' + oData.clientid + '"><i class="fa fa-cny"></i>充值申请</button>';
                            html += '<button type="button" class="btn btn-default js-recharge-detail" data-clientid="' + oData.clientid + '"><i class="fa fa-cny"></i>充值明细</button><br />';
                            html += '<button type="button" class="btn btn-default js-gift-apply" data-clientname="' + oData.clientname + '" data-clientid="' + oData.clientid + '"><i class="fa fa-gift"></i>赠送申请</button>';
                            html += '<button type="button" class="btn btn-default js-gift-detail" data-clientid="' + oData.clientid + '"><i class="fa fa-gift"></i>赠送明细</button>';
                            html += '<button type="button" class="btn btn-default js-account-login" data-user-id="' + oData.user_id + '"><i class="fa fa-user-plus"></i>登录账号</button>';
                        }
                        else {
                            html += sData;
                        }
                        break;
                    default:
                        html += sData;
                        break;
                }
            }
            else {
                switch (thisCol) {
                    case 'clientname':
                        html += '<p>全称: ' + sData + '</p>';
                        html += '<p>简称: ' + oData.brief_name + '</p>';
                        break;
                    case 'qualifications':
                        var _qualJson2 = sData ? JSON.parse(sData) : {};
                        html += '<span class="table-edit address" data-field ="address" data-data="' + oData.address + '">地址: ' + (oData.address ? oData.address : '-') + '</span>';
                        html += '<span class="license-edit">营业执照: '
                        + (_qualJson2.business_license && _qualJson2.business_license.image ? '<a class="fancybox text-warning" href="' + _qualJson2.business_license.image + '" class="fancybox">查看</a>' : '-') + '<span class="img business_license" data-field ="qualifications"></span></span>';
                        html += '<span class="license-edit">网络文化经营许可证: '
                        + (_qualJson2.network_business_license && _qualJson2.network_business_license.image ? '<a class="fancybox text-warning" href="' + _qualJson2.network_business_license.image + '" class="fancybox">查看</a>' : '-') + '<span class="img network_business_license" data-field ="qualifications"></span></span>';
                        break;
                    case 'email':
                        html += '<p>邮箱：' + oData.email + '</p>';
                        html += '<p>手机：' + oData.contact_phone + '</p>';
                        html += '<p>QQ：' + oData.qq + '</p>';
                        break;
                    case 'operation_uid':
                        html += (sData ? oData.operation_username + '<br />' + oData.operation_contact_phone : '-');
                        break;
                    case 'creator_uid':
                        html += (sData ? oData.creator_username + '<br />' + oData.creator_contact_phone : '');
                        break;
                    case 'clients_status':
                        html += (+sData ? '运营中' : '已暂停');
                        break;
                    case 'balance':
                    case 'gift':
                        html += sData !== '' ? Helper.fnFormatMoney(sData) : '';
                        break;
                    case 'revenue_type':
                        html += this._fnExportRevenueTypeName(this._fnGetRevenueType(sData));
                        break;
                    case 'clientid':
                        if (col > 1) {
                            if (+oData.clients_status) {
                                html += '<button type="button" class="btn btn-default js-account-stop" data-clientid="' + oData.clientid + '"><i class="fa fa-pause"></i>停用</button>';
                            }
                            else {
                                html += '<button type="button" class="btn btn-default js-account-start" data-clientid="' + oData.clientid + '"><i class="fa fa-play"></i>启用</button>';
                            }
                            html += '<button type="button" class="btn btn-default js-account-login" data-user-id="' + oData.user_id + '"><i class="fa fa-user-plus"></i>登录账号</button>';
                        }
                        else {
                            html += sData;
                        }
                        break;
                    default:
                        html += sData;
                        break;
                }
            }

            $(td).html(html);
        },
        _fnBindSelect: function (mData, obj) {
            var self = this;
            $('<select data-name="select_' + mData + '"><option value="">所有</option></select>').appendTo(obj).on('change', function (evt) {
                evt.stopPropagation();
                $('input[name=' + $(this).attr('data-name') + ']').val($(this).val());
                self._fnSetFilter();
                window.advTable.reload();
            }).on('focus', function (evt) {
                $(this).val($('input[name=' + $(this).attr('data-name') + ']').val());
            });
        },
        _fnCreateSelect: function (element, json) { // 创建select
            var options = '';
            for (var key in json) {
                options += '<option value="' + key + '">' + json[key] + '</option>';
            }
            element.append(options);
        },
        _fnInitComplete: function (settings, json, obj) {
            var self = this;
            var aoColumns = settings.aoColumns;
            var api = obj.api();
            for (var i = 0, j = aoColumns.length; i < j; i++) {
                var mData = aoColumns[i].mData;
                if (mData === 'revenue_type' || mData === 'clients_status' || mData === 'creator_uid' || mData === 'broker_brief_name' || mData === 'operation_uid') {
                    var column = api.column(i);
                    var $span = $('<span class="addselect">▾</span>').appendTo($(column.header()));
                    self._fnBindSelect(mData, $span);
                }
            }
            if ($('select[data-name=select_revenue_type]') && $('select[data-name=select_revenue_type]').length > 0) { // 获取计费方式
                self._fnCreateSelect($('select[data-name=select_revenue_type]'), LANG.revenue_type);
            }
            if ($('select[data-name=select_clients_status]') && $('select[data-name=select_clients_status]').length > 0) { // 获取运营状态
                self._fnCreateSelect($('select[data-name=select_clients_status]'), LANG.affiliates_status);
            }
            $.get(API_URL.manager_advertiser_filter + '?type=' + self.accountType, function (json) {
                if ($('select[data-name=select_creator_uid]') && $('select[data-name=select_creator_uid]').length > 0) { // 获取销售顾问
                    self._fnCreateSelect($('select[data-name=select_creator_uid]'), json.obj.creator_uid);
                }
                if ($('select[data-name=select_operation_uid]') && $('select[data-name=select_operation_uid]').length > 0) { // 获取销售顾问
                    self._fnCreateSelect($('select[data-name=select_operation_uid]'), json.obj.operation_uid);
                }
                if ($('select[data-name=select_broker_brief_name]') && $('select[data-name=select_broker_brief_name]').length > 0) { // 获取代理商简称
                    self._fnCreateSelect($('select[data-name=select_broker_brief_name]'), json.obj.broker_id);
                }
            });
        },
        _fnCreateTable: function () {
            if (!this.allSales) {
                return;
            }
            if (typeof window.advTable === 'object') {
                window.advTable.destroy();
                $('#advertiser-table').empty();
            }
            var _this = this;
            var columnTitle = $.extend({}, _this._oColumnTitle);
            if (this.accountType === '1') {
                columnTitle.list = columnTitle.list.slice(0); // 克隆数组，不修改原数组
                columnTitle.list[11] = {
                    field: 'broker_brief_name',
                    title: '代理商'
                };
            }
            Helper.fnCreatTable('#advertiser-table', columnTitle, API_URL.manager_advertiser_index, function (td, sData, oData, row, col, table) {
                _this._fnCustomColumn(td, sData, oData, row, col, table);
            }, 'advTable', {
                postData: {
                    type: this.accountType,
                    filter: function () {
                        return $('input[name=filter]').val();
                    }
                },
                fnDrawCallback: function () {
                    _this._fnTableEdit(); // 表格编辑
                },
                fnInitComplete: function (settings, json) {
                    _this._fnInitComplete(settings, json, this);
                }
            });
            $('.fancybox').fancybox();
        },

        _fnTableEdit: function () {
            var _this = this;
            var defaults = {
                type: 'text',
                title: '修改账户信息',
                url: API_URL.manager_advertiser_update,
                params: function () {
                    return {
                        clientid: window.advTable.row($(this).parents('tr')[0]).data().clientid,
                        field: $(this).attr('data-field')
                    };
                },
                success: function (response) {
                    if (!response.res) {
                        window.advTable.reload();
                    }
                    else {
                        Helper.fnPrompt(response.msg);
                    }
                }
            };

            var option = {};
            $('#advertiser-table .table-edit').each(function (index, el) {
                option = {};
                if ($(this).hasClass('clientname') || $(this).hasClass('brief_name') || $(this).hasClass('contact_name')) {
                    option = {
                        value: $(this).attr('data-data'),
                        validate: function (value) {
                            if ($.trim(value) === '') {
                                return '不能为空';
                            }
                        }
                    };
                }
                else if ($(this).hasClass('email')) {
                    option = {
                        value: $(this).attr('data-data'),
                        validate: function (value) {
                            if ($.trim(value) === '' || !Helper.fnIsEmail(value)) {
                                return '请输入正确的邮箱';
                            }
                        }
                    };
                }
                else if ($(this).hasClass('contact_phone')) {
                    option = {
                        value: $(this).attr('data-data'),
                        validate: function (value) {
                            if ($.trim(value) === '') {
                                return '不能为空';
                            }
                        }
                    };
                }
                else if ($(this).hasClass('qq')) {
                    option = {
                        value: $(this).attr('data-data')
                    };
                }
                else if ($(this).hasClass('operation_uid')) {
                    var allOpertions = _this.allOpertions;
                    var oSource = [];
                    for (var oKey in allOpertions) {
                        oSource.push({
                            value: oKey,
                            text: allOpertions[oKey]
                        });
                    }
                    option = {
                        type: 'select',
                        source: oSource,
                        value: $(this).attr('data-data')
                    };
                }
                else if ($(this).hasClass('creator_uid')) {
                    var allSales = _this.allSales;
                    var source = [];
                    for (var key in allSales) {
                        source.push({
                            value: key,
                            text: allSales[key]
                        });
                    }
                    option = {
                        type: 'select',
                        source: source,
                        value: $(this).attr('data-data')
                    };
                }
                else if ($(this).hasClass('revenue_type')) {
                    option = {
                        type: 'revenuetype',
                        title: '修改计费类型',
                        value: $(this).attr('data-data'),
                        source: LANG.revenue_type,
                        params: function () {
                            var nRevenue = 0;
                            $('input[type="checkbox"][name="checklist"]:checked').each(function (index, el) {
                                nRevenue += +$(this).val();
                            });
                            return {
                                clientid: window.advTable.row($(this).parents('tr')[0]).data().clientid,
                                value: nRevenue,
                                field: 'revenue_type'
                            };
                        }
                    };
                }
                else if ($(this).hasClass('address')) {
                    option = {
                        value: $(this).attr('data-data')
                    };
                }
                $(this).editable($.extend({}, defaults, option));
            });
            var licenseOption = {
                type: 'licenseedit',
                value: function () {
                    return window.advTable.row($(this).parents('tr')[0]).data().qualifications;
                }
            };
            $('#advertiser-table .license-edit .img').each(function (index, el) {
                if ($(this).hasClass('business_license')) {
                    licenseOption = $.extend(licenseOption, {
                        field: 'business_license',
                        title: '修改营业执照'
                    });
                }
                else if ($(this).hasClass('network_business_license')) {
                    licenseOption = $.extend(licenseOption, {
                        field: 'network_business_license',
                        title: '修改网络文化经营许可证'
                    });
                }
                $(this).editable($.extend({}, defaults, licenseOption));
            });
        },

        _fnToggleAccountStatus: function (clientid, status) {
            this._fnAccountUpdate(clientid, 'clients_status', status, function (json) {
                if (json === -1) {
                    Helper.fnAlert('服务器请求失败，请稍后重试');
                }
                else if (0 === json.res) {
                    window.advTable.reload();
                }
                else {
                    Helper.fnPrompt(json.msg);
                }
            });
        },

        _fnAccountUpdate: function (id, field, value, callback) {
            var param = {
                clientid: id,
                field: field,
                value: value
            };
            Helper.load_ajax();
            $.post(API_URL.manager_advertiser_update, param, function (json) {
                Helper.close_ajax();
                callback(json);
            }).fail(function () {
                Helper.close_ajax();
                callback(-1);
            });
        },
        _fnOpenAddAccountPannel: function () {
            $('#add-account-container').html($.tmpl('#tpl-addaccount', {
                allOpertions: this.allOpertions,
                allSales: this.allSales,
                revenue_type: LANG.revenue_type
            }));
            $('#add-account-panel').modal({
                backdrop: 'static',
                show: true
            });
            $('#add-account-container').validation({
                blur: false
            });
            ['business_license', 'network_business_license'].forEach(function (item, index) { // 上传图片
                $.fn.advutils.fnUploadLicense(item);
            });
            $('.fancybox').fancybox();
        },

        _fnAddAccount: function () {
            if (!$('#add-account-container').valid()) {
                return false;
            }
            var revenue_type_val = 0;
            $('input[name="revenue_type"]:checked').each(function (index, el) {
                revenue_type_val += +$(this).val();
            });
            var businessLicense = $('#business_license').next('.js-show-license').find('img').attr('src');
            businessLicense = businessLicense ? businessLicense : '';
            var nextworkBusiLicense = $('#network_business_license').next('.js-show-license').find('img').attr('src');
            nextworkBusiLicense = nextworkBusiLicense ? nextworkBusiLicense : '';
            var param = {
                clientname: $('#client-name').val(),
                brief_name: $('#brief-name').val(),
                username: $('#act-username').val(),
                password: $('#password').val(),
                contact: $('#contact-name').val(),
                email: $('#email-address').val(),
                contact_phone: $('#phone').val(),
                qq: $('#qq').val(),
                operation_uid: $('#select-operation').val(),
                creator_uid: $('#select-creator').val(),
                revenue_type: revenue_type_val,
                address: $('#address').val(),
                qualifications: JSON.stringify({business_license: businessLicense, network_business_license: nextworkBusiLicense})
            };
            Helper.load_ajax();
            $.post(API_URL.manager_advertiser_store, param, function (json) {
                Helper.close_ajax();
                if (0 === json.res) {
                    $('#add-account-panel').modal('hide');
                    window.advTable.reload();
                }
                else {
                    Helper.fnPrompt(json.msg);
                }
            }).fail(function () {
                Helper.close_ajax();
                Helper.fnAlert('服务器请求失败，请稍后重试');
            });
        },

        _fnOpenRechargeApplyPanel: function ($ele) {
            var clientId = $ele.attr('data-clientid');
            var clientName = $ele.attr('data-clientname');
            var $panel = $('#recharge-apply-panel');
            $panel.find('.error-msg').remove();
            var $form = $panel.find('form').validation({
                blur: false
            });
            $form[0].reset();
            $('#recharge-client').val(clientName).attr('data-clientid', clientId);
            $('#recharge-date').datepicker('setDate', new Date());
            $panel.modal({
                backdrop: 'static',
                show: true
            });
        },

        _fnRechargeApply: function () {
            if (!$('#recharge-apply-panel form').valid()) {
                return false;
            }
            var param = {
                clientid: $('#recharge-client').attr('data-clientid'),
                way: $('#select-recharge-type').val(),
                account_info: $('#recharge-account').val(),
                date: $('#recharge-date').val(),
                amount: +$('#recharge-amount').val()
            };

            Helper.load_ajax();
            $.post(API_URL.manager_advertiser_recharge_apply, param, function (json) {
                Helper.close_ajax();
                if (0 === json.res) {
                    Helper.fnPrompt('充值成功');
                    $('#recharge-apply-panel').modal('hide');
                }
                else {
                    Helper.fnPrompt(json.msg);
                }
            }).fail(function () {
                Helper.close_ajax();
                Helper.fnAlert('服务器请求失败，请稍后重试');
            });
        },

        _fnOpenRechargeDetailPanel: function ($ele) {
            if (typeof window.rechargeDetailTable === 'object') {
                window.rechargeDetailTable.destroy();
                $('#recharge-detail-table').empty();
            }
            var _this = this;
            var clientid = $ele.attr('data-clientid');
            $('#recharge-apply-detail-panel').modal({
                backdrop: 'static',
                show: true
            }).off('shown.bs.modal').on('shown.bs.modal', function () {
                Helper.fnCreatTable('#recharge-detail-table', _this._oRechargeDetailColumnTitle, API_URL.manager_advertiser_recharge_detail, function (td, sData, oData, row, col, table) {
                    _this._fnRechargeDetailColumn(td, sData, oData, row, col, table);
                }, 'rechargeDetailTable', {
                    searching: false,
                    scrollY: '500px',
                    scrollCollapse: true,
                    fixedHeader: false,
                    postData: {
                        clientid: clientid
                    },
                    fnDrawCallback: function () {
                        $('#recharge-detail-table [data-toggle="tooltip"]').tooltip({
                            placement: 'left',
                            trigger: 'hover'
                        });
                    }
                });
            });
        },

        _fnRechargeDetailColumn: function (td, sData, oData, row, col, table) {
            var thisCol = table.nameList[col];
            var html = '';
            switch (thisCol) {
                case 'amount':
                    html += '<span class="text-success">￥' + Helper.fnFormatMoney(sData) + '</span>';
                    break;
                case 'status':
                    if (sData === 1) {
                        html += '待审核';
                    }
                    else if (sData === 2) {
                        html += '<span class="text-success">审核通过</span>';
                    }
                    else if (sData === 3) {
                        html += '<span data-toggle="tooltip" title="' + oData.comment + '" class="text-danger">已驳回 </span><i class="fa fa-warning"></i>';
                    }
                    else {
                        html += sData;
                    }
                    break;
                default:
                    html += sData;
                    break;
            }
            $(td).html(html);
        },

        _fnOpenGiftApplyPanel: function ($ele) {
            var clientId = $ele.attr('data-clientid');
            var clientName = $ele.attr('data-clientname');
            var $panel = $('#gift-apply-panel');
            $panel.find('.error-msg').remove();
            var $form = $panel.find('form').validation({
                blur: false
            });
            $form[0].reset();
            $('#gift-client').val(clientName).attr('data-clientid', clientId);
            $panel.modal({
                backdrop: 'static',
                show: true
            });
        },

        _fnGiftApply: function () {
            if (!$('#gift-apply-panel form').valid()) {
                return false;
            }
            var param = {
                clientid: $('#gift-client').attr('data-clientid'),
                amount: +$('#gift-amount').val(),
                gift_info: $('#gift-info').val()
            };

            Helper.load_ajax();
            $.post(API_URL.manager_advertiser_gift_apply, param, function (json) {
                Helper.close_ajax();
                if (0 === json.res) {
                    Helper.fnPrompt('赠送成功');
                    $('#gift-apply-panel').modal('hide');
                }
                else {
                    Helper.fnPrompt(json.msg);
                }
            }).fail(function () {
                Helper.close_ajax();
                Helper.fnAlert('服务器请求失败，请稍后重试');
            });
        },

        _fnOpenGiftDetailPanel: function ($ele) {
            if (typeof window.giftDetailTable === 'object') {
                window.giftDetailTable.destroy();
                $('#gift-detail-table').empty();
            }
            var _this = this;
            var clientid = $ele.attr('data-clientid');
            $('#gift-apply-detail-panel').modal({
                backdrop: 'static',
                show: true
            }).off('shown.bs.modal').on('shown.bs.modal', function () {
                Helper.fnCreatTable('#gift-detail-table', _this._oGiftDetailColumnTitle, API_URL.manager_advertiser_gift_detail, function (td, sData, oData, row, col, table) {
                    _this._fnGiftDetailColumn(td, sData, oData, row, col, table);
                }, 'giftDetailTable', {
                    searching: false,
                    scrollY: '500px',
                    scrollCollapse: true,
                    fixedHeader: false,
                    postData: {
                        clientid: clientid
                    },
                    fnDrawCallback: function () {
                        $('#gift-detail-table [data-toggle="tooltip"]').tooltip({
                            placement: 'left',
                            trigger: 'hover'
                        });
                    }
                });
            });
        },

        _fnGiftDetailColumn: function (td, sData, oData, row, col, table) {
            var thisCol = table.nameList[col];
            var html = '';
            switch (thisCol) {
                case 'amount':
                    html += '<span class="text-success">￥' + Helper.fnFormatMoney(sData) + '</span>';
                    break;
                case 'status':
                    if (sData === 1) {
                        html += '待审核';
                    }
                    else if (sData === 2) {
                        html += '<span class="text-success">审核通过</span>';
                    }
                    else if (sData === 3) {
                        html += '<span data-toggle="tooltip" title="' + oData.gift_info + '" class="text-danger">已驳回 </span><i class="fa fa-warning"></i>';
                    }
                    else {
                        html += sData;
                    }
                    break;
                default:
                    html += sData;
                    break;
            }
            $(td).html(html);
        },

        _fnAutoComplete: function ($ele) {
            var param = {
                clientid: $('#recharge-client').attr('data-clientid'),
                way: $('#select-recharge-type').val()
            };
            $.post(API_URL.manager_advertiser_recharge_history, param, function (json) {
                if (0 === json.res) {
                    var list = json.list ? json.list : [];
                    var i = 0;
                    var l = list.length;
                    if (l > 0) {
                        var $ele = $('#recharge-account-auto-list');
                        var html = '';
                        for (; i < l; i++) {
                            html += '<li>' + list[i].account_info + '</li>';
                        }
                        $ele.html(html).show();
                    }
                }
            });
        },

        _fnLoginAccount: function ($ele) {
            var userId = $ele.attr('data-user-id');
            var tmp = window.open('');
            $.post(API_URL.site_change, {
                id: userId
            }, function (json) {
                if (json && json.res === 0) {
                    tmp.location.href = BOS.DOCUMENT_URI + '/advertiser';
                }
                else {
                    tmp.location.href = API_URL.login_url;
                }
            }).fail(function () {
                tmp.location.href = API_URL.login_url;
            });
        },

        // 菜单导航点击事件主体
        _fnChangeMenu: function ($ele) {
            var accountType = $ele.attr('data-account-type');
            if (accountType === '0') {
                $('#addaccount-btn-wrapper').show();
            }
            else if (accountType === '1') {
                $('#addaccount-btn-wrapper').hide();
            }
            else {
                location.href = './broker.html';
                return;
            }
            location.hash = 'accountType=' + accountType;
            $ele.siblings().removeClass('active');
            $ele.addClass('active');
            this.accountType = accountType;
            for (var i = 0, j = this.filterAry.length; i < j; i++) {
                $('select[data-name=select_' + this.filterAry[i] + ']').val('');
                $('input[name=select_' + this.filterAry[i] + ']').val('');
            }
            if (accountType === '1') {
                $('select[data-name=select_broker_brief_name]').val('');
                $('input[name=select_broker_brief_name]').val('');
            }
            $('input[name=filter]').val('');
            this._fnRun();
        },

        _renderMenu: function () {
            var _this = this;
            /* eslint no-undef: [0]*/
            fnIsLogin(function (json) {
                if (json && json.res === 0) {
                    var html = '';
                    var operationList = json.obj.operation_list;
                    if (operationList.indexOf(OPERATION_LIST.manager_advertiser) > -1) {
                        html += '<li data-account-type="0"><a href="javascript:void(0);">直客广告主</a></li>';
                        html += '<li data-account-type="1"><a href="javascript:void(0);">代理获客广告主</a></li>';
                    }
                    if (operationList.indexOf(OPERATION_LIST.manager_broker) > -1) {
                        html += '<li data-account-type="2"><a href="javascript:void(0);">代理商</a></li>';
                    }
                }
                $('#accout-type-wrapper').html(html);
                $('#accout-type-wrapper [data-account-type="' + _this.accountType + '"]').trigger('click');
                _this = null;
            });
        },
        fnInit: function (accountType) {
            var _this = this;
            switch (accountType) {
                case '0':
                case '1':
                    this.accountType = accountType;
                    break;
                default:
                    break;
            }
            var $advTableWrapper = $('#advertiser-table-wrapper');
            $advTableWrapper.on('click', '.js-account-stop', function () {
                _this._fnToggleAccountStatus($(this).attr('data-clientid'), 0);
            });

            $advTableWrapper.on('click', '.js-account-start', function () {
                _this._fnToggleAccountStatus($(this).attr('data-clientid'), 1);
            });

            $advTableWrapper.on('click', '.js-recharge-apply', function () {
                _this._fnOpenRechargeApplyPanel($(this));
            });

            $advTableWrapper.on('click', '.js-recharge-detail', function () {
                _this._fnOpenRechargeDetailPanel($(this));
            });

            $advTableWrapper.on('click', '.js-gift-apply', function () {
                _this._fnOpenGiftApplyPanel($(this));
            });

            $advTableWrapper.on('click', '.js-gift-detail', function () {
                _this._fnOpenGiftDetailPanel($(this));
            });

            $advTableWrapper.on('click', '.js-account-login', function () {
                _this._fnLoginAccount($(this));
            });

            $('#recharge-apply').click(function () {
                _this._fnRechargeApply();
            });

            $('#gift-apply').click(function () {
                _this._fnGiftApply();
            });

            $('#addaccount-btn').click(function () {
                _this._fnOpenAddAccountPannel();
            });

            $('#add-account-confirm').click(function () {
                _this._fnAddAccount();
            });

            $('#recharge-account').on('focus', function () {
                _this._fnAutoComplete($(this));
            });

            $('#recharge-account').on('blur', function () {
                setTimeout(function () {
                    $('#recharge-account-auto-list').hide().html('');
                }, 200);
            });

            $('#recharge-account-auto-list').on('click', 'li', function () {
                $('#recharge-account').val($(this).html());
                $('#recharge-account-auto-list').hide();
            });

            $('#accout-type-wrapper').on('click', '[data-account-type]', function () {
                _this._fnChangeMenu($(this));
            });

            $('input[type="number"]').on('input propertychange', function () {

            });
            // 充值金额，赠送金额限制
            $('#recharge-amount, #gift-amount').on('input propertychange', function () {
                Helper.fnInputCheckNumber(this);
                var value = +this.value;
                if (value >= 100000000) {
                    $(this).val('99999999');
                }
                else if (value < 0) {
                    $(this).val(Math.abs(value));
                }
            });
            // 删除资质
            $.fn.advutils.fnRemoveImg($('#add-account-panel'));
            this._renderMenu();
        }
    };
    return new ManagerAdvertiser();
})(jQuery);

$(function () {
    var accountType = Helper.fnGetHashParam('accountType');
    ManagerAdvertiser.fnInit(accountType);
});
