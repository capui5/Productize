sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/UIComponent"
    ],
    function (BaseController,UIComponent) {
      "use strict";
  
      return BaseController.extend("com.product.salesorder.controller.BaseController", {
        onInit: function () {

        },
        onCashCarry: function () {
            if (!this.CashCarry) {
              this.CashCarry = sap.ui.xmlfragment("com.product.salesorder.Fragments.CashCarry", this)
              this.getView().addDependent(this.CashCarry)
            }
            this.CashCarry.open();
          },
    
          onCloseCashCarry: function () {
            this.CashCarry.close();
          },
        onSearchProducts:function(){
            if (!this.SearchProduct) {
              this.SearchProduct = sap.ui.xmlfragment("com.product.salesorder.Fragments.SearchProduct", this)
              this.getView().addDependent(this.SearchProduct)
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
                  this.SearchProduct.getContent()[0].getBinding("items").filter(oFinalFilter);
                  this.SearchProduct.getContent()[0].removeSelections(true);
                  this.SearchProduct.open();
                 
              }
          }
      
          },
          closeSearchProd:function(){
            this.SearchProduct.close();
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
                                return brand.BrandId;
                            });
    
                            var aBrandFilters = aBrandIds.map(function (brandId) {
                                return new sap.ui.model.Filter("Brand_Id", sap.ui.model.FilterOperator.EQ, brandId);
                            });
    
    
                            var oCombinedBrandFilters = new sap.ui.model.Filter({
                                filters: aBrandFilters,
                                and: false // Change this based on your logic, whether it's 'AND' or 'OR'
                            });
    
                            var oStoreModel = that.getOwnerComponent().getModel("StoreModel");
    
                            var sStoreId = oStoreModel.getProperty("/selectedStoreId");
    
                            var oStoreFilter = new sap.ui.model.Filter("StoreId", sap.ui.model.FilterOperator.EQ, sStoreId);
    
                            var oModel = that.getOwnerComponent().getModel("mainModel");
    
                            var oFinalFilter = new sap.ui.model.Filter({
                                filters: [oCombinedBrandFilters, oStoreFilter],
                                and: true
                            });
    
                            var sSearchParam = "search=" + sText;
    
                            oModel.read("/ProductSet", {
                                filters: [oFinalFilter],
                                urlParameters: sSearchParam,
                                success: function (response) {
                                    var data = (response.results);
                                    console.log(data);
                                    var oJsonModel = new sap.ui.model.json.JSONModel();
                                    oJsonModel.setData(response.results);
                                    response.results.forEach(function (obj) { obj.quantity = 1 });
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
                                                    return item.ArticleNo === oFoundItem.ArticleNo;
                                                });
    
                                                if (existingItem) {
                                                    // If the item already exists, increase the quantity
                                                    existingItem.quantity += 1;
                                                    console.log("Quantity incremented for existing item:", existingItem);
                                                } else {
                                                    // If the item is not found, push it to the array with quantity 1
                                                    oFoundItem.quantity = 1;
                                                    aSelectedItems.push(oFoundItem);
                                                    console.log("New item added to selectedItems:", oFoundItem);
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
                                                } else {
                                                    console.error("Model 'SelectedItems' not found.");
                                                }
    
                                                var oModel = that.getOwnerComponent().getModel("CustomerNoModel");
                                                oModel.setData({ modelData: {} });
                                                oModel.updateBindings(true);
                                                var oCustomerNoModel = that.getView().getModel("CustomerNoModel");
                                                if (!oCustomerNoModel) {
                                                    oCustomerNoModel = new sap.ui.model.json.JSONModel();
                                                    that.getView().setModel(oCustomerNoModel, "CustomerNoModel");
                                                }
    
                                                // var selectedText = that.getView().byId("CASHCARRY").getSelectedItem();
    
                                                // if (!selectedText) {
                                                    
                                                //     sap.m.MessageBox.error(that.getOwnerComponent().getModel("i18n").getProperty("Please_select_Cash_Carry"));
                                                // } else {
                                                //     var selectedTextValue = selectedText.getText();
    
                                                //     var aCustomerFirstnames = oCustomerNoModel.getProperty("/Firstnames") || [];
                                                //     aCustomerFirstnames.push(selectedTextValue);
                                                //     oCustomerNoModel.setProperty("/Firstnames", aCustomerFirstnames);
                                                // }
    
                                                // Navigate to the transaction page and pass the selected items
                                                that.getOwnerComponent().getRouter().navTo("Transaction", {
                                                    selectedItems: encodeURIComponent(JSON.stringify(aSelectedItems)),
                                                });
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
      });
    }
  );