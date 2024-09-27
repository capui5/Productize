sap.ui.define([
    "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel"
],
function (Controller,JSONModel) {
    "use strict";

    return Controller.extend("com.product.salesorder.controller.StoreSelection", {
        onInit: function () {
            var that = this;
            // To Get the Login User data  from Btp
            var lModel = this.getOwnerComponent().getModel("LoginUserModel");
            this.getView().setModel(lModel, "LoginUserModel");
            var mModel = this.getOwnerComponent().getModel("mainModel");
            var SModel = this.getOwnerComponent().getModel("SalesEmployeeModel");
            this.getView().setModel(SModel, "SalesEmployeeModel");
            var that = this;
            const url = that.getBaseURL() + "/user-api/attributes";
      
            $.ajax({
              url: url,
              type: "GET",
              success: function (data) {
              
                lModel.setData(data);
                // that.onLoadUserData(lModel);
              
              },
              error: function (xhr, status, error) {
              }
            }); 
      
             that.onLoadUserData(lModel);
            var storedStoreId = localStorage.getItem("selectedStoreId");
            // Function to load all stores on view initialization
            const oComponent = this.getOwnerComponent();
            const oModel = oComponent.getModel("mainModel");
      
            // If the model is already available, proceed to load stores
      
            var oStoreModel = new JSONModel({ selectedStoreId: storedStoreId });
            this.getOwnerComponent().setModel(oStoreModel, "StoreModel");
      
            // Ensure StoreModel always updates localStorage
            oStoreModel.attachPropertyChange(function (oEvent) {
              if (oEvent.getParameter("path") === "/selectedStoreId") {
                var sNewStoreId = oEvent.getParameter("value");
                localStorage.setItem("selectedStoreId", sNewStoreId);
              }
            });
          },
      
          onLoadUserData: function () {
            var that = this;
            var lModel = this.getOwnerComponent().getModel("LoginUserModel");
            var mModel = this.getOwnerComponent().getModel("mainModel");
            var SModel = this.getOwnerComponent().getModel("SalesEmployeeModel");
            this.getView().setModel(SModel, "SalesEmployeeModel");
            var email = lModel.getProperty("/email");
            // console.log("Email:", email);
            
        //   var sEmail = email;
          var sEmail = "BPINST@gmail.com";
            mModel.read("/SalesEmployees", {
              urlParameters: {
                StoreId: "''",
                Email: "'" + sEmail + "'"
              },
              success: function (odata) {
                if(odata.results[0].Land){
                  var lowercaseLand = odata.results[0].Land.toLowerCase();
                  sap.ui.getCore().getConfiguration().setLanguage(lowercaseLand);
                 }
                else{
                  sap.ui.getCore().getConfiguration().setLanguage("en");
                }
                SModel.setData(odata);
                // console.log(SModel);
                that.onhandleemployeedata(SModel);
              
              },
              error: function (error) {
                // Handle errors here
                // console.error("Error:", error);
              }
            });
          },
      
          onhandleemployeedata: function (SModel) {
            // var SModel = this.getOwnerComponent().getModel("SalesEmployeeModel");
      
            var Country = SModel.getProperty("/results/0/Land")
            // console.log(Country)
            var country = new sap.ui.model.Filter("Country", "EQ", Country);
            this.handleTransactionSalesData(country);
          },
          handleTransactionSalesData: function (filter1) {
            var that = this;
            var lModel = this.getOwnerComponent().getModel("LoginUserModel");
            var filters = new sap.ui.model.Filter([filter1], true);
            this.getView().byId("storeSelect").getBinding("items").filter(filters);
            var cModel = that.getOwnerComponent().getModel("CapModel", true);
            // var sEmail = "christintan@luxasia.com";
            // lModel.getProperty("/email")
            var sUrl =  "/STORE?$filter=REQ_ID1_Email eq '"+lModel.getProperty("/email")+"'&$orderby=createdAt desc&$top=1"
            cModel.read(sUrl, {
              success: function (data, oResponse) {
                
                var responseData = JSON.parse(oResponse.body);
                var storeData = responseData.value[0];
                var storeID = storeData.storeID;
                var localModel = new sap.ui.model.json.JSONModel();
                localModel.setProperty("/storeID", storeID);
                that.getView().setModel(localModel, "RecentStoreModel");
                console.log("Store ID:", storeID);
                var oCountryCodeSelect = that.byId("storeSelect");
                oCountryCodeSelect.setSelectedKey(storeID);
              },
              
              error: function (error) {
                console.error("Error", error);
              }
            });
          },
          getBaseURL: function () {
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            return appModulePath;
          },
      
         getSelectedStore:function(){
          // var email = lModel.getProperty("/email");
         },
      
          onNextPagePress: function () {
            this.SalesEmpId =this.getOwnerComponent().getModel("LoginUserModel").oData.email;
          
            var oModel = this.getOwnerComponent().getModel("SelectedBrandName");
            oModel.setData({ modelData: {} });
            oModel.updateBindings(true);
            var oComboBox = this.byId("storeSelect");
      
            if (!oComboBox) {
              console.error("ComboBox is not available.");
              return;
            }
      
            var oSelectedItem = oComboBox.getSelectedItem();
            if (!oSelectedItem) {
              sap.m.MessageToast.show("Please select a store.");
              return;
            }
            var oContext = oSelectedItem.getBindingContext("mainModel");
      
            if (oContext) {
              var sStoreId = oContext.getProperty("StoreId");
              var sStoreType = oContext.getProperty("StoreType");
              var storeCount = oContext.getProperty("Country")
              var oJsonModel = this.getView().getModel("StoreModel");
      
              if (oJsonModel) {
                oJsonModel.setProperty("/selectedStoreId", sStoreId);
                oJsonModel.setProperty("/selectedStoreType", sStoreType);
                oJsonModel.setProperty("/selectedCountry", storeCount)
                // Save selectedStoreId to localStorage
                localStorage.setItem("selectedStoreId", sStoreId);
      
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Brand", { SStoreId: sStoreId });
              } else {
                console.error("Store model not found.");
              }
            } else {
              console.error("Binding context is not available.");
            }
          }
        });
      });