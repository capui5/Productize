sap.ui.define(
    [
    "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v2/ODataModel",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ndc/BarcodeScanner",
  "sap/ui/core/Fragment",
  "com/product/salesorder/util/formatter",
], function (Controller, JSONModel, ODataModel, MessageBox, Filter, FilterOperator, BarcodeScanner, Fragment,
  formatter
) {
      "use strict";
  
      return Controller.extend("com.product.salesorder.controller.Transaction", {
        formatter:formatter,
        onInit: function () {
          if (!this.conditionType) {
            this.conditionType = new sap.ui.xmlfragment("com.product.salesorder.Fragments.conditionType", this);
            this.getView().addDependent(this.conditionType);
          }
          if (!this.valueHelpForHeaderCampaign) {
            this.valueHelpForHeaderCampaign = new sap.ui.xmlfragment("com.product.salesorder.Fragments.valueHelpForHeaderCampaign", this);
            this.getView().addDependent(this.valueHelpForHeaderCampaign);
          }
          if (!this.Product)
            this.Product = new sap.ui.xmlfragment("com.product.salesorder.Fragments.Product", this);
          this.getView().addDependent(this.Product);
    
    
          if (!this.valueHelpForPdfViewer)
            this.valueHelpForPdfViewer = new sap.ui.xmlfragment("com.product.salesorder.Fragments.pdfViewerForSalesOrder", this);
          this.getView().addDependent(this.valueHelpForPdfViewer);
    
          var oBalanceModel = new sap.ui.model.json.JSONModel();
    
    
          oBalanceModel.setData({
            balance: 0
          });
    
          this.getView().setModel(oBalanceModel, "balanceModel");
    
    
          var oQuantityModel = new JSONModel();
          this.getView().setModel(oQuantityModel, "quantityModel");
    
          var esModel = this.getOwnerComponent().getModel("SalesEmployeesModel");
          this.getView().setModel(esModel, "SalesEmployeesModel")
    
          var rModel = this.getOwnerComponent().getModel("ResponseModel");
          this.getView().setModel(rModel, "ResponseModel")
    
          var oInput = this.getView().byId("firstNameInput");
          oInput.bindValue("CustomerNoModel>/Firstnames/0");
          var that = this;
          var aModel = that.getOwnerComponent().getModel("CampaignModel");
          this.getView().setModel(aModel, "CampaignModel");
    
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("Transaction").attachPatternMatched(this._onRouteMatched, this);
          var oCartModel = new JSONModel();
          this.getView().setModel(oCartModel, "cartModel");
    
          var oQuantityModel = new JSONModel();
          this.getView().setModel(oQuantityModel, "quantityModel");
    
          var oModel = new JSONModel({
            "SalesProducts": {
              "Products": [{
                  "Name": "Product 1",
                  "BarId": "123456",
                  "Price": "25",
                  "CurrencyCode": "USD",
                  "Quantity": 0
                },
                {
                  "Name": "Product 2",
                  "BarId": "789012",
                  "Price": "30",
                  "CurrencyCode": "USD",
                  "Quantity": 0
                }
              ]
            }
          });
          this.getView().setModel(oModel);
          var oComboBox = this.byId("Itemlevelcampaign");
    
    
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          var oModel = this.getOwnerComponent().getModel("mainModel");
          var email = "''";
          // Read data from the model using the provided URL
          oModel.read("/SalesEmployees", {
            urlParameters: {
              StoreId: "'" + sStoreId + "'",
              Email: email,
            },
            success: function (data) {
              // Handle the fetched data
    
              esModel.setData(data.results);
              // You can process the data here
            },
            error: function (error) {
              // Handle errors during the fetch
              console.error("Error fetching data:", error);
            }
          });
          this.loadPDFjsLib();
        },
        _showConfirmationDialog: function (oEvent) {
          var stayOnPage = confirm("Would you like to save this draft?");
          if (!stayOnPage) {
    
          } else {
    
          }
    
        },
        onBeforeRendering: function () {
          var that = this;
    
          window.onbeforeunload = function (e) {
            var message = this.getOwnerComponent().getModel("i18n").getProperty("sure_leave_page");
            e.returnValue = message;
            return message;
          };
        },
    
        handleLoadItems: function (evt) {
          var that = this;
          this.oControlEvent = evt;
          if (!this.valueHelpForItemLevelCampaign) {
            this.valueHelpForItemLevelCampaign = new sap.ui.xmlfragment("com.product.salesorder.Fragments.valueHelpForItemLevelCampaign", this);
            this.getView().addDependent(this.valueHelpForItemLevelCampaign);
    
          }
          this.valueHelpForItemLevelCampaign.open();
          this.selectedinputfield = evt.getSource()
          this.SearchCampaign = evt.getSource().getBindingContext("SelectedItems").getObject()
          var datePicker = this.getView().byId("DP2");
          var selectedDate = datePicker.getDateValue();
          var milliseconds = selectedDate.getTime();
          var formattedDate = new Date(new Date(selectedDate).toString().split("GMT ")[0] + " UTC ").toISOString();
          that.oControlEvent.getSource().getBinding("items");
          var compaignItems = evt.getSource().getBinding("items");
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          var filterCampaignCat = new sap.ui.model.Filter({
            path: "CampaignCat",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: "I"
          });
    
          var filterPlant = new sap.ui.model.Filter({
            path: "Plant",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: sStoreId
          });
    
          var filterDocDate = new sap.ui.model.Filter({
            path: "DocDate",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: formattedDate
          });
    
          var filterArticle = new sap.ui.model.Filter({
            path: "Article",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: evt.getSource().getBindingContext("SelectedItems").getObject().ArticleType
          });
    
          var filterBrand = new sap.ui.model.Filter({
            path: "BrandId",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: evt.getSource().getBindingContext("SelectedItems").getObject().BrandId
          });
    
          var aFilters = [filterCampaignCat, filterPlant, filterDocDate, filterArticle, filterBrand];
          this.valueHelpForItemLevelCampaign.getBinding("items").filter(aFilters);
          this.evt = evt;
    
        },
    
    
        onValueHelpClose: function (evt) {
          var selectedItems = evt.getSource().mAggregations._dialog.getContent()[1].getSelectedContextPaths();
          var aSelectedCampaign = this.getOwnerComponent().getModel("mainModel").getObject(evt.getSource().mAggregations._dialog.getContent()[1].getSelectedContextPaths()[0])
          if (selectedItems && selectedItems.length > 0) {
            var campaignId = selectedItems[0].replace("/CampaignSet('", "").replace("')", "");
            this.selectedinputfield.setValue(campaignId);
            var selectedData = this.evt.getSource().getBindingContext("SelectedItems").getObject();
            selectedData.CampaignID = aSelectedCampaign.CampaignId;;
            selectedData.ConditionType = aSelectedCampaign.ConditionType;
          }
        },
    
        onValueHelpCloseSalesEmployees: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          if (!oSelectedItem) {
            return;
          }
    
          this.byId("salesemployeeinput").setValue(oSelectedItem.getTitle());
        },
    
        onValueHelpCloseHeaderCampaign: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          oEvent.getSource().getBinding("items").filter([]);
    
          if (!oSelectedItem) {
            return;
          }
    
          this.byId("headercampaigninput").setValue(oSelectedItem.getTitle());
        },
    
        loadPDFjsLib: function () {
          var script = document.createElement("script");
          script.src = "//mozilla.github.io/pdf.js/build/pdf.mjs";
          script.type = "module"; // Use type module for ECMAScript modules
          document.head.appendChild(script);
    
          var workerScript = document.createElement("script");
          workerScript.src = "//mozilla.github.io/pdf.js/build/pdf.worker.mjs";
          workerScript.type = "module"; // Use type module for ECMAScript modules
          document.head.appendChild(workerScript);
        },
    
        printPdfImages: function () {
          if (pdfImages.length > 0) {
            // Load the print-js library dynamically if not already loaded
            if (typeof printJS === 'undefined') {
              var script = document.createElement('script');
              script.src = "https://printjs-4de6.kxcdn.com/print.min.js";
              script.onload = function () {
                printJS({
                  printable: pdfImages,
                  type: 'image',
                  style: 'img { display: block; margin-bottom: 10px; }'
                });
              };
              document.head.appendChild(script);
            } else {
              printJS({
                printable: pdfImages,
                type: 'image',
                style: 'img { display: block; margin-bottom: 10px; }'
              });
            }
          } else {
            console.error('No images available to print.');
          }
        },
    
        onValueHelpSalesEmployee: function () {
          if (!this.valueHelpForSalesEmployee) {
            this.valueHelpForSalesEmployee = new sap.ui.xmlfragment("com.product.salesorder.Fragments.valueHelpForSalesEmployee", this);
            this.getView().addDependent(this.valueHelpForSalesEmployee);
          }
          this.valueHelpForSalesEmployee.open();
        },
        onSearchHeaderCampaign:function(oEvent){
          var sQuery = oEvent.getParameter("value");
          var oModel = this.getOwnerComponent().getModel("mainModel");
          var HModel = this.getOwnerComponent().getModel("HeaderCampaignModel")
          this.getView().setModel(HModel, "HeaderCampaignModel");
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");
          var oBrandData = oBrandModel.getProperty("/selectedBrandNames");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          var datePicker = this.getView().byId("DP2");
          var selectedDate = datePicker.getDateValue();
          var milliseconds = selectedDate.getTime();
          var formattedDate = new Date(new Date(selectedDate).toString().split("GMT ")[0] + " UTC ").toISOString();
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          if (oBrandModel) {
            var oBrandData = oBrandModel.getProperty("/selectedBrandNames");
    
            if (Array.isArray(oBrandData) && oBrandData.length > 0) {
              var aBrandIds = oBrandData.map(function (brand) {
                return brand.Brand_Id;
              });
    
              var filterCampaignCat = new sap.ui.model.Filter({
                path: "CampaignCat",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: "H"
              });
    
              var filterPlant = new sap.ui.model.Filter({
                path: "Plant",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sStoreId
              });
    
              var filterCampaignId = new sap.ui.model.Filter({
                path: "CampaignId",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sQuery
              });
    
              var filterBrandId = aBrandIds.map(function (brandId) {
                return new sap.ui.model.Filter(
                  "BrandId",
                  sap.ui.model.FilterOperator.EQ,
                  brandId)
              });
    
              var combinedFilter = new sap.ui.model.Filter({
                filters: filterBrandId,
                and: false // Set to 'false' for OR logic between filters
              });
    
              // var dateString = "2024-02-28T00:00:00";
              // var date = new Date(dateString);
              var filterDocDate = new sap.ui.model.Filter("DocDate", sap.ui.model.FilterOperator.EQ, formattedDate);
              var aFilters = [filterCampaignCat, filterPlant, combinedFilter, filterDocDate,filterCampaignId];
              this.valueHelpForHeaderCampaign.getBinding("items").filter(aFilters);
            }
          }
        },
        onSearchCampaign:function(oEvent){
          var sQuery = oEvent.getParameter("value");
          var datePicker = this.getView().byId("DP2");
          var selectedDate = datePicker.getDateValue();
          var formattedDate = new Date(new Date(selectedDate).toString().split("GMT ")[0] + " UTC ").toISOString();
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          if(sQuery.length>0){
          var filterCampaignCat = new sap.ui.model.Filter({
            path: "CampaignCat",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: "I"
          });
    
          var filterPlant = new sap.ui.model.Filter({
            path: "Plant",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: sStoreId
          });
    
          var filterDocDate = new sap.ui.model.Filter({
            path: "DocDate",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: formattedDate
          });
    
          var filterArticle = new sap.ui.model.Filter({
            path: "Article",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: this.SearchCampaign.ArticleType
          });
    
          var filterBrand = new sap.ui.model.Filter({
            path: "BrandId",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: this.SearchCampaign.Brand_Id
          });
          var filterCampaignbyID = new sap.ui.model.Filter({
            path: "CampaignId",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: sQuery
          });
    
          var aFilters = [filterCampaignCat, filterPlant, filterDocDate, filterArticle, filterBrand, filterCampaignbyID];
          this.valueHelpForItemLevelCampaign.getBinding("items").filter(aFilters);
        }else{
          var filterCampaignCat = new sap.ui.model.Filter({
            path: "CampaignCat",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: "I"
          });
    
          var filterPlant = new sap.ui.model.Filter({
            path: "Plant",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: sStoreId
          });
    
          var filterDocDate = new sap.ui.model.Filter({
            path: "DocDate",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: formattedDate
          });
    
          var filterArticle = new sap.ui.model.Filter({
            path: "Article",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: this.SearchCampaign.ArticleType
          });
    
          var filterBrand = new sap.ui.model.Filter({
            path: "BrandId",
            operator: sap.ui.model.FilterOperator.EQ,
            value1: this.SearchCampaign.Brand_Id
          });
          
    
          var aFilters = [filterCampaignCat, filterPlant, filterDocDate, filterArticle, filterBrand];
          this.valueHelpForItemLevelCampaign.getBinding("items").filter(aFilters);
        }
        },
        onValueHelpHeaderCampaign: function () {
          var that = this;
          if (!this.valueHelpForHeaderCampaign) {
            this.valueHelpForHeaderCampaign = new sap.ui.xmlfragment("com.product.salesorder.Fragments.valueHelpForHeaderCampaign", this);
            this.getView().addDependent(this.valueHelpForHeaderCampaign);
          }
          this.valueHelpForHeaderCampaign.open();
          var oModel = this.getOwnerComponent().getModel("mainModel");
          var HModel = this.getOwnerComponent().getModel("HeaderCampaignModel")
          this.getView().setModel(HModel, "HeaderCampaignModel");
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");
          var oBrandData = oBrandModel.getProperty("/selectedBrandNames");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          var datePicker = this.getView().byId("DP2");
          var selectedDate = datePicker.getDateValue();
          var milliseconds = selectedDate.getTime();
          var formattedDate = new Date(new Date(selectedDate).toString().split("GMT ")[0] + " UTC ").toISOString();
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          if (oBrandModel) {
            var oBrandData = oBrandModel.getProperty("/selectedBrandNames");
    
            if (Array.isArray(oBrandData) && oBrandData.length > 0) {
              var aBrandIds = oBrandData.map(function (brand) {
                return brand.BrandId;
              });
    
              var filterCampaignCat = new sap.ui.model.Filter({
                path: "CampaignCat",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: "H"
              });
    
              var filterPlant = new sap.ui.model.Filter({
                path: "Plant",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sStoreId
              });
    
              var filterBrandId = aBrandIds.map(function (brandId) {
                return new sap.ui.model.Filter(
                  "BrandId",
                  sap.ui.model.FilterOperator.EQ,
                  brandId)
              });
    
              var combinedFilter = new sap.ui.model.Filter({
                filters: filterBrandId,
                and: false // Set to 'false' for OR logic between filters
              });
    
              // var dateString = "2024-02-28T00:00:00";
              // var date = new Date(dateString);
              var filterDocDate = new sap.ui.model.Filter("DocDate", sap.ui.model.FilterOperator.EQ, formattedDate);
              var aFilters = [filterCampaignCat, filterPlant, combinedFilter, filterDocDate];
              this.valueHelpForHeaderCampaign.getBinding("items").filter(aFilters);
            }
          }
    
        },
    
        _onRouteMatched: function (evt) {
          var that = this;
          // this._hashHandler.startManualHashChangeHandling();
          // valueHelpForItemLevelCampaign
          this.getView().byId("salesemployeeinput").setValue(that.getOwnerComponent().getModel("SalesEmployeeModel").getProperty("/results/0/Pernr"))
          var currentDate = new Date();
          this.getView().byId("DP2").setDateValue(currentDate);
          this.saveFlag = false;
         
    
    
          that.onAddPromotion(true);
          this.conditionTypeArr = [];
          this.oControlEvent = evt;
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[0].getBinding("items").filter([])
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[1].getFields()[0].getBinding("items").filter([])
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[2].getFields()[0].getBinding("items").filter([])
    
          that.onTableUpdateFinished(true);
    
    
        },
    
        onSearch: function (oEvent) {
          var sQuery = oEvent.getParameter("query");
          var that = this;
    
    
          var oBrandModel = that.getOwnerComponent().getModel("SelectedBrandName");
          var oBrandData = oBrandModel.getProperty("/selectedBrandNames");
    
          var oStoreModel = that.getOwnerComponent().getModel("StoreModel");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
    
          var brandIds = oBrandData.map(function (brand) {
            return "''" + brand.Brand_Id + "''";
          }).join(",");
    
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          var oTable = this.Product.getContent()[0];
    
          oTable.bindItems({
            path: "/ProductCost(IP_WERKS='" + sStoreId + "',IP_BRAND_ID='" + brandIds + "')/Set",
            parameters: {
              $search: sQuery
            },
            template: this.oTemplate1,
            model: "oDataV4"
          });
    
        },
    
        onAfterRendering: function () {
          var that = this;
    
    
          setTimeout(function () {
    
            that.onTableUpdateFinished();
          }, 2000);
    
    
        },
    
        onSearchEmployees: function (oEvent) {
    
          var sQuery = oEvent.getParameter("value");
          var oFilter = new Filter("Pernr", FilterOperator.Contains, sQuery);
          var oBinding = oEvent.getSource().getBinding("items");
          oBinding.filter([oFilter]);
        },
    
        onAddProduct: function () {
           this.conditionTypeArr = [];
          this.pDialog ??= this.loadFragment({
            name: "com.product.salesorder.Fragment.scanandadd"
          });
          this.pDialog.then(function (dialog) {
            dialog.open();
          });
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[0].getBinding("items").filter([])
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[1].getFields()[0].getBinding("items").filter([])
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[2].getFields()[0].getBinding("items").filter([])
        },
    
        onCloseFragment: function () {
          if (this.pDialog) {
            this.pDialog.then(function (dialog) {
              dialog.close();
              dialog.destroy();
            });
            this.pDialog = null;
          }
    
        },
    
        ProductSearch: function () {
          if (!this.Product) {
            this.Product = sap.ui.xmlfragment("com.product.salesorder.Fragments.Product", this)
            this.getView().addDependent(this.Product)
          }
         
        var that = this;
        // Assuming you have already created an instance of oDataModel
        
        var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");

        if (oBrandModel) {
            var oBrandData = oBrandModel.getProperty("/selectedBrandNames");

            if (Array.isArray(oBrandData) && oBrandData.length > 0) {
                var aBrandIds = oBrandData.map(function (brand) {
                    return brand.BrandId;
                });

                var aBrandFilters = aBrandIds.map(function (brandId) {
                    return new sap.ui.model.Filter("Brand_Id", sap.ui.model.FilterOperator.EQ, brandId);
                });


                var oCombinedBrandFilters = new sap.ui.model.Filter({
                    filters: aBrandFilters,
                    and: false // Change this based on your logic, whether it's 'AND' or 'OR'
                });

                var oStoreModel = this.getOwnerComponent().getModel("StoreModel");

                var sStoreId = oStoreModel.getProperty("/selectedStoreId");

                var oStoreFilter = new sap.ui.model.Filter("StoreId", sap.ui.model.FilterOperator.EQ, sStoreId);

                var oModel = this.getOwnerComponent().getModel("mainModel");

                var oFinalFilter = new sap.ui.model.Filter({
                    filters: [oCombinedBrandFilters, oStoreFilter],
                    and: true
                });
                this.Product.getContent()[0].getBinding("items").filter(oFinalFilter);
                this.Product.getContent()[0].removeSelections(true);
                this.Product.open();
               
            }
        }
        },
    
        onAddToSaleProducts: function () {
          var aSelectedItems = [];
          var oTable = this.getView().byId("producttable");
          var aListItems = this.Product.getContent()[0].getSelectedItems();
    
          aListItems.forEach(function (oListItem) {
            var oBindingContext = oListItem.getBindingContext("mainModel");
            if (oBindingContext) {
              var oSelectedItem = oBindingContext.getObject();
              // Check if the quantity property is already present, if not, set it to 1
              if (!oSelectedItem.hasOwnProperty("quantity")) {
                oSelectedItem.quantity = 1;
              }
              if (oSelectedItem.hasOwnProperty("ARTICLENO")) {
                oSelectedItem.ArticleNo = oSelectedItem.ARTICLENO;
                delete oSelectedItem.ARTICLENO;
              }
              aSelectedItems.push(oSelectedItem);
            } else {
              console.error("BindingContext is undefined for the selected item.");
            }
          });
    
          // Access the existing "SelectedItems" model and update the selected items
          var oModel = this.getView().getModel("SelectedItems");
          if (oModel) {
            var oData = oModel.getData();
            var existingSelectedItems = oData.selectedItems || []; // Get existing selected items
    
            // Loop through the selected items to check if the barcode already exists
            aSelectedItems.forEach(function (newItem) {
              var existingItem = existingSelectedItems.find(function (item) {
                return item.Barcode === newItem.Barcode && item.Stloc === newItem.Stloc;
              });
    
              if (existingItem) {
                // If the barcode already exists, update the quantity instead of adding a new entry
                existingItem.quantity += newItem.quantity;
              } else {
                // If the barcode does not exist, add it to the list
                existingSelectedItems.push(newItem);
              }
            });
            // Find the maximum existing ItmNumber
            // Find the maximum existing ItmNumber
            var maxItmNumber = existingSelectedItems.reduce(function (max, item) {
              var itmNumber = parseInt(item.ItmNumber);
              return itmNumber > max ? itmNumber : max;
            }, 0);
    
            existingSelectedItems.forEach(function (item, index) {
              if (!item.ItmNumber) {
                var nextIndex = maxItmNumber + 10; // Start with 10 for the first item
                while (existingSelectedItems.some(existingItem => existingItem.ItmNumber === nextIndex.toString().padStart(6, '0'))) {
                  nextIndex += 10;
                }
                item.ItmNumber = nextIndex.toString().padStart(6, '0');
                maxItmNumber = nextIndex; // Update maxItmNumber for the next iteration
              }
            });
    
    
            // Update the model with the combined selected items
            oData.selectedItems = existingSelectedItems;
            var totalRetailPrice = 0;
            var that = this; // Store the reference to 'this'
    
            // Calculate total retail price for all selected items
    
          } else {
            console.error("Model 'SelectedItems' not found.");
          }
    
          this.Product.close();
          var oDialog = this.getView().byId("scanandadd");
          oDialog.close();
          var oLocalModel = this.getView().getModel("localModel");
          oLocalModel.setData({
            modelData: {}
          });
          oLocalModel.updateBindings(true);
          this.onAddPromotion(true);
        },
    
        closeSearchProd: function () {
          var oLocalModel = this.getView().getModel("localModel");
          oLocalModel.setData({
            modelData: {}
          });
          oLocalModel.updateBindings(true);
          this.Product.close();
        },
    
        onScanBarcode: function () {
          var that = this;
    
          if (sap.ndc && sap.ndc.BarcodeScanner) {
            sap.ndc.BarcodeScanner.scan(
              function (mResult) {
                var sText = mResult.text;
                var oBrandModel = that.getOwnerComponent().getModel("SelectedBrandName");
    
                var oBrandData = oBrandModel.getProperty("/selectedBrandNames");
    
                if (Array.isArray(oBrandData) && oBrandData.length > 0) {
                  var aBrandIds = oBrandData.map(function (brand) {
                    return brand.Brand_Id;
                  });
    
                  var brandIds = oBrandData.map(function (brand) {
                    return "''" + brand.Brand_Id + "''";
                  }).join(",");
    
    
    
                  var oStoreModel = that.getOwnerComponent().getModel("StoreModel");
    
                  var sStoreId = oStoreModel.getProperty("/selectedStoreId");
    
    
    
                  var oModel = that.getOwnerComponent().getModel("CapModel", true);
    
    
    
                  var sUrl = "/ProductCost(IP_WERKS='" + sStoreId + "',IP_BRAND_ID='" + brandIds + "')/Set?$search=" + sText;
                  oModel.read(sUrl, {
                    success: function (oData, oResponse) {
    
                      var data = JSON.parse(oResponse.body).value;
    
                      var oJsonModel = new sap.ui.model.json.JSONModel();
                      oJsonModel.setData(data);
                      data.forEach(function (obj) {
                        obj.quantity = 1;
                        obj.ArticleNo = obj.ARTICLENO;
                        // Delete the original ARTICLENO key
                        delete obj.ARTICLENO;
                        // Set quantity to 1
                      });
                      that.getView().setModel(oJsonModel, "ProductSetModel");
    
                      var oModel = that.getView().getModel("ProductSetModel");
    
                      if (!oModel) {
                        console.error("ProductSetModel not found.");
                        return;
                      }
                      if (isValidBarcode(sText)) {
    
                        // Retrieve the array of objects from the model
                        var oModelData = oModel.getData();
    
                        // Check if oModelData is an array
                        if (Array.isArray(oModelData)) {
                          var oModel = that.getView().getModel("ProductSetModel");
    
                          // Use Array.find() to search for the object with the matching Barcode
                          var oFoundItem = oModelData.find(function (item) {
                            return item.Barcode === sText;
                          });
    
                          // 'oFoundItem' will contain the object with the matching Barcode if found
                          if (oFoundItem) {
                            // Access the SelectedItems model from the view
                            var oJsonModel = that.getView().getModel("SelectedItems");
    
                            // Ensure that the selectedItems property exists in the model
                            if (!oJsonModel.getProperty("/selectedItems")) {
                              oJsonModel.setProperty("/selectedItems", []);
                            }
    
                            // Get the array of selected items from the model
                            var aSelectedItems = oJsonModel.getProperty("/selectedItems");
    
                            // Check if the item already exists in the selectedItems array
                            var existingItem = aSelectedItems.find(function (item) {
                              return item.ArticleNo === oFoundItem.ArticleNo && item.Stloc === oFoundItem.Stloc;
                            });
    
                            if (existingItem) {
                              // If the item already exists, increase the quantity
                              existingItem.quantity += 1;
    
                            } else {
                              // If the item is not found, push it to the array with quantity 1
                              oFoundItem.quantity = 1;
                              aSelectedItems.push(oFoundItem);
    
                            }
                            // Set the updated array back to the model
                            oJsonModel.setProperty("/selectedItems", aSelectedItems);
                            if (oModel) {
                              var oData = oModel.getData();
                              // Assign incremental ItmNumber to each item in selectedItems array
                              aSelectedItems.forEach(function (item, index) {
                                // Incremental padding for ItemNumber (e.g., 0010, 0020, etc.)
                                var paddedIndex = (index + 1) * 10; // Increase by 10 for every index
                                // Format the paddedIndex to a 6-digit string (e.g., 000010, 000020)
                                var formattedIndex = ('000000' + paddedIndex).slice(-6);
                                // Assign the formatted ItmNumber to each item
                                item.ItmNumber = formattedIndex;
                              });
    
                              // Add the modified selected items back to the model data
                              oData.selectedItems = aSelectedItems;
    
                              // Update the model with the modified data
                              oModel.setData(oData);
    
                              that.onAddPromotion(true);
                              var oDialog = that.getView().byId("scanandadd");
                              oDialog.close();
                            } else {
                              console.error("Model 'SelectedItems' not found.");
                            }
                          } else {
                            // Show an error message if barcode is not found
                            sap.m.MessageBox.error(that.getOwnerComponent().getModel("i18n").getProperty("Barcode_not_found") + sText);
                          }
                        }
                      } else {
                        sap.m.MessageBox.error(that.getOwnerComponent().getModel("i18n").getProperty("Invalid_Bar_code") + ": " + sText);
                      }
                    }
                  });
                }
              },
              function (Error) {
                // Handle errors when scanning fails
                sap.m.MessageBox.error(that.getOwnerComponent().getModel("i18n").getProperty("Scanning_failed") + ": " + Error);
              }
            );
          } else {
            console.error("BarcodeScanner is not defined in sap.ndc");
          }
    
          function isValidBarcode(barcode) {
            return barcode.trim().length > 0;
          }
    
        },
    
        onTableUpdateFinished: function () {
          this.totalTaxPrice = 0;
          this.totalTaxPrice = 0;
          this.totalNetAndTaxPrice = 0;
          var oModel = this.getView().getModel("SelectedItems");
          var aItems = oModel.getProperty("/selectedItems");
          // aItems.forEach(function(object,index){object.itmNumber="0000" + ((index+1)*10)})
          var bShouldShowColumn = false;
          aItems.forEach(function (obj, index) {
            var number = (index + 1) * 10;
            var formattedNumber = sap.ui.core.format.NumberFormat.getIntegerInstance({
              minFractionDigits: 0,
              maxFractionDigits: 0,
              groupingEnabled: false
            }).format(number);
            obj.ItmNumber = formattedNumber.padStart(6, '0');
            if (obj.SnoChk === "X") {
              bShouldShowColumn = true;
          }
    
          return obj; 
          });
          var oColumn = this.getView().byId("serialColumn");
        oColumn.setVisible(bShouldShowColumn);
    
          // Calculate total Tax Price 
          this.totalTaxPrice = aItems.reduce(function (sum, item) {
            if (item.TaxAmount !== undefined && !isNaN(item.TaxAmount)) {
              return sum + parseFloat(item.TaxAmount);
            } else {
              return sum;
            }
          }, 0);
          this.totalTaxPrice = this.totalTaxPrice.toFixed(2)
          this.getView().byId("totalnetprice").setText("Total Tax Price: " + this.totalTaxPrice)
    
          
    
          // Calculate total Net Price 
          this.totalNetPrice = aItems.reduce(function (sum, item) {
            if (item.NetPrice !== undefined && !isNaN(item.NetPrice)) {
              return sum + parseFloat(item.NetPrice);
            } else {
              return sum;
            }
          }, 0);
    
          this.totalNetPrice = this.totalNetPrice.toFixed(2)
          this.getView().byId("totaltaxprice").setText("Total Net Price: " + this.totalNetPrice)
          this.totalNetPrice = parseFloat(this.totalNetPrice);
          this.totalTaxPrice = parseFloat(this.totalTaxPrice);
          this.totalNetAndTaxPrice = this.totalNetPrice + this.totalTaxPrice;
          this.totalNetAndTaxPrice = this.totalNetAndTaxPrice.toFixed(2);
          this.getView().byId("totalNetAndTaxPrice").setText("Total Price incl Tax: " + this.totalNetAndTaxPrice)
    
        },
    
        onQuantityChange: function (oEvent, evt) {
          var that = this;
    
          this.oControlEvent = evt;
          // that.oControlEvent.getSource().getBinding("items");
          // var compaignItems = evt.getSource().getBinding("items");
          var newQuantity = oEvent.getParameter("value");
          var oQuantityModel = this.getView().getModel("quantityModel");
          var oCartModel = this.getView().getModel("SelectedItems");
          var selectedItems = oCartModel.getProperty("/selectedItems");
          var AvlQty = oEvent.getSource().getBindingContext("SelectedItems").getObject().AvailableQty;
          // var salesOrderItems = selectedItems.map(function (item, index) {
          var oPopover = new sap.m.Popover({
            content: new sap.m.Text({
              text: " Available Quantity: " + AvlQty
            }),
            placement: sap.m.PlacementType.Bottom,
            showHeader: false, // Remove the title bar
            width: "auto", // Adjust the width as needed
            horizontalScrolling: false, // Disable horizontal scrolling
            verticalScrolling: false // Disable vertical scrolling
          });
          // Get the source control (the control where the event originated)
          var oSource = oEvent.getSource();
          // Open the popover relative to the source control
          oPopover.openBy(oSource);
    
    
    
          oQuantityModel.setProperty("/selectedQuantity", newQuantity);
          that.onAddPromotion(true);
          // Recalculate total price
          that.onTableUpdateFinished();
        },
    
        onCheckBoxSelect: function (oEvent) {
          var oCheckBox = oEvent.getSource(); // Get the checkbox
          var oRow = oCheckBox.getParent(); // Get the parent (Row)
          var oCells = oRow.getCells(); // Get all cells of the row
    
          var oDropdown = oCells[0]; // Assuming the dropdown is in the second cell
    
          if (oCheckBox.getSelected()) {
            oDropdown.setEnabled(false); // Disable dropdown if checkbox is selected
          } else {
            oDropdown.setEnabled(true); // Enable dropdown if checkbox is not selected
          }
          this.onAddPromotion(true);
        },
    
        validateMandatFields: function () {
          var errorText = "";
          var inventoryStockItems = this.getView().getModel("SelectedItems").getData();
          if (this.getView().byId("Campaign").getSelectedKey().length == 0) {
            errorText += "Please select the  Campaign\n";
          }
          if (inventoryStockItems.length == 0) {
            errorText += "Please add atleast an item to create the Stock Inventory";
          }
          return errorText;
        },
    
        onClickOrderReason: function (oEvent) {
    
          if (oEvent.getParameter("selected")) {
            this.getView().byId("orderFormElement").setVisible(true);
          } else {
            this.getView().byId("orderFormElement").setVisible(false);
          }
          this.onAddPromotion(true);
          this.getView().byId("orderreason").setSelectedKey("");
        },
    
        onAddPromotion: function (defaultFlag) {
    
          var that = this;
          // var errorText = this.validateMandatFields();
    
          var datePicker = this.getView().byId("DP2");
          var selectedDate = datePicker.getDateValue();
    
          if (!selectedDate) {
            sap.m.MessageBox.error(this.getOwnerComponent().getModel("i18n").getProperty("Please_select_valid_date"));
            return;
          }
          var selectedHeaderCampaignKey = this.getView().byId("headercampaigninput").getValue().split(' ')[0]; // Assuming "Campaign" is the ID of your ComboBox
          var selectedCampaignConditionType= this.getView().byId("headercampaigninput").getValue().split(' ')[1]
          // Initialize the selectedCampaignConditionType
    
    
          var selectedText = this.getView().byId("salesemployeeinput").getValue();
          var comboBox = this.byId("orderreason");
          var selectedKey = comboBox.getSelectedKey();
          var milliseconds = selectedDate.getTime();
          var formattedDate = '/Date(' + milliseconds + ')/';
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          var oCartModel = this.getView().getModel("SelectedItems");
          var selectedItems = oCartModel.getProperty("/selectedItems");
    
          if (defaultFlag != true) {
            if (!selectedItems || selectedItems.length === 0) {
              sap.m.MessageBox.error("Please select items for the promotion.");
              return;
            }
          }
    
          var oTable = this.byId("transactiontable");
          var aColumns = oTable.getColumns();
          // Set the visibility of the first two columns to true
          aColumns[6].setVisible(true);
          aColumns[7].setVisible(true);
    
    
    
    
          var aModelData = this.getOwnerComponent().getModel("CampaignModel").getData();
    
    
          // Check if there is at least one CampaignId in aModelData
    
          var selectedCampaignId = (aModelData.length) ? aModelData[0].CampaignId : "";
    
          var salesOrderItems = selectedItems.map(function (item) {
            var isItemSelected = item.IsSelected === true || item.IsSelected === 'true';
            var campaignIdForItem = Array.isArray(item.CampaignId) ? item.CampaignId : [];
            var conditionTypeForItem = Array.isArray(item.ConditionType) ? item.ConditionType : [];
    
    
            return {
              "FreeItem": isItemSelected,
              "Zcampaign": item.CampaignID,
              "SalesorderNo": "",
              "ItmNumber": item.ItmNumber.toString(),
              "Material": item.ArticleNo.toString(),
              "Plant": sStoreId,
              "TargetQty": item.quantity.toString(),
              "TargetQu": "PC",
              "ItemCateg": "",
              "ShortText": "",
              "SerialNo": item.SerialNo,
              "Stloc": item.Stloc.toString(),
              "ConditionType": item.ConditionType
            };
          });
    
          salesOrderItems = salesOrderItems.filter(function (item) {
            return item !== null;
          });
          var salesOrderPayload = {
            "Action": "",
            "DocDate": formattedDate,
            "Plant": sStoreId,
            "OrdReason": selectedKey,
            "SalesEmp": selectedText,
            "SalesorderNo": "",
            "SoldTo": "LOCAL",
            "ZCampaign": defaultFlag == true ? "" : selectedHeaderCampaignKey, // No need to set ZCampaign at this level
            "PointConsumed": "0.00",
            "CampType": "",
            "PointBalance": "0.00",
            "SaveDocument": "",
            "ConditionType": defaultFlag == true ? "" : selectedCampaignConditionType,
            "to_items": salesOrderItems
          };
          var bIsChecked = this.byId("salesorderreason").getSelected(); // Replace 'yourCheckBoxId' with the actual ID
          var storeType = this.getView().getModel("StoreModel").getProperty("/selectedStoreType");
          // Update the 'Action' property based on checkbox state
          if (bIsChecked && storeType == "B") {
            salesOrderPayload.Action = "RETURN";
          } else if (bIsChecked && storeType !== "B") {
            salesOrderPayload.Action = "STR_RETURN";
          } else {
            salesOrderPayload.Action = "NORMAL";
          }
    
          if (defaultFlag != true) {
            var oBusyDialog = new sap.m.BusyDialog({
              title: that.getOwnerComponent().getModel("i18n").getProperty("apply_promotion"),
              text: that.getOwnerComponent().getModel("i18n").getProperty("Please_Wait")
            });
            oBusyDialog.open();
          }
          var that = this;
    
          this.getOwnerComponent().getModel("mainModel").create("/SalesOrderHeadSet", salesOrderPayload, {
            success: function (response) {
    
              if (defaultFlag != true) {
                oBusyDialog.close();
              }
    
    
              var oExistingModel = that.getView().getModel("SelectedItems");
    
    
              // Get the current data from the model
              var oData = oExistingModel.getProperty("/selectedItems");
    
              // Merge the new data into the existing data
              var responseData = response.to_items.results; // Adjust this based on the actual path in your response
    
              // Find matching items based on ItmNumber
              oData.forEach(function (existingItem) {
    
                var newItem = responseData.find(function (newItem) {
                  return existingItem.ItmNumber === newItem.ItmNumber;
                });
    
                if (newItem) {
                  Object.assign(existingItem, newItem);
                }
    
              });
    
              // Update the property with the updated array
              oData.forEach(function (item) {
                item.Discount = parseFloat(item.Discount).toFixed(2);
                item.NetPrice = parseFloat(item.NetPrice).toFixed(2);
                item.RetailPrice = parseFloat(item.RetailPrice).toFixed(2);
                item.TargetQty = parseFloat(item.TargetQty).toFixed(2);
                item.TaxAmount = parseFloat(item.TaxAmount).toFixed(2);
              });
    
    
              oExistingModel.setProperty("/selectedItems", oData);
              that.onTableUpdateFinished();
              if (defaultFlag != true) {}
            },
            error: function (error) {
              if (defaultFlag != true) {
                oBusyDialog.close();
              }
              var errorDetails = error.responseText ? JSON.parse(error.responseText).error.innererror.errordetails : [];
              var errorMessage = that.getOwnerComponent().getModel("i18n").getProperty("error_Details") + ":\n";
    
              errorDetails.forEach(function (detail) {
                errorMessage += "- " + detail.message + "\n";
              });
    
              // Show the error message in a message box or dialog
              sap.m.MessageBox.error(errorMessage, {
                title: that.getOwnerComponent().getModel("i18n").getProperty("Error")
              });
            }
          });
    
        },
    
        onDeleteItem: function (oEvent) {
          var that = this; // Preserve the reference to 'this'
    
          sap.m.MessageBox.confirm(
            this.getOwnerComponent().getModel("i18n").getProperty("delete_this_product"), {
              title: this.getOwnerComponent().getModel("i18n").getProperty("Confirmation"),
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  var oButton = oEvent.getSource();
                  var oContext = oButton.getBindingContext("SelectedItems");
                  var oModel = oContext.getModel("SelectedItems");
                  var sPath = oContext.getPath();
                  var iIndex = parseInt(sPath.split("/")[sPath.split("/").length - 1]);
    
                  var aSelectedBrands = oModel.getProperty("/selectedItems");
                  aSelectedBrands.splice(iIndex, 1); // Remove the item from the array
                  oModel.setProperty("/selectedItems", aSelectedBrands);
                  that.onTableUpdateFinished();
                } else {
                  // Handle cancel action or do nothing if cancel is pressed
                }
              }
            }
          );
        },
    
        onPriceUpdate1: function (oEvent) {
          this.userInput = parseFloat(oEvent.getParameter("value")) || 0;
          this.calculateBalance();
        },
    
        onPriceUpdate2: function (oEvent) {
          this.userInput1 = parseFloat(oEvent.getParameter("value")) || 0;
          this.calculateBalance();
        },
    
        onPriceUpdate3: function (oEvent) {
          this.userInput2 = parseFloat(oEvent.getParameter("value")) || 0;
          this.calculateBalance();
        },
    
        calculateBalance: function () {
          // Assign default values of 0 if any variable is undefined
          this.userInput = this.userInput || 0;
          this.userInput1 = this.userInput1 || 0;
          this.userInput2 = this.userInput2 || 0;
    
          var getTotalInputAmount = this.userInput + this.userInput1 + this.userInput2;
          this.getBalanceAmount = this.totalNetAndTaxPrice - getTotalInputAmount.toFixed(2);
          this.getBalanceAmount = this.getBalanceAmount.toFixed(2)
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[4].getFields()[0].setText("Balance Amount: " + this.getBalanceAmount + ' ' +  this.getView().getModel("SelectedItems").oData.selectedItems[0].Currency);
          // var oBalanceModel = this.getView().getModel("balanceModel");
          // oBalanceModel.setProperty("/balance", this.getBalanceAmount);
        },
    
        onSavePress: function () {
    
          var oCartModel = this.getView().getModel("SelectedItems");
          var selectedItems = oCartModel.getProperty("/selectedItems");
          if (!selectedItems || selectedItems.length === 0) {
            sap.m.MessageBox.error(this.getOwnerComponent().getModel("i18n").getProperty("Please_select_items_Create_Sales_Order"));
            return;
    
          }
    
          var storeType = this.getView().getModel("StoreModel").getProperty("/selectedStoreType");
    
          if (storeType === "B" && this.totalNetAndTaxPrice === "0.00") {
            this.onSavePressServicecall();
          } else if (storeType === "B") {
            this.onConditionTypeButtonPress();
          } else {
            this.onSavePressServicecall();
          }
    
        },
    
        onSavePressServicecall: function () {
          var that = this;
          var SModel = this.getOwnerComponent().getModel("SalesEmployeeModel");
          var UserEmail = SModel.getProperty("/results/0/Email");
    
          var datePicker = this.getView().byId("DP2");
          var selectedDate = datePicker.getDateValue();
          var milliseconds = selectedDate.getTime();
          var formattedDate = '/Date(' + milliseconds + ')/';
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          var oCartModel = this.getView().getModel("SelectedItems");
          var selectedItems = oCartModel.getProperty("/selectedItems");
          var OrderReason = this.getView().byId("orderreason").getSelectedKey();
          var selectedHeaderCampaignKey = this.getView().byId("headercampaigninput").getValue().split(' ')[0]; // Assuming "Campaign" is the ID of your ComboBox
          var selectedCampaignConditionType = this.getView().byId("headercampaigninput").getValue().split(' ')[1];
          var selectedText = this.getView().byId("salesemployeeinput").getValue();
          var hasZeroQuantity = selectedItems.some(function (item) {
            return item.quantity === 0;
          });
    
          if (hasZeroQuantity) {
    
            sap.m.MessageBox.error(this.getOwnerComponent().getModel("i18n").getProperty("Please_select_Please_select_quantity_greater_0a_Store"));
            return;
          }
    
          // Ensure item.CampaignId is an array
    
    
          var salesOrderItems = [];
    
          var that = this;
          selectedItems.forEach(function (item, index) {
            var campaignIdForItem = Array.isArray(item.CampaignId) ? item.CampaignId : [];
            var conditionTypeForItem = Array.isArray(item.ConditionType) ? item.ConditionType : [];
    
            var isItemSelected = item.IsSelected === true || item.IsSelected === 'true';
            var ConditionType = "";
            for (var m = 0; m < that.getOwnerComponent().getModel("CampaignModel").getData().length; m++) {
              if (that.getOwnerComponent().getModel("CampaignModel").getData()[m].CampaignId == item.CampaignId) {
                ConditionType = that.getOwnerComponent().getModel("CampaignModel").getData()[m].ConditionType;
                break;
              }
            }
            var salesOrderItem = {
              "FreeItem": isItemSelected,
              "Zcampaign": item.CampaignID,
              "SalesorderNo": "",
              "ItmNumber": item.ItmNumber.toString(),
              "Material": item.ArticleNo.toString(),
              "Plant": sStoreId,
              "TargetQty": item.quantity.toString(),
              "TargetQu": "PC",
              "ItemCateg": "",
              "ShortText": "",
               "SerialNo": item.SerialNo,
              "Stloc": item.Stloc.toString(),
              "ConditionType": item.ConditionType,
            };
    
            salesOrderItems.push(salesOrderItem);
          });
    
          var salesOrderPayload = {
            "Action": "",
            "DocDate": formattedDate,
            "Plant": sStoreId,
            "OrdReason": OrderReason,
            "SalesEmp": selectedText,
            "SalesorderNo": "",
            "SoldTo": this.getView().byId("firstNameInput").getValue(),
            "ZCampaign": selectedHeaderCampaignKey,
            "PointConsumed": "0.00",
            "CampType": "",
            "PointBalance": "0.00",
            "SaveDocument": "X",
            "PurchaseOrdNo": this.getView().byId("poreferenceno").getValue(),
            "CreatedByEmail": UserEmail,
            "ConditionType": selectedCampaignConditionType,
            "to_items": salesOrderItems,
            "to_conditions": this.conditionTypeArr
          };
          var bIsChecked = this.byId("salesorderreason").getSelected(); // Replace 'yourCheckBoxId' with the actual ID
          var storeType = this.getView().getModel("StoreModel").getProperty("/selectedStoreType");
          // Update the 'Action' property based on checkbox state
          if (bIsChecked && storeType == "B") {
            salesOrderPayload.Action = "RETURN";
          } else if (bIsChecked && storeType !== "B") {
            salesOrderPayload.Action = "STR_RETURN";
          } else {
            salesOrderPayload.Action = "NORMAL";
          }
          var salesOrderItems = [];
          var that = this;
    
    
    
          var oBusyDialog = new sap.m.BusyDialog({
            title: that.getOwnerComponent().getModel("i18n").getProperty("Creating_Sales_Order"),
            text: that.getOwnerComponent().getModel("i18n").getProperty("Please_Wait")
          });
          oBusyDialog.open();
          this.getOwnerComponent().getModel("mainModel").create("/SalesOrderHeadSet", salesOrderPayload, {
            success: function (response) {
              oBusyDialog.close();
              that.getView().byId("headercampaigninput").setValue();
              that.getView().byId("poreferenceno").setValue();
              that.getView().byId("salesorderreason").setSelected(false);
              that.getView().byId("orderFormElement").setVisible(false);
              that.getView().byId("orderreason").setSelectedKey("");
              that.conditionTypeArr = [];
              that.getView().byId("totalnetprice").setText("Total Tax Price: " + 0.00)
              that.getView().byId("totaltaxprice").setText("Total Net Price: " + 0.00)
              that.getView().byId("totalNetAndTaxPrice").setText("Total Price incl Tax: " + 0.00)
              var oModel = that.getOwnerComponent().getModel("SelectedItems");
              oModel.setData({
                modelData: {}
              });
              oModel.updateBindings(true);
              var salesOrderNo = response.SalesorderNo; // Replace 'SalesorderNo' with the actual property name from your response
              var sInputValue = that.getView().byId("firstNameInput").getValue();
              var actions = [];
              var Print = that.getOwnerComponent().getModel("i18n").getProperty("Print");
              var Email = that.getOwnerComponent().getModel("i18n").getProperty("Email");
              var Close = that.getOwnerComponent().getModel("i18n").getProperty("Close");
    
              if (isNaN(sInputValue)) {
                actions = [Print, Close]
              } else {
                actions = [Print, Email, Close]
              }
    
              sap.m.MessageBox.success(that.getOwnerComponent().getModel("i18n").getProperty("SO_Created") + ": " + salesOrderNo, {
    
                styleClass: "",
                actions: actions,
                emphasizedAction: "Check",
    
                onClose: (sAction) => {
    
                  if (sAction === that.getOwnerComponent().getModel("i18n").getProperty("Close")) {
                    var oModel = that.getOwnerComponent().getModel("SelectedItems");
                    oModel.setData({
                      modelData: {}
                    });
                    oModel.updateBindings(true);
    
                    that.saveFlag = true;
                    that.oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                    that.oRouter.navTo("mainmenu");
                    that.getView().byId("Campaign").setSelectedKey("");
    
                  } else if (sAction === that.getOwnerComponent().getModel("i18n").getProperty("Print")) {
    
                    if (!that.valueHelpForPdfViewer)
                    that.valueHelpForPdfViewer = new sap.ui.xmlfragment("com.luxasia.salesorder.view.pdfViewerForSalesOrder", this);
                    that.getView().addDependent(that.valueHelpForPdfViewer);
                    var oModel = that.getOwnerComponent().getModel("mainModel");
                    var baseUrl = oModel.sServiceUrl;
                    var sServiceURl = "/PdfPrintSet(SalesOrderNo='" + salesOrderNo + "',Action='PDF')/$value";
                    that.valueHelpForPdfViewer.open();
                    var htmlControl = that.valueHelpForPdfViewer.getContent()[0];
                    htmlControl.setContent('<div id="pdfContainer"></div>'); // Container for canvases
    
                    // Function to clear the container
                    function clearContainer() {
                      var container = document.getElementById('pdfContainer');
                      while (container.firstChild) {
                        container.removeChild(container.firstChild);
                      }
                    }
    
                    // Make an AJAX request to fetch the PDF data
                    $.ajax({
                      url: baseUrl + sServiceURl,
                      method: "GET",
                      xhrFields: {
                        responseType: 'blob'
                      },
                      success: function (data) {
                        var reader = new FileReader();
    
                        reader.onloadend = function () {
                          var base64String = reader.result;
                          var base64Data = base64String.split(';base64,').pop();
                          var pdfdata = atob(base64Data);
    
                          // Ensure PDF.js library is loaded
                          if (typeof pdfjsLib !== 'undefined') {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
    
                            var loadingTask = pdfjsLib.getDocument({
                              data: pdfdata
                            });
                            loadingTask.promise.then(function (pdf) {
    
    
                              var container = document.getElementById('pdfContainer');
    
                              // Clear the container before rendering new pages
                              clearContainer();
    
                              // Clear the global pdfImages array
                              pdfImages = [];
    
                              // Function to render each page onto a separate canvas
                              var renderPage = function (pageNum) {
                                pdf.getPage(pageNum).then(function (page) {
    
                                  var scale = 2.0; // Higher scale for improved quality
                                  var viewport = page.getViewport({ scale: scale });
                          
                                  // Create a new canvas for each page
                                  var canvas = document.createElement('canvas');
                                  var context = canvas.getContext('2d');
                          
                                  // Set canvas dimensions based on viewport size
                                  canvas.width = viewport.width * window.devicePixelRatio;
                                  canvas.height = viewport.height * window.devicePixelRatio;
                                  canvas.style.width = viewport.width + 'px'; // Style width
                                  canvas.style.height = viewport.height + 'px'; // Style height
                          
                                  // Scale context to match device pixel ratio
                                  context.scale(window.devicePixelRatio, window.devicePixelRatio);
                          
                                  // Apply styles to make canvases display vertically
                                  canvas.style.display = 'block';
                                  canvas.style.marginBottom = '10px';
                          
                                  container.appendChild(canvas);
                          
                                  var renderContext = {
                                      canvasContext: context,
                                      viewport: viewport
                                  };
                                  // Render the page onto the canvas
                                  page.render(renderContext).promise.then(function () {
    
    
                                    // Convert canvas to image and store in the global pdfImages array
                                    pdfImages.push(canvas.toDataURL('image/png'));
    
                                    if (pageNum < pdf.numPages) {
                                      renderPage(pageNum + 1); // Render next page
                                    }
                                  })
                                })
                              };
    
                              // Start rendering from the first page
                              renderPage(1);
                            })
                          }
                        };
    
                        // Read the fetched PDF blob as data URL
                        reader.readAsDataURL(data);
                      },
    
                    });
                  } else if (sAction === that.getOwnerComponent().getModel("i18n").getProperty("Email")) {
                    var oModel = that.getOwnerComponent().getModel("mainModel");
                    var baseUrl = oModel.sServiceUrl;
                    var sEmailUrl = "/PdfPrintSet(SalesOrderNo='" + salesOrderNo + "',Action='EMAIL')/$value"
    
                    $.ajax({
                      url: baseUrl + sEmailUrl,
                      method: "GET",
    
                      success: function (data) {
                        sap.m.MessageToast.show(that.getOwnerComponent().getModel("i18n").getProperty("Email_Sent"));
                      }
                    });
                    var oModel = that.getOwnerComponent().getModel("SelectedItems");
                    oModel.setData({
                      modelData: {}
                    });
                    oModel.updateBindings(true);
                    that.saveFlag = true;
                    that.oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                    that.oRouter.navTo("mainmenu");
                
                  }
                }
              });
    
            },
    
            error: function (error) {
              oBusyDialog.close();
              var errorDetails = error.responseText ? JSON.parse(error.responseText).error.innererror.errordetails : [];
              var errorMessage = that.getOwnerComponent().getModel("i18n").getProperty("error_Details") + ":\n";
              errorDetails.forEach(function (detail) {
                errorMessage += "- " + detail.message + "\n";
              });
              // Show the error message in a message box or dialog
              sap.m.MessageBox.error(errorMessage, {
                title: that.getOwnerComponent().getModel("i18n").getProperty("Error")
              });
            }
          });
        },
    
        handlePdfViewerCancel: function () {
          var that = this;
          var oModel = that.getOwnerComponent().getModel("SelectedItems");
          oModel.setData({
            modelData: {}
          });
          oModel.updateBindings(true);
          this.valueHelpForPdfViewer.close();
          this.getView().byId("headercampaigninput").setValue();
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[4].getFields()[0].setText("");
          this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          this.oRouter.navTo("mainmenu");
        },
    
        onConditionTypeButtonPress: function () {
          this.userInput = 0
          this.userInput1 = 0
          this.userInput2 = 0
          this.conditionType.setModel(this.getOwnerComponent().getModel("mainModel"));
          this.conditionType.open();
          var Currency  = this.getView().getModel("SelectedItems").oData.selectedItems[0].Currency
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[3].getFields()[0].setText("Price Inc Tax: " + this.totalNetAndTaxPrice + ' ' + Currency);
         
          
          // var TotalTaxNetModel = new sap.ui.model.json.JSONModel("TotalTaxNetModel")
          // this.getView().setModel(TotalTaxNetModel, "TotalTaxNetModel");
          // TotalTaxNetModel.setProperty("/totaltaxandnetprice", this.totalNetAndTaxPrice)
    
        },
    
        onConditionTypeConfirm: function (evt) {
          this.conditionTypeArr = [];
          var conditionType1 = this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[0].getSelectedKey();
          var conditionType2 = this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[1].getFields()[0].getSelectedKey();
          var conditionType3 = this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[2].getFields()[0].getSelectedKey();
          //amount fields
          var amount1 = this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[0].getFields()[0].getItems()[0].getValue();
          var amount2 = this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[1].getFields()[0].getItems()[0].getValue();
          var amount3 = this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[2].getFields()[0].getItems()[0].getValue();
          //totalAmount comparison
          var totalNetPrice = this.totalNetAndTaxPrice;
          amount1 = amount1.length == 0 ? 0 : parseFloat(amount1);
          amount2 = amount2.length == 0 ? 0 : parseFloat(amount2);
          amount3 = amount3.length == 0 ? 0 : parseFloat(amount3);
          var totalPaymentPrice = amount1 + amount2 + amount3;
          totalPaymentPrice = totalPaymentPrice.toFixed(2);
          totalPaymentPrice = parseFloat(totalPaymentPrice);
          if (conditionType1.length == 0 && conditionType2.length == 0 && conditionType3.length == 0) {
            sap.m.MessageBox.error(this.getOwnerComponent().getModel("i18n").getProperty("Please_select_atleast_one_payment_type"));
          } else if (totalNetPrice > totalPaymentPrice) {
            sap.m.MessageBox.error(this.getOwnerComponent().getModel("i18n").getProperty("Entered_amount_lesser_totalprice"));
          } else if (totalPaymentPrice > totalNetPrice) {
            sap.m.MessageBox.error(this.getOwnerComponent().getModel("i18n").getProperty("Entered_amount_greater_totalprice"));
          } else {
            if (conditionType1.length > 0 && amount1.toString().length > 0) {
              this.conditionTypeArr.push({
                "CondType": conditionType1,
                "CondValue": amount1.toString(),
                "Currency": "SGD"
              });
            }
            if (conditionType2.length > 0 && amount2.toString().length > 0) {
              this.conditionTypeArr.push({
                "CondType": conditionType2,
                "CondValue": amount2.toString(),
                "Currency": "SGD"
              });
            }
            if (conditionType3.length > 0 && amount3.toString().length > 0) {
              this.conditionTypeArr.push({
                "CondType": conditionType3,
                "CondValue": amount3.toString(),
                "Currency": "SGD"
              });
            }
        
          
           
            this.conditionType.close();
            this.onSavePressServicecall();
            this.onConditionTypeCancel();
          }
        },
    
        onConditionTypeCancel: function () {
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[0].setSelectedKey(null);
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[1].getFields()[0].setSelectedKey(null);
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[2].getFields()[0].setSelectedKey(null);
          //amount fields
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[0].getFields()[0].getItems()[0].setValue("");
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[1].getFields()[0].getItems()[0].setValue("");
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[2].getFields()[0].getItems()[0].setValue("");
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[4].getFields()[0].setText();
          this.conditionType.close();
        },
    
        handleResetConditionType1: function (evt) {
          this.userInput = 0
          this.calculateBalance();
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[0].getFields()[0].setSelectedKey(null);
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[0].getFields()[0].getItems()[0].setValue("");
        },
    
        handleResetConditionType2: function (evt) {
          this.userInput1 = 0
          this.calculateBalance();
         
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[1].getFields()[0].setSelectedKey(null);
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[1].getFields()[0].getItems()[0].setValue("");
        },
    
        handleResetConditionType3: function (evt) {
          this.userInput2 = 0
          this.calculateBalance();
          this.conditionType.getContent()[0].getFormContainers()[0].getFormElements()[2].getFields()[0].setSelectedKey(null);
          this.conditionType.getContent()[0].getFormContainers()[1].getFormElements()[2].getFields()[0].getItems()[0].setValue("");
        },
    
        onCancelPress: function () {
          var that = this;
          var oModel = that.getOwnerComponent().getModel("SelectedItems");
          oModel.setData({
            modelData: {}
          });
          oModel.updateBindings(true);
          this.getView().byId("headercampaigninput").setValue();
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("MainMenu");
        },
      });
    });