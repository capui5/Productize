sap.ui.define(
    [
      "sap/ui/core/mvc/Controller"
    ],
    function (BaseController) {
      "use strict";
  
      return BaseController.extend("com.product.salesorder.controller.NewProfile", {
        onInit: function () {
     
          var aModel = this.getOwnerComponent().getModel("CustomerNoModel")
          this.getView().setModel(aModel, "CustomerNoModel");
          var oDatePicker = this.byId("datePickerId");
          var oOwnerComponent = this.getOwnerComponent();
          if (oOwnerComponent) {
            // Your logic using the component reference goes here
          } else {
            console.error("Owner component not found.");
          }
          // Create a model for the date value and set the format options
          var oModel = new sap.ui.model.json.JSONModel({
            dateValue: new Date("1/1/2000")  // Initialize with current date or your desired initial date
          });
          oDatePicker.setModel(oModel);
    
          // Define the binding path for the DatePicker value property
          oDatePicker.bindProperty("value", {
            path: "/dateValue",
            type: new sap.ui.model.type.Date({
              pattern: "dd-MM-yyyy",
              calendarType: sap.ui.core.CalendarType.Gregorian
            })
          });
          this.oRouter = this.getOwnerComponent().getRouter();
          var oOwnerComponent = this.getOwnerComponent();
          var oStoreModel = oOwnerComponent.getModel("StoreModel");
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          var oCountrySelect = this.byId("country");
    
       
          // Read data from the model using the provided URL
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    
          oRouter.getRoute("NewProfile").attachMatched(this._onRouteMatched, this);
    
         
    
        
    
        },
    
        getRouter: function () {
          return UIComponent.getRouterFor(this);
        },
        onNavBacktoBrand: function () {
    
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("MainMenu");
        },
        _onRouteMatched: function (oEvent) {
          var that = this;
          this.CustomerInterest();
          var esModel = this.getOwnerComponent().getModel("SalesEmployeesModel");
          var oModel = this.getOwnerComponent().getModel("mainModel");
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
          var oModel = this.getOwnerComponent().getModel("mainModel");
          var email = "''";
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
          window.setTimeout(function () {
            var salesEmpDropDownItems = that.getView().byId("employeeid").getItems();
            for (var m = 0; m < salesEmpDropDownItems.length; m++) {
              if (salesEmpDropDownItems[m].getBindingContext("SalesEmployeesModel").getObject().Pernr == that.getOwnerComponent().getModel("SalesEmployeeModel").getProperty("/results/0/Pernr")) {
                that.getView().byId("employeeid").setSelectedItem(salesEmpDropDownItems[m]);
                break;
              }
    
            }
           
          }, 2000);
        },
        onAfterRendering: function (){
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var selectedCountry = oStoreModel.getProperty("/selectedCountry");
          var oCountrySelect = this.byId("country");
          var oCountryCodeSelect = this.byId("countrycode")
          oCountrySelect.setSelectedKey(selectedCountry);
          oCountryCodeSelect.setSelectedKey(selectedCountry)
        },
    
        Onroutetotranspage: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          var oCustomerNoModel = this.getView().getModel("CustomerNoModel");
    
          if (!oCustomerNoModel || !oCustomerNoModel.getProperty("/Firstnames") || oCustomerNoModel.getProperty("/Firstnames").length === 0) {
            // CustomerNo not found or empty array, display a message or take necessary action
            // For example, show a message and prevent navigation
            this.getOwnerComponent().getModel("i18n").getProperty("Customer_not_found")
            sap.m.MessageBox.error(this.getOwnerComponent().getModel("i18n").getProperty("Customer_not_found"), {
              onClose: function () {
                // Handle the action when the message box is closed
                // For example, stay on the current page or navigate elsewhere
              }
            });
          } else {
            // CustomerNo found in the model, proceed with navigation
            oRouter.navTo("transaction");
          }
        },
        onSelectTourist: function(oEvent) {
          // Get the selected state of the checkbox
          var bSelected = oEvent.getParameter("selected");
      
          // Get the view and the input fields
          var oView = this.getView();
          var oCountryCodeInput = oView.byId("countrycode");
          var oCountryInput = oView.byId("country");
      
          // Set the editable property based on the checkbox selection
          oCountryCodeInput.setEditable(bSelected);
          oCountryInput.setEditable(bSelected);
      },
        CustomerInterest: function() {
          var oModel = this.getView().getModel("mainModel");
          oModel.read("/ProductInterestSet", {
              success: function(oData) {
                  const dataByType = {
                      ZHEAR: [],
                      ZPRDINTER: [],
                      ZPRDDEMO: []
                  };
      
                  // Organize data based on Type
                  oData.results.forEach(item => {
                      dataByType[item.Type].push(item);
                  });
      
                  // Add an extra empty item to each type
                  Object.keys(dataByType).forEach(key => {
                    if (key !== "ZPRDINTER") {
                        dataByType[key].unshift({});
                    }
                });
      
                  // Create a JSONModel and set the organized data
                  const interestModel = new sap.ui.model.json.JSONModel();
                  interestModel.setData(dataByType);
      
                  // Set the model to the view
                  this.getView().setModel(interestModel, "ProductInterest");
      
                  // Log the model
                 
              }.bind(this),
              error: function(oError) {
                  console.error("Error occurred while fetching data:", oError);
              }
          });
      },
      
        onCreateProfile: function () {
          var that = this;
         
       
          var datePicker = this.getView().byId("datePickerId");
          var oBrandModel = this.getOwnerComponent().getModel("SelectedBrandName");
    
        
              var oBrandData = oBrandModel.getProperty("/selectedBrandNames");
              var brandIds = oBrandData.map(function(brand) {
                return brand.Brand_Id;
            }).join(";");
            
           
          var selectedDate = datePicker.getDateValue();
          var SModel = this.getOwnerComponent().getModel("SalesEmployeeModel");
          var UserEmail = SModel.getProperty("/results/0/Email");
    
    
          var currentDate = new Date();
          var age = currentDate.getFullYear() - selectedDate.getFullYear();
    
          // if (!this.validateRequiredFields()) {
          //   return;
          // }
          if (age < 18) {
    
            sap.m.MessageBox.error(that.getOwnerComponent().getModel("i18n").getProperty("atleast_18years_create_profile"));
            return;
          }
          var comboBox = this.byId("employeeid");
          var selectedText = comboBox.getSelectedItem().getText();
          var datePicker = this.getView().byId("datePickerId");
          var selectedDate = datePicker.getDateValue();
          var milliseconds = selectedDate.getTime();
          var formattedDat = '/Date(' + milliseconds + ')/';
          var postalCode = this.getView().byId("pcode").getValue();
          // var multiComboBox = this.getView().byId("pinterets");
    
          // // Get the selected items
          // var selectedItems = multiComboBox.getSelectedItems();
          
          // // Extract the text of each selected item
          // var selectedItemsText = selectedItems.map(function(item) {
          //     return item.getText();
          // });
          
          // // Join the selected items text with a semicolon
          // var selectedItemsString = selectedItemsText.join(';');
          
          // Now selectedItemsString contains the text of the selected items separated by semicolons
    
          var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
          var sStoreId = oStoreModel.getProperty("/selectedStoreId");
 
          var selectedCountryKey = this.getView().byId("country").getSelectedKey();
          var selectedCountryCodeText = this.getView().byId("countrycode").getSelectedItem().getText();
          var payload = {
            "Gender": "1",
            "SalesOrg": "",
            "TitleP": this.getView().byId("title").getSelectedKey() ? this.getView().byId("title").getSelectedItem().getText() : "",
            "Firstname": this.getView().byId("fname").getValue(),
            "Lastname": this.getView().byId("lname").getValue(),
            "Middlename": "",  // Assuming Middle Name is same as Last Name
            "Secondname": "Second name",
            "City": this.getView().byId("city").getValue(),
            "District": "",
            "PostlCod1": postalCode,
            "PostlCod2": "",
            "PoBox": "",
            "PoBoxCit": "",
            "Street": this.getView().byId("street1").getValue(),
            "HouseNo": "10",
            "Building": "12A",
            "Floor": "1",
            "RoomNo": "",
            "Country": selectedCountryKey,
            "Countryiso": "",
            "Region": "",
            "Tel1Numbr": this.getView().byId("phoneno").getValue(),
            "Tel1Ext": selectedCountryCodeText,
            "FaxNumber": "",
            "FaxExtens": "",
            "EMail": this.getView().byId("email").getValue(),
            "LanguP": "EN",
            "LangupIso": "",
            "Currency": "SGD",
            "CurrencyIso": "",
            "TitleKey": "",
            "OnlyChangeComaddress": true,
            "Katr1": "",
            "Katr2": "",
            "Katr3": "",
            "Katr4": "",
            "Katr5": "",
            "Katr6": "",
            "Katr7": "",
            "Katr8": "Y",
            "CustomerNo": "",
            "Dob": formattedDat,
            "SalesEmp": selectedText,
            "StoreId": sStoreId,
            "CreatedByEmail": UserEmail,
            "BrandId":brandIds
          };
          var oBusyDialog = new sap.m.BusyDialog({
            title: that.getOwnerComponent().getModel("i18n").getProperty("Creating_New_Customer"),
            text: that.getOwnerComponent().getModel("i18n").getProperty("Please_wait")
          });
          oBusyDialog.open();
          this.getOwnerComponent().getModel("mainModel").create("/CustomerSet", payload, {
    
            success: function (data) {
    
              var custno = data.CustomerNo;
    
              var oCustomerNoModel = that.getView().getModel("CustomerNoModel");
    
              // Check if the model exists; if not, create a new JSON model and set it to the view
              if (!oCustomerNoModel) {
                oCustomerNoModel = new sap.ui.model.json.JSONModel();
                that.getView().setModel(oCustomerNoModel, "CustomerNoModel");
              }
    
              // Get existing array or initialize it if it doesn't exist
              var aCustomerFirstnames = oCustomerNoModel.getProperty("/Firstnames") || [];
    
              // Add the retrieved customerNo directly to the Firstnames array
              if (custno) {
                aCustomerFirstnames.push(custno); // Pushing CustomerNo into the array
              }
    
              // Set the modified array back to the model under /Firstnames property
              oCustomerNoModel.setProperty("/Firstnames", aCustomerFirstnames);
    
    
              // Set the modified array back to the model under /Firstnames property
              oCustomerNoModel.setProperty("/Firstnames", aCustomerFirstnames);
              // Show a MessageBox with customer number
              oBusyDialog.close();
              sap.m.MessageBox.success(that.getOwnerComponent().getModel("i18n").getProperty("Record_successfully_created_CustomerNo") + ": " + custno, {
                onClose: function () {
                  oBusyDialog.close();
                  // Clear the input fields
                  that.getView().byId("datePickerId").setValue("01-01-2000");
                  that.getView().byId("title").setSelectedKey("");
                  that.getView().byId("fname").setValue("");
                  that.getView().byId("lname").setValue("");
                  that.getView().byId("email").setValue("");
                  that.getView().byId("phoneno").setValue("");
                  that.getView().byId("street1").setValue("");
                  that.getView().byId("city").setValue("");
                  that.getView().byId("pcode").setValue("");
                  if (oCustomerNoModel) {
                    oCustomerNoModel.setProperty(pathToSet, customerNumber); // Set the property at the specified path
                  } else {
                    console.error("CustomerNoModel not found.");
                  }
                }
    
              });
            },
    
    
    
    
            error: function (error) {
              oBusyDialog.close();
            
              var errorMessage;
              if (error.statusCode === 504) { // Gateway Timeout
                errorMessage = that.getOwnerComponent().getModel("i18n").getProperty("gateway_timeout_error");
              } else {
                var errorDetails = error.responseText ? JSON.parse(error.responseText).error.innererror.errordetails : [];
                errorMessage = that.getOwnerComponent().getModel("i18n").getProperty("error_Details") + ":\n";
                errorDetails.forEach(function (detail) {
                  errorMessage += "- " + detail.message + "\n";
                });
              }
            
              sap.m.MessageBox.error(errorMessage, {
                title: that.getOwnerComponent().getModel("i18n").getProperty("Error")
              });
            }
            
          });
        },
        validateRequiredFields: function () {
          var that = this;
          var valid = true;
          var missingFields = [];
    
    
          var requiredFields = [
            { id: "title", label: "Title" },
            { id: "fname", label: "First Name" },
            { id: "lname", label: "Last Name" },
            { id: "email", label: "Email" },
            { id: "countrycode", label: "Mobile No" },
            { id: "phoneno", label: "Mobile No" },
            { id: "street1", label: "Street/City" },
            { id: "city", label: "Street/City" },
            { id: "pcode", label: "Pincode" },
            { id: "country", label: "Country" },
            { id: "datePickerId", label: "Date of Birth" },
          ];
    
          requiredFields.forEach(function (field) {
            var control = that.getView().byId(field.id);
    
            if (!control) {
              console.error("Control with ID '" + field.id + "' not found.");
              valid = false;
              return;
            }
    
            var value;
            if (typeof control.getValue === 'function') {
              value = control.getValue();
            } else if (typeof control.getSelectedKey === 'function') {
              value = control.getSelectedKey();
            } else {
              console.error("Control with ID '" + field.id + "' does not have a getValue or getSelectedKey method.");
              valid = false;
              return;
            }
    
            if (!value) {
              control.setValueState("Error");
              control.setValueStateText("This field is required");
              valid = false;
              missingFields.push(field.label);
            } else {
              control.setValueState("None");
            }
          });
    
          if (!valid) {
    
            sap.m.MessageBox.error(that.getOwnerComponent().getModel("i18n").getProperty("Please_fill_required_fields") + ":\n" + missingFields.join(", "));
          }
    
          return valid;
        },
      });
    });