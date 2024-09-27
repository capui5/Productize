sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/ButtonType",
], function (Controller, DateFormat, Sorter, JSONModel, Filter, FilterOperator, History, UIComponent,ButtonType) {
      "use strict";
  
      return Controller.extend("com.product.salesorder.controller.TodayTransaction", {
      
            onInit: function () {
                var that = this;
                this.selectedTransactionType = "";
                this._TotalPriceOfSo = new sap.ui.model.json.JSONModel({
                    totalNetPrice: 0
                });
                this.getView().setModel(this._TotalPriceOfSo, "view");
                var oModel = that.getOwnerComponent().getModel("SalesEmployeeModel")
    
                var oData = oModel.getProperty("/");
                if (oData && oData.results && oData.results.length > 0) {
                    var yourProperty = oModel.getProperty("/results/0/Pernr");
                    // Use the value of 'yourProperty' as needed
    
                } else {
    
                }
              
                var oDateFormat = DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" });
                this.updateCurrentDate(oDateFormat);
                this.scheduleDailyUpdate(oDateFormat);
                var lModel = this.getOwnerComponent().getModel("LoginUserModel");
    
                // this.SalesEmpId =this.getOwnerComponent().getModel("LoginUserModel").oData.email;
               
    
    
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("TodayTransaction").attachPatternMatched(this._onRouteMatched, this);
            },
            _onRouteMatched: function (evt) {
                var that = this;
                var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
                this.sStoreId = oStoreModel.getProperty("/selectedStoreId");
                var oModel = that.getOwnerComponent().getModel("SalesEmployeeModel");
                this.SalesEmpId = oModel.getProperty("/results/0/Email");
             
                this.getView().byId("salesOrderBeginDate").setValue(this.dateFormatter(new Date()));
                this.getView().byId("salesOrderEndDate").setValue(this.dateFormatter(new Date()));
            },
           
            onTableUpdateFinished: function (oEvent) {
                // Get the table items
    
                var oTable = this.getView().byId("salesTable");
    
                // Get the table items
                var aItems = oTable.getItems();
    
                // Calculate the total net price
                var totalNetPrice = 0;
    
                for (var i = 0; i < aItems.length; i++) {
                    var oItem = aItems[i];
                    var oContext = oItem.getBindingContext("mainModel");
                    var fNetPrice = parseFloat(oContext.getProperty("NetPrice"));
                    var DocType = oContext.getProperty("DocType");
                 if(DocType =="ZRET"){
                    fNetPrice = -fNetPrice;
                 }
                    if (!isNaN(fNetPrice)) {
                        totalNetPrice += fNetPrice;
                    }
                }
                this._TotalPriceOfSo.setProperty("/totalNetPrice", totalNetPrice.toFixed(2));
    
    
            },
    
            handleTransactionSalesData: function (filter1, filter2, filter3) {
                var filters = new sap.ui.model.Filter([filter1, filter2, filter3], true);
                this.getView().byId("salesTable").getBinding("items").filter(filters);
            },
            onCompletedTransactions: function () {
                var button1 = this.getView().byId("storetransac");
                var button2 = this.getView().byId("mytransac");
    
                button1.setType(ButtonType.Emphasized);
                button2.setType(ButtonType.Default);
    
               
                this.selectedTransactionType = "Store Transaction";
            },
            onMyTransactions: function () {
                var button1 = this.getView().byId("mytransac");
                var button2 = this.getView().byId("storetransac");
    
                // Apply styles to the buttons
                button1.setType(ButtonType.Emphasized);
                button2.setType(ButtonType.Default);
    
            
                this.selectedTransactionType = "My Transaction";
            },
            onMyTransactionsButton: function () {
    
                var plant = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.sStoreId);
                var salesemp = new sap.ui.model.Filter("CreatedByEmail", sap.ui.model.FilterOperator.EQ, this.SalesEmpId);
                var beginDate = this.getView().byId("salesOrderBeginDate").getValue();
                var endDate = this.getView().byId("salesOrderEndDate").getValue();
                if (beginDate.length > 0 && endDate.length > 0) {
                    var formattedBeginDate = new Date(new Date(beginDate).toString().split("GMT ")[0] + " UTC ").toISOString();
                    var formattedEndDate = new Date(new Date(endDate).toString().split("GMT ")[0] + " UTC ").toISOString();
                    var filter3 = new sap.ui.model.Filter("DocDate", sap.ui.model.FilterOperator.BT, formattedBeginDate, formattedEndDate);
                } else if (beginDate.length == 0) {
                    sap.m.MessageToast.show(this.getOwnerComponent().getModel("i18n").getProperty("enter_begin_date"));
                } else if (endDate.length == 0) {
                    sap.m.MessageToast.show(this.getOwnerComponent().getModel("i18n").getProperty("enter_end_date"));
                }
                this.handleTransactionSalesData(plant, salesemp, filter3);
                var oText = this.getView().byId("displayText");
                oText.setText(this.getOwnerComponent().getModel("i18n").getProperty("My_Transaction"));
            },

            onSearchWithCust: function (evt) {
                var searchString = evt.getParameter("value");
                var filter1 = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.sStoreId);
                var filter2 = new sap.ui.model.Filter("SalesEmp", sap.ui.model.FilterOperator.EQ, this.SalesEmpId);
                if (searchString.length > 1) {
                    var filter3 = new sap.ui.model.Filter("SoldTo", sap.ui.model.FilterOperator.EQ, searchString);
                    var filters = new sap.ui.model.Filter([filter1, filter2, filter3], true);
                    this.getView().byId("salesTable").getBinding("items").filter(filters);
                } else {
                    this.onGoPress();
                }
    
            },

            onSearch: function (evt) {
                var searchString = evt.getParameter("value");
                var filter1 = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.sStoreId);
                var filter2 = new sap.ui.model.Filter("SalesEmp", sap.ui.model.FilterOperator.EQ, this.SalesEmpId);
                if (searchString.length > 1) {
                    var filter3 = new sap.ui.model.Filter("SalesorderNo", sap.ui.model.FilterOperator.EQ, searchString);
                    var filters = new sap.ui.model.Filter([filter1, filter2, filter3], true);
                    this.getView().byId("salesTable").getBinding("items").filter(filters);
                } else {
                    this.onGoPress();
                }
    
            },
            onGoPress: function (evt) {
                
                if (this.selectedTransactionType === "My Transaction") {
                    // Apply OData filter for My Transaction
                    this.onMyTransactionsButton();
                } else if (this.selectedTransactionType === "Store Transaction") {
                    // Apply OData filter for Store Transaction
                    this.onCompletedTransactionsbutton();
                } else {
                    // Handle the case where no button was clicked
                    sap.m.MessageBox.error(this.getOwnerComponent().getModel("i18n").getProperty("Please_select_type_of_Transaction"));
                    return;
                }
    
            },
            dateFormatter: function (date) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "MM/dd/yyyy"
                });
                return oDateFormat.format(new Date(date));
            },
            updateCurrentDate: function (oDateFormat) {
                var currentDate = new Date();
                var formattedDate = oDateFormat.format(currentDate);
                var oModel = new JSONModel({ currentDate: formattedDate });
                this.getView().setModel(oModel, "CurrentDate");
            },
    
            scheduleDailyUpdate: function (oDateFormat) {
                var self = this;
                setInterval(function () {
                    self.updateCurrentDate(oDateFormat);
                }, 24 * 60 * 60 * 1000);
            },
    
            onPendingTransactions: function () {
                this.filterTransactions("Pending");
            },
    
            onCompletedTransactionsbutton: function () {
    
                var plant = new sap.ui.model.Filter("Plant", sap.ui.model.FilterOperator.EQ, this.sStoreId);
                var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");
                var oBrandData = oBrandModel.getProperty("/selectedBrandNames");
                if (Array.isArray(oBrandData) && oBrandData.length > 0) {
                    var aBrandIds = oBrandData.map(function (brand) {
                        return brand.Brand_Id;
                    });
    
                    var aBrandFilters = aBrandIds.map(function (brandId) {
                        return new sap.ui.model.Filter("BrandId", sap.ui.model.FilterOperator.EQ, "'" + brandId + "'");
                    });
    
    
                    var oCombinedBrandFilters = new sap.ui.model.Filter({
                        filters: aBrandFilters,
                        and: false // Change this based on your logic, whether it's 'AND' or 'OR'
                    });
                    var beginDate = this.getView().byId("salesOrderBeginDate").getValue();
                    var endDate = this.getView().byId("salesOrderEndDate").getValue();
                    if (beginDate.length > 0 && endDate.length > 0) {
                        var formattedBeginDate = new Date(new Date(beginDate).toString().split("GMT ")[0] + " UTC ").toISOString();
                        var formattedEndDate = new Date(new Date(endDate).toString().split("GMT ")[0] + " UTC ").toISOString();
                        var filter3 = new sap.ui.model.Filter("DocDate", sap.ui.model.FilterOperator.BT, formattedBeginDate, formattedEndDate);
                    } else if (beginDate.length == 0) {
                        sap.m.MessageToast.show(this.getOwnerComponent().getModel("i18n").getProperty("enter_begin_date"));
                    } else if (endDate.length == 0) {
                        sap.m.MessageToast.show(this.getOwnerComponent().getModel("i18n").getProperty("enter_end_date"));
                    }
                    var filters = new sap.ui.model.Filter([plant, oCombinedBrandFilters, filter3], true);
                    this.getView().byId("salesTable").getBinding("items").filter(filters);
                    var oText = this.getView().byId("displayText");
                    oText.setText(this.getOwnerComponent().getModel("i18n").getProperty("Store_Transaction"));
    
                }
            },
    
            filterTransactions: function (status) {
                var oTable = this.getView().byId("salesTable");
                var oBinding = oTable.getBinding("items");
    
                if (oBinding) {
                    oBinding.filter(new sap.ui.model.Filter({
                        path: "Products",
                        test: function (products) {
                            return products.some(function (product) {
                                return product.Status === status;
                            });
                        }
                    }));
                }
            },
    
            onSalesOrderPress: function (oEvent) {
                var oSelectedItem = oEvent.getSource().getParent();
    
                // Get the Sales Order No from the selected row
                var sSalesOrderNo = oSelectedItem.getCells()[0].getText();
                var sSoldto = oSelectedItem.getCells()[5].getText();
    
    
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("SalesOrderItem", { SSalesno: sSalesOrderNo, SSoldTo: sSoldto });
                // Now you can use sSalesOrderNo as needed
    
            },
    
            calculateTotalPrice: function (aProducts) {
                let total = 0;
                aProducts.forEach(function (product) {
                    total += parseFloat(product.Price.replace(" USD", ""));
                });
                return total.toFixed(2) + " USD";
            },
            //Nav Back start//
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
    
            onNavBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("MainMenu");
            },
        });
    });
    