sap.ui.define(
  ["./BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ndc/BarcodeScanner",
    "sap/ui/model/FilterOperator"

  ],
  function (BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("com.product.salesorder.controller.MainMenu", {
      onInit: function () {
        this.oRouter = this.getOwnerComponent().getRouter();
        if (!this.SearchProduct) {
          this.SearchProduct = sap.ui.xmlfragment("com.product.salesorder.Fragments.SearchProduct", this)
          this.getView().addDependent(this.SearchProduct)
        }
      },

      TodayTransaction: function () {
        this.oRouter.navTo("TodayTransaction");
      },


      onCloseCashCarry: function () {
        this.CashCarry.close();
      },

      onCreateCustomer: function () {
        if (!this.NewProfile) {
          this.NewProfile = sap.ui.xmlfragment("com.product.salesorder.Fragments.NewProfile", this)
          this.getView().addDependent(this.NewProfile)
        }
        this.NewProfile.open();
      },


      onCloseNewProfile: function () {
        this.NewProfile.close();
      },
      onSearchProduct: function () {


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
            this.searchproduct.getContent()[0].getBinding("items").filter(oFinalFilter);
            this.searchproduct.getContent()[0].removeSelections(true);
            this.searchproduct.open();

          }
        }
      },

      closeSearchProd: function () {
        this.SearchProduct.close();
      },
      SearchCustomer: function () {
        this.oRouter.navTo("SearchCustomer")
      },

      CreateCustomer: function () {
        this.oRouter.navTo("NewProfile")
      },
      onAddToSale: function () {
        this.SearchProduct.close();
        this.oRouter.navTo("Transaction")
      },
      _onRouteMatched: function (oEvent) {
        ;
        var that = this;
        var oArgs = oEvent.getParameter("arguments");
        var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
        var sStoreId = oStoreModel.getProperty("/selectedStoreId");
        var aModel = this.getView().getModel("mainModel");
        var oJsonModel = this.getView().getModel("LocalTouristModel");
        var oFilter = new sap.ui.model.Filter([
          new sap.ui.model.Filter("Action", sap.ui.model.FilterOperator.EQ, "OTC"),
          new sap.ui.model.Filter("StoreId", sap.ui.model.FilterOperator.EQ, sStoreId)
        ], true); // Use 'true' for AND logic between filters

        // Fetch the data
        aModel.read("/CustomerSet", {
          filters: [oFilter],
          success: function (response) {
            oJsonModel.setData(response.results)
          },
          error: function (error) {
            // Handle errors
          }
        });
      },
      onNavBacktoBrand: function () {
        var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
        var sStoreId = oStoreModel.getProperty("/selectedStoreId");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("brand", {
          SStoreId: sStoreId
        });
      },
      onSearch: function (oEvent) {

        var sQuery = oEvent.getParameter("query");

        var oTable = this.SearchProduct.getContent()[0];
        var oBinding = oTable.getBinding("items");

        var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");

        if (sQuery && sQuery.length > 0) {
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

            var filters = new sap.ui.model.Filter({
              filters: [oCombinedBrandFilters, oStoreFilter],
              and: true
            });
            oBinding.sCustomParams = "search=" + sQuery.toUpperCase();
            oBinding.filter(new Filter(filters, false));
          }
        } else {
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

            var filters = new sap.ui.model.Filter({
              filters: [oCombinedBrandFilters, oStoreFilter],
              and: true
            });
            oBinding.sCustomParams = "search=";
            oBinding.filter(filters);
          }
        }
      },
      onAddToSale: function () {

        var aSelectedItems = [];
        // var oStepInput = this.getView().byId("CurrentValue");
        var selectedItems = this.SearchProduct.getContent()[0].getSelectedItems();   // var selectedQuantity = oStepInput.getValue();
        // var oTable = this.getView().byId("myDialog");
        // var aListItems = oTable.getSelectedItems();

        selectedItems.forEach(function (oListItem) {
            var oBindingContext = oListItem.getBindingContext("mainModel");
            if (oBindingContext) {
                var oSelectedItem = oBindingContext.getObject();

                // Convert AvailableQty to a number
                oSelectedItem.AvailableQty = parseFloat(oSelectedItem.AvailableQty);
                if (oSelectedItem.hasOwnProperty("ARTICLENO")) {
                    oSelectedItem.ArticleNo = oSelectedItem.ARTICLENO;
                    delete oSelectedItem.ARTICLENO;
                }


                if (!oSelectedItem.hasOwnProperty("quantity")) {
                    oSelectedItem.quantity = 1;
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

            // Assign incremental ItmNumber to each item in selectedItems array
            aSelectedItems.forEach(function (item, index) {
                // Incremental padding for ItemNumber (e.g., 0010, 0020, etc.)
                var paddedIndex = (index + 1) * 10; // Increase by 10 for every index

                // Format the paddedIndex to a 4-digit string (e.g., 0010, 0020)
                var formattedIndex = ('000000' + paddedIndex).slice(-6);

                // Assign the formatted ItmNumber to each item
                item.ItmNumber = formattedIndex;
            });

            // Add the modified selected items back to the model data
            oData.selectedItems = aSelectedItems;

            // Update the model with the modified data
            oModel.setData(oData);
            var totalRetailPrice = 0;
            var that = this; // Store the reference to 'this'




            // Log or use the total retail price value
            // console.log("Total Retail Price: " + totalRetailPrice);
        } else {
            console.error("Model 'SelectedItems' not found.");
        }
        // Optionally, you can navigate to the next page here
        // ...


        // Navigate to cart view and pass selected items
        this.getOwnerComponent().getRouter().navTo("Transaction", {
            selectedItems: encodeURIComponent(JSON.stringify(aSelectedItems)),
            // selectedQuantity: selectedQuantity,
        });

        if (this.pDialog) {
            this.pDialog.then(function (dialog) {
                dialog.close();
                dialog.destroy();
            });
            this.pDialog = null;
        }
    },
     
    });
  }

);