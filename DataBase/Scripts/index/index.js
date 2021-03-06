﻿ var tab = null;
var accordion = null;
var tree = null;
var menu;
var dbUrl = location.protocol + "//" + location.host + '/Home/DataBaseJson';
var tableUrl = location.protocol + "//" + location.host + '/Home/TablesJson/';
var rowUrl = location.protocol + "//" + location.host + '/Home/RowsJson/';
var gridUrl = location.protocol + "//" + location.host + '/Home/RowsGrid/';

$(function () { 
    //布局
    $("#layout1").ligerLayout({ leftWidth: 190, height: '100%', heightDiff: -34, space: 4, onHeightChanged: f_heightChanged });

    var height = $(".l-layout-center").height(); 
    //Tab
    $("#framecenter").ligerTab({ height: height }); 
    //面板
    //$("#accordion1").ligerAccordion({ height: height - 24, speed: null });

    $(".l-link").hover(function () {
        $(this).addClass("l-link-over");
    }, function () {
        $(this).removeClass("l-link-over");
    });

    $("#toptoolbar").ligerToolBar({
        items: [
                    {
                        text: '增加', click: function (item) {
                            alert(item.text);
                        }, icon: 'add'
                    },
                    { line: true },
                    { text: '删除', click: itemclick }
        ]
    });

    $("#tree1").ligerTree({
        checkbox: false,
         slide: true,
         nodeWidth: 120,
        btnClickToToggleOnly :false,
       // treeLine: false,
        idFieldName: 'id', 
        textFieldName: 'name',
        url: dbUrl,
        isLeaf: function (data) {
            if (!data) return false;
            return data.type == "table";
        },
        delay: function (e) {
            var data = e.data;
            if (data.type == "database") {
                return { url: tableUrl + data.name }
            } else if (data.type == "table") {
                return { url: rowUrl + data.databaseName + '/' + data.name }
            }
            return true;
        },
        onSelect: SelectNode
    });

    menu = $.ligerMenu({
        top: 100, left: 100, width: 120, items:
                    [
                    { text: '设计', click: SelectNode },
                    { text: '查看', click: SelectNode }
                    ]
    });

    $("#tree1").bind("contextmenu", function (e) {
        menu.show({ top: e.pageY, left: e.pageX });
        return false;

    });

    tab = $("#framecenter").ligerGetTabManager();
    accordion = $("#accordion1").ligerGetAccordionManager();
    tree = $("#tree1").ligerGetTreeManager();
    $("#pageloading").hide();

});
function f_heightChanged(options) {
    if (tab)
        tab.addHeight(options.diff);
    if (accordion && options.middleHeight - 24 > 0)
        accordion.setHeight(options.middleHeight - 24);
}
function f_addTab(tabid, text, url) {
    tab.addTabItem({ tabid: tabid, text: text, url: url });
}

function SelectNode(node) {
    if (node.data.type == "database") return;
    var tabid = $(node.target).attr("tabid");
    if (!tabid) {
        tabid = new Date().getTime();
        $(node.target).attr("tabid", tabid)
    }
    f_addTab(tabid, node.data.name, gridUrl + node.data.databaseName + "/" + node.data.name);
}

function itemclick(item) {
    alert(item.text);
}

function f_open() {
    $.ligerDialog.open({
        url: '../../welcome.htm', height: 300, width: null, buttons: [
            { text: '确定', onclick: function (item, dialog) { alert(item.text); } },
            { text: '取消', onclick: function (item, dialog) { dialog.close(); } }
        ], isResize: true
    });
}