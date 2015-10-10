﻿$(function () {
    treeTableObj = $("ul[data-name='treeTable']"); //表
    treeViewObj = $("ul[data-name='treeView']"); //视图
    treeProcedureObj = $("ul[data-name='treeProcedure']"); //存储过程

    //布局
    $("#layout1").ligerLayout({ leftWidth: 260, height: '100%', heightDiff: -34, space: 4, onHeightChanged: indexObj.heightChanged });

    var height = $(".l-layout-center").height();
    //Tab
    $("#framecenter").ligerTab({ height: height });
    //面板
    $("#accordion1").ligerAccordion({ height: height - 24, speed: null });

    $(".l-link").hover(function () {
        $(this).addClass("l-link-over");
    }, function () {
        $(this).removeClass("l-link-over");
    });

    indexObj.init();
    indexObj.treeResize();

    menu = $.ligerMenu({
        top: 100, left: 100, width: 120, items:
                    [
                    { text: '设计', click: indexObj.design },
                    { text: '查看', click: indexObj.search }
                    ]
    });
    tab = $("#framecenter").ligerGetTabManager();
    accordion = $("#accordion1").ligerGetAccordionManager();

    $("#pageloading").hide();
});
var tab, menu, actionNode, accordion, treeViewObj, treeTableObj, treeProcedureObj;
var indexObj = indexObj || {};
 

; (function ($) { 
    $.extend(indexObj, {   
        dbUrl: location.protocol + "//" + location.host + '/Sider/SiderDatabase/'
        , tableUrl: location.protocol + "//" + location.host + '/Sider/TablesJson/'
        , rowUrl: location.protocol + "//" + location.host + '/Home/RowsJson/'
        , gridUrl: location.protocol + "//" + location.host + '/Home/RowsGrid/'
        , searchUrl: location.protocol + "//" + location.host + '/Home/Select/'
        , viewsUrl: location.protocol + "//" + location.host + '/Sider/ViewsJson/'
        , procedureUrl: location.protocol + "//" + location.host + '/Sider/ProcedureJson/'
        , viewDesignUrl: location.protocol + "//" + location.host + '/Design/ViewDesign/'
        , procedureDesignUrl: location.protocol + "//" + location.host + '/Design/ProcedureDesign/'
        , init: function () { //初始化
            $(window).unbind("resize.indexObj").bind("resize.indexObj",indexObj.treeResize);
            $(".dbname").unbind("change.indexObj").bind("change.indexObj", function () { 
                var _this = this;
                var index = $(_this).parent().parent().attr("data-index");
                var databasename = $(_this).children("option:selected").val();
               
                $("ul[data-name='treeTable']").eq(index).html("");
                $("ul[data-name='treeView']").eq(index).html("");
                $("ul[data-name='treeProcedure']").eq(index).html("");

                if (databasename) {
                    var className = $(_this).parent().next().children(".siderView").children("div[data-selectd='1']").attr("data-fun"); //选中了哪个标签样式名称
                   
                    switch (className) {
                        case "table":
                            indexObj.buildTableTree(index, databasename);
                            break;
                        case "view":
                            indexObj.buildViewTree(index, databasename);
                            break;
                        case "function":
                            indexObj.buildProcedureTree(index, databasename);
                            break;
                    }
                }             
            })
            $(".siderView .siderViewTable").unbind("click.indexObj").bind("click.indexObj", function () {
                var _this = this;                
                var dbName = $(_this).parent().parent().prev().children(".dbname").children("option:selected").val();
                var content = $(_this).parent().parent().children(".treeView").children("ul[data-name='treeTable']").html(); //内容
                var scrollIndex = $(_this).parent().parent().parent().attr("data-index"); //所有位置标号

                $(_this).parent().children().removeClass("selected");
                $(_this).parent().children(".siderViewTable").addClass("selected");
               
                $(_this).parent().children(".siderViewTable").attr("data-selectd", "1");
                $(_this).parent().children(".siderViewView").attr("data-selectd", "0");
                $(_this).parent().children(".siderViewFunction").attr("data-selectd", "0");

                $(_this).parent().parent().children(".treeView").show();
                $(_this).parent().parent().children(".tableView").hide();
                $(_this).parent().parent().children(".procedure").hide();
               
                //有选择数据库才进行处理
                if (dbName&&!content) {
                    indexObj.buildTableTree(scrollIndex, dbName);
                }
            })
            $(".siderView .siderViewView").unbind("click.indexObj").bind("click.indexObj", function () {
                var _this = this;
                var dbName = $(_this).parent().parent().prev().children(".dbname").children("option:selected").val();
                var content = $(_this).parent().parent().children(".tableView").children("ul[data-name='treeView']").html(); //内容
                var scrollIndex = $(_this).parent().parent().parent().attr("data-index"); //所有位置标号

                $(_this).parent().children().removeClass("selected");
                $(_this).parent().children(".siderViewView").addClass("selected");

                $(_this).parent().children(".siderViewTable").attr("data-selectd", "0");
                $(_this).parent().children(".siderViewView").attr("data-selectd", "1");
                $(_this).parent().children(".siderViewFunction").attr("data-selectd", "0");

                $(_this).parent().parent().children(".treeView").hide();
                $(_this).parent().parent().children(".tableView").show();
                $(_this).parent().parent().children(".procedure").hide();

                //有选择数据库才进行处理
                if (dbName && !content) {
                    indexObj.buildViewTree(scrollIndex, dbName);
                }
            })
            $(".siderView .siderViewFunction").unbind("click.indexObj").bind("click.indexObj", function () {
                var _this = this;
                var dbName = $(_this).parent().parent().prev().children(".dbname").children("option:selected").val();
                var content = $(_this).parent().parent().children(".procedure").children("ul[data-name='treeProcedure']").html(); //内容
                var scrollIndex = $(_this).parent().parent().parent().attr("data-index"); //所有位置标号

                $(_this).parent().children().removeClass("selected");
                $(_this).parent().children(".siderViewFunction").addClass("selected");

                $(_this).parent().children(".siderViewTable").attr("data-selectd", "0");
                $(_this).parent().children(".siderViewView").attr("data-selectd", "0");
                $(_this).parent().children(".siderViewFunction").attr("data-selectd", "1");

                $(_this).parent().parent().children(".treeView").hide();
                $(_this).parent().parent().children(".tableView").hide();
                $(_this).parent().parent().children(".procedure").show();

                //有选择数据库才进行处理
                if (dbName && !content) {
                    indexObj.buildProcedureTree(scrollIndex, dbName);
                }
            })
        }
        , SelectNode: function (node) {
            if (node.data && node.data.type == "database") return;
            var type = node.data.type;
            var tabid = $(node.target).attr("tabid");
            if (!tabid) {
                tabid = new Date().getTime();
                $(node.target).attr("tabid", tabid)
            }
            if (type == "table") {
                indexObj.addTab(tabid, node.data.Name, indexObj.gridUrl + node.data.databaseName + "/" + node.data.Name + "?connectionStringName=" + node.data.connName);
            }
            else if(type=="view") {
                indexObj.addTab(tabid, node.data.Name, indexObj.viewDesignUrl + node.data.databaseName + "/" + node.data.Name + "?connectionStringName=" + node.data.connName);
            }
            else if (type == "procedure") {
                indexObj.addTab(tabid, node.data.Name, indexObj.procedureDesignUrl + node.data.databaseName + "/" + node.data.Name + "?connectionStringName=" + node.data.connName);
            }
        }
        , buildTableTree: function (index, databaseName) {    //表格      
            var tree = $(treeTableObj[index]);
            var connName = tree.attr("data-connName");
            tree.ligerTree({
                checkbox: false,
                slide: true,
                nodeWidth: 250,
                btnClickToToggleOnly: false,
                // treeLine: false,
                idFieldName: 'Id',
                textFieldName: 'Name',
                url: indexObj.tableUrl + "?dbName=" + databaseName + "&connectionStringName=" + connName,
                isLeaf: function (data) {
                    if (!data) return false;
                    return data.type == "table";
                },
                delay: function (e) {
                    var data = e.data;
                    if (data.type == "database") {
                        return { url: indexObj.tableUrl + "?dbName=" + data.name + "&connectionStringName=" + e.data.connName }
                    } else if (data.type == "table") {
                        return { url: indexObj.rowUrl + data.databaseName + '/' + data.name + "?connectionStringName=" + e.data.connName }
                    }
                    return true;
                },
                onSelect: indexObj.SelectNode,
                onContextmenu: function (node, e) {
                    if (node.data && node.data.type == "database") return;
                    actionNode = node;
                    menu.show({ top: e.pageY, left: e.pageX });
                    return false;
                }
            });
        }
        , buildViewTree: function(index,databaseName) { //视图
            var tree = $(treeViewObj[index]);
            var connName = tree.attr("data-connName"); 
            tree.ligerTree({
                checkbox: false,
                slide: true,
                nodeWidth: 250,
                btnClickToToggleOnly: false,
                // treeLine: false,
                idFieldName: 'Id',
                textFieldName: 'Name',
                url: indexObj.viewsUrl + "?dbName=" + databaseName + "&connectionStringName=" + connName,
                isLeaf: function (data) {
                    if (!data) return false;
                    return data.type == "view";
                },
                delay: function (e) {
                    var data = e.data;
                    if (data.type == "database") {
                        return { url: indexObj.tableUrl + "?dbName=" + data.name + "&connectionStringName=" + e.data.connName }
                    } else if (data.type == "table") {
                        return { url: indexObj.rowUrl + data.databaseName + '/' + data.name + "?connectionStringName=" + e.data.connName }
                    }
                    return true;
                },
                onSelect: indexObj.SelectNode,
                onContextmenu: function (node, e) {
                    if (node.data && node.data.type == "database") return;
                    actionNode = node;
                    menu.show({ top: e.pageY, left: e.pageX });
                    return false;
                }
            });
        }
        , buildProcedureTree: function (index, databaseName) {
            var tree = $(treeProcedureObj[index]);
            var connectionName = tree.attr("data-connName");

            tree.ligerTree({
                checkbox: false,
                slide: true,
                nodeWidth: 250,
                btnClickToToggleOnly: false,
                // treeLine: false,
                idFieldName: 'Id',
                textFieldName: 'Name',
                url: indexObj.procedureUrl + "?dbName=" + databaseName + "&connectionStringName=" + connectionName,
                isLeaf: function (data) {
                    if (!data) return false;
                    return data.type == "procedure";
                },
                delay: function (e) {
                    var data = e.data;
                    if (data.type == "database") {
                        return { url: indexObj.tableUrl + "?dbName=" + data.name + "&connectionStringName=" + e.data.connName }
                    } else if (data.type == "table") {
                        return { url: indexObj.rowUrl + data.databaseName + '/' + data.name + "?connectionStringName=" + e.data.connName }
                    }
                    return true;
                },
                onSelect: indexObj.SelectNode,
                onContextmenu: function (node, e) {
                    if (node.data && node.data.type == "database") return;
                    actionNode = node;
                    menu.show({ top: e.pageY, left: e.pageX });
                    return false;
                }
            });
        }
        , addTab: function (tabid, text, url) {
             tab.addTabItem({ tabid: tabid, text: text, url: url });
         }
        , search: function () {
            var tabid = $(actionNode.target).attr("tabid_search");
            var type = actionNode.data.type;
            if (!tabid) {
                tabid = new Date().getTime();
                $(actionNode.target).attr("tabid_search", tabid)
            }
            if (type == "procedure") {
                indexObj.addTab(tabid, actionNode.data.Name + "_查询", indexObj.searchUrl + "?dbName=" + actionNode.data.databaseName + "&tableName=" + actionNode.data.Name + "&connectionStringName=" + actionNode.data.connName + "&selectType=2");
            }
            else {
                indexObj.addTab(tabid, actionNode.data.Name + "_查询", indexObj.searchUrl + "?dbName=" + actionNode.data.databaseName + "&tableName=" + actionNode.data.Name + "&connectionStringName=" + actionNode.data.connName);
            }
        }
        , design: function () {
            if (actionNode.data && actionNode.data.type == "database") return;
            var type = actionNode.data.type
            var tabid = $(actionNode.target).attr("tabid");
            if (!tabid) {
                tabid = new Date().getTime();
                $(actionNode.target).attr("tabid", tabid)
            }

            if (type == "table") {
                indexObj.addTab(tabid, actionNode.data.Name, indexObj.gridUrl + actionNode.data.databaseName + "/" + actionNode.data.Name + "?connectionStringName=" + actionNode.data.connName);
            }
            else if (type == "view") {
                indexObj.addTab(tabid, actionNode.data.Name, indexObj.viewDesignUrl + actionNode.data.databaseName + "/" + actionNode.data.Name + "?connectionStringName=" + actionNode.data.connName);
            }
            else if (type == "procedure") {
                indexObj.addTab(tabid, node.data.Name, indexObj.procedureDesignUrl + actionNode.data.databaseName + "/" + actionNode.data.Name + "?connectionStringName=" + actionNode.data.connName);
            } 
         } 
        , treeResize: function () {
            var leftsideHeight = $(".l-scroll").height();
            var siderTopHeight = $(".siderTop").height();
            var siderViewHeight = $(".siderView").height();

            $(".treeView").height(leftsideHeight - siderTopHeight - siderViewHeight - 35);
            $(".tableView").height(leftsideHeight - siderTopHeight - siderViewHeight - 35);
            $(".procedure").height(leftsideHeight - siderTopHeight - siderViewHeight - 35);
        }
        , heightChanged: function (options) {
            if (tab)
                tab.addHeight(options.diff);
            if (accordion && options.middleHeight - 24 > 0)
                accordion.setHeight(options.middleHeight - 24);
        } 
    });
})(jQuery)

