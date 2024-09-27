sap.ui.define(
    [  "sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast"
    ], function (Controller, History, UIComponent, JSONModel, MessageToast) {

        return Controller.extend("com.product.salesorder.controller.SearchCustomer", {
            // formatter:formatter,
            onInit: function () {
                // if (!this.PurchaseHistory) {
                //     this.PurchaseHistory = new sap.ui.xmlfragment("com.luxasia.salesorder.view.PurchaseHistory", this);
                //     this.getView().addDependent(this.PurchaseHistory);
                // }
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "mainModel");
                var aModel = this.getOwnerComponent().getModel("CustomerNoModel");
                this.getView().setModel(aModel, "CustomerNoModel")
    
            },
    
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
            calculateTotalPrice: function (aItems, sDate) {
                var fTotalPrice = 0;
                aItems.forEach(function (oContext) {
                    if (oContext.getProperty("Date") === sDate) {
                        fTotalPrice += parseFloat(oContext.getProperty("Price"));
                    }
                });
                return fTotalPrice.toFixed(2); // Optionally, you can format the total price as per your requirement
            },
    
    
    
    
            onNavBack: function () {
                this.getView().byId("customerTable").setVisible(false);
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("storeselection", {}, true);
                }
            },
    
            onNextPage: function () {
                this.getView().byId("customerTable").setVisible(false);
                var oModel = this.getOwnerComponent().getModel("CustomerNoModel");
                oModel.setData({ modelData: {} });
                oModel.updateBindings(true);
                this.getRouter().navTo("newcustomer");
            },
    
            // onSearch: function () {
            //     var Tel1Numbr = this.getView().byId("mobileInput").getValue();
            //     var EMail = this.getView().byId("emailInput").getValue();
            //     var Firstname = this.getView().byId("nameInput").getValue();
            //     var Lastname = this.getView().byId("surnameInput").getValue();
            //     var Customerno = this.getView().byId("customerno").getValue();
            //     var Country = this.getView().getModel("StoreModel").getProperty("/selectedCountry");
            //     var filterString = "";
            //     if (Customerno) {
            //         filterString = [new sap.ui.model.Filter("Firstname", "EQ" , Customerno )];
            //     }
    
            //     if (Firstname) {
            //         filterString =  [new sap.ui.model.Filter("Firstname", "EQ" , Firstname),new sap.ui.model.Filter("Country", "EQ" , Country)];;
    
            //     }
            //     if (EMail) {
            //         filterString =  [new sap.ui.model.Filter("EMail", "EQ" , EMail),,new sap.ui.model.Filter("Country", "EQ" , Country)];;
            //     }
            //     if (Lastname) {
            //         filterString =  [new sap.ui.model.Filter("Lastname", "EQ" , Lastname),,new sap.ui.model.Filter("Country", "EQ" , Country)];;
            //     }
            //     if (Tel1Numbr) {
            //         filterString =  [new sap.ui.model.Filter("Tel1Numbr", "EQ" , Tel1Numbr),,new sap.ui.model.Filter("Country", "EQ" , Country)];;
            //     }
    
            //     if (!filterString) {
            //         MessageToast.show("No search criteria provided. Displaying all results.");
            //         return;
            //     }
    
            //     var oDataUrl = "/CustomerSet";
            //     this.getOwnerComponent().getModel("mainModel").read(oDataUrl, {
            //         filters: filterString,
            //         success: function (data) {
            //             var searchResults = data ? data.results : (data.value || []);
            //             if (searchResults.length === 0) {
            //                 // Show a message indicating that the customer was not found
            //                 sap.m.MessageBox.information("Customer not found.", {
            //                     title: "Info"
            //                 });
            //                 return;
            //             }
            //             // var oMainModel = this.getView().getModel("mainModel");
            //             // oMainModel.setData({
            //             //     d: {
            //             //         results: searchResults
            //             //     }
            //             // });
            //             var customerModel = new sap.ui.model.json.JSONModel(data.results);
            //             this.getView().setModel(customerModel,"customerModel");
            //             // var oTable = this.getView().byId("customerTable");
            //             // oTable.setModel(oMainModel);
            //             // oTable.bindAggregation("items", {
            //             //     path: "/d/results/",
            //             //     template: new sap.m.ColumnListItem({
            //             //         cells: [
            //             //             new sap.m.Text({ text: "{CustomerNo}" }),
            //             //             new sap.m.Text({ text: "{Tel1Numbr}" }),
            //             //             new sap.m.Text({ text: "{EMail}" }),
            //             //             new sap.m.Text({ text: "{Firstname}" }),
            //             //             new sap.m.Text({ text: "{Lastname}" }),
            //             //             new sap.m.Button({
            //             //                 icon : "sap-icon://arrow-right",
            //             //                 press: function(evt) {
            //                 //                     var oModel = this.getOwnerComponent().getModel("CustomerNoModel");
            //                 //                     oModel.setData({ modelData: {} });
            //                 //                     oModel.updateBindings(true);
            //             //                     var oButton = evt.getSource();
            //             //                     var oBindingContext = oButton.getBindingContext();
            //             //                     var sCustomerFirstname = oBindingContext.getProperty("CustomerNo");
    
            //             //                     // Store Firstname in the model
            //             //                     var oCustomerNoModel = this.getView().getModel("CustomerNoModel");
            //             //                     if (!oCustomerNoModel) {
            //             //                         oCustomerNoModel = new sap.ui.model.json.JSONModel();
            //             //                         this.getView().setModel(oCustomerNoModel, "CustomerNoModel");
            //             //                     }
    
            //             //                     var aCustomerFirstnames = oCustomerNoModel.getProperty("/Firstnames") || [];
            //             //                     aCustomerFirstnames.push(sCustomerFirstname);
            //             //                     oCustomerNoModel.setProperty("/Firstnames", aCustomerFirstnames);
    
            //             //                     // Perform navigation or other actions here
            //             //                     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //             //                     oRouter.navTo("transaction");
            //             //                 }.bind(this)
            //             //             })
            //             //         ]
            //             //     })
            //             // });
    
            //             this.getView().byId("customerTable").setVisible(true);
    
            //         }.bind(this),
    
    
            //         error: function () {
            //             var errorDetails = error.responseText ? JSON.parse(error.responseText).error.innererror.errordetails : [];
    
            //             var errorMessage = "An error occurred. Details:\n";
            //             errorDetails.forEach(function (detail) {
            //               errorMessage += "- " + detail.message + "\n";
            //             });
    
            //             // Show the error message in a message box or dialog
            //             sap.m.MessageBox.error(errorMessage, {
            //               title: "Error"
            //             });
            //           }
    
            //     });
            // },
    
            onSearch: function () {
                var that = this;
                var Tel1Numbr = this.getView().byId("mobileInput").getValue();
                var EMail = this.getView().byId("emailInput").getValue();
                var Firstname = this.getView().byId("nameInput").getValue();
                var Lastname = this.getView().byId("surnameInput").getValue();
                var Customerno = this.getView().byId("customerno").getValue();
                var Country = this.getView().getModel("StoreModel").getProperty("/selectedCountry");
                var filterArray = [];
    
                if (Customerno) {
                    filterArray.push(new sap.ui.model.Filter("Firstname", "EQ", Customerno));
                }
    
                if (Firstname) {
                    filterArray.push(new sap.ui.model.Filter("Firstname", "EQ", Firstname));
                }
    
                if (EMail) {
                    filterArray.push(new sap.ui.model.Filter("EMail", "EQ", EMail));
                }
    
                if (Lastname) {
                    filterArray.push(new sap.ui.model.Filter("Lastname", "EQ", Lastname));
                }
    
                if (Tel1Numbr) {
                    filterArray.push(new sap.ui.model.Filter("Tel1Numbr", "EQ", Tel1Numbr));
                }
    
                // Add the common filter for Country
                filterArray.push(new sap.ui.model.Filter("Country", "EQ", Country));
    
                if (filterArray.length === 0) {
                    MessageToast.show(this.getOwnerComponent().getModel("i18n").getProperty("No_search_criteria_provided_Displaying_all_results"));
                    return;
                }
    
                var oBusyDialog = new sap.m.BusyDialog({
                    title:  that.getOwnerComponent().getModel("i18n").getProperty("Loading_Customer"),
                    text:  that.getOwnerComponent().getModel("i18n").getProperty("Please_Wait"),
                });
                oBusyDialog.open();
                var oDataUrl = "/CustomerSet";
    
                this.getOwnerComponent().getModel("mainModel").read(oDataUrl, {
                    filters: filterArray,
                    success: function (data) {
                        oBusyDialog.close();
                        var searchResults = data ? data.results : (data.value || []);
                        if (searchResults.length === 0) {
    
                            sap.m.MessageBox.information(that.getOwnerComponent().getModel("i18n").getProperty("Customer_not_found"), {
                                title: that.getOwnerComponent().getModel("i18n").getProperty("Info")
                            });
                            return;
                        }
    
                        var customerModel = new sap.ui.model.json.JSONModel(data.results);
                        this.getView().setModel(customerModel, "customerModel");
    
                        this.getView().byId("customerTable").setVisible(true);
                    }.bind(this),
    
                    error: function (error) {
                        oBusyDialog.close();
                        var errorDetails = error.responseText ? JSON.parse(error.responseText).error.innererror.errordetails : [];
    
                        //var errorMessage = "An error occurred. Details:\n";
                        var errorMsg = that.getOwnerComponent().getModel("i18n").getProperty("error_Details");
                        var errorMessage = errorMsg + ":\n";
                        errorDetails.forEach(function (detail) {
                            errorMessage += "- " + detail.message + "\n";
                        });
    
    
                        sap.m.MessageBox.error(errorMessage, {
                            title: that.getOwnerComponent().getModel("i18n").getProperty("Error")
                        });
                    }
                });
    
                //     var Tel1Numbr = this.getView().byId("mobileInput").getValue();
                //     var EMail = this.getView().byId("emailInput").getValue();
                //     var Firstname = this.getView().byId("nameInput").getValue();
                //     var Lastname = this.getView().byId("surnameInput").getValue();
                //     var Customerno = this.getView().byId("customerno").getValue();
                //     var Country = this.getView().getModel("StoreModel").getProperty("/selectedCountry");
                //     var filter1 = new sap.ui.model.Filter("Firstname", "EQ", Customerno);
                //     var filter2 = new sap.ui.model.Filter("Firstname", "EQ", Firstname);
                //     var filter3 = new sap.ui.model.Filter("EMail", "EQ", EMail);
                //     var filter4 = new sap.ui.model.Filter("Lastname", "EQ", Lastname);
                //     var filter5 = new sap.ui.model.Filter("Tel1Numbr", "EQ", Tel1Numbr);
                //     var filter6 = new sap.ui.model.Filter("Country", "EQ", Country);
                //     var filters = new sap.ui.model.Filter([filter1, filter2, filter3, filter4, filter5, filter6], true);
                //     var oListBinding = this.getView().byId("customerTable").getBinding("items").filter(filters);
                //     oListBinding.filter(filters);
                //     var aFilteredItems = oListBinding.getCurrentContexts();
    
                //     if (aFilteredItems.length === 0) {
                //         // Display an error message here
                //         sap.m.MessageToast.show("No items found matching the filter criteria");
                //     }
                //     var oDataUrl = "/CustomerSet";
    
                //     this.getOwnerComponent().getModel("mainModel").read(oDataUrl, {
                //         filters: filterArray,
                //         success: function (data) {
                //             var searchResults = data ? data.results : (data.value || []);
                //             if (searchResults.length === 0) {
    
                //                 sap.m.MessageBox.information("Customer not found.", {
                //                     title: "Info"
                //                 });
                //                 return;
                //             }
    
                //             var customerModel = new sap.ui.model.json.JSONModel(data.results);
                //             this.getView().setModel(customerModel, "customerModel");
    
                //             this.getView().byId("customerTable").setVisible(true);
                //         }.bind(this),
    
                //         error: function (error) {
                //             var errorDetails = error.responseText ? JSON.parse(error.responseText).error.innererror.errordetails : [];
    
                //             var errorMessage = "An error occurred. Details:\n";
                //             errorDetails.forEach(function (detail) {
                //                 errorMessage += "- " + detail.message + "\n";
                //             });
    
    
                //             sap.m.MessageBox.error(errorMessage, {
                //                 title: "Error"
                //             });
                //         }
                //     });
            },
            OnCustPurchaseHistoryPress: function (evt) {
                var that = this;
                if (!this.PurchaseHistory) {
                    this.PurchaseHistory = new sap.ui.xmlfragment("com.luxasia.salesorder.view.PurchaseHistory", this);
                    this.getView().addDependent(this.PurchaseHistory);
                }
                this.PurchaseHistory.open();
                var oButton = evt.getSource();
                var oRow = oButton.getParent().getParent();
                var oModel = this.getOwnerComponent().getModel("CustomerNoModel");
                oModel.setData({ modelData: {} });
                oModel.updateBindings(true);
                var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
                var sStoreId = oStoreModel.getProperty("/selectedStoreId");
                var oBindingContext = oButton.getParent().getBindingContext("customerModel");
    
                var sCustomerFirstname = oBindingContext.getProperty("CustomerNo");
                var oCustomerNoModel = this.getView().getModel("CustomerNoModel");
                if (!oCustomerNoModel) {
                    oCustomerNoModel = new sap.ui.model.json.JSONModel();
                    this.getView().setModel(oCustomerNoModel, "CustomerNoModel");
                }
    
                var aCustomerFirstnames = oCustomerNoModel.getProperty("/Firstnames") || [];
                aCustomerFirstnames.push(sCustomerFirstname);
                oCustomerNoModel.setProperty("/Firstnames", aCustomerFirstnames);
                // var filter1 = new sap.ui.model.Filter("CustomerNo", sap.ui.model.FilterOperator.EQ, sCustomerFirstname);
                // var filter2 = new sap.ui.model.Filter("StoreId", sap.ui.model.FilterOperator.EQ, sStoreId);
                // var filters = new sap.ui.model.Filter([filter1, filter2], true);
                // this.PurchaseHistory.getContent()[0].getBinding("items").filter(filters);
                var oBusyDialog = new sap.m.BusyDialog({
                    title: that.getOwnerComponent().getModel("i18n").getProperty("Loading"),
                    text: that.getOwnerComponent().getModel("i18n").getProperty("Please_Wait"),
                });
                oBusyDialog.open();
                var oModel = that.getOwnerComponent().getModel("mainModel");
                var baseUrl = oModel.sServiceUrl;
                var sServiceUrl = "/CustomerHistorySet?$filter=CustomerNo eq '" + encodeURIComponent(sCustomerFirstname) + "' and StoreId eq '" + encodeURIComponent(sStoreId) + "'";
    
                // Make AJAX request
                $.ajax({
                    url: baseUrl + sServiceUrl,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        var dateTotals = {};
    
                        data.d.results.forEach(function (item) {
                            var date = item.Date;
                            var totalPrice = parseFloat(item.Total);
                            if (dateTotals.hasOwnProperty(date)) {
                                dateTotals[date] += totalPrice;
                            } else {
                                dateTotals[date] = totalPrice;
                            }
                        });
                        // Iterate over the data to update Total property based on aggregated totals
                        data.d.results.forEach(function (item) {
                            var date = item.Date;
                            item.Total = dateTotals[date].toFixed(2); // Update Total property with aggregated total
                        });
                        var oModel = new sap.ui.model.json.JSONModel();
    
                 
                        oModel.setData(data.d.results);
    
                        that.getView().setModel(oModel, "HistorySet");
                        oBusyDialog.close();
                    },
                    error: function (xhr, status, error) {
                        oBusyDialog.close();
                        
                    }
                });
            },
            closePurchaseHistory: function () {
                this.PurchaseHistory.close();
            },
            closeupdate: function () {
                var oDialog = this.getView().byId("UpdateCustomer");
                oDialog.close();
            },
            onCustomerEditPress: function (evt) {
                // if (!this.UpdateCustomer) {
                //     this.UpdateCustomer = new sap.ui.xmlfragment("com.luxasia.salesorder.view.UpdateCustomer", this);
                //     this.getView().addDependent(this.UpdateCustomer);
                //   }
                //   this.UpdateCustomer.open();
                var that = this;
                var oView = that.getView();
                var oDialog = oView.byId("UpdateCustomer");
    
    
                // Open the dialog
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "com.luxasia.salesorder.view.UpdateCustomer", this);
                    oView.addDependent(oDialog);
                }
    
                // Open the dialog
    
                oDialog.open();
                console.log(oDialog.getContent());
                // Wait for the dialog to be opened before accessing its content
                oDialog.attachEventOnce("afterOpen", function () {
                    var oButton = evt.getSource();
                    var oRow = oButton.getParent().getParent();
                    var oModel = that.getOwnerComponent().getModel("CustomerNoModel");
                    oModel.setData({ modelData: {} });
                    oModel.updateBindings(true);
                    this.oBindingContext = oButton.getParent().getBindingContext("customerModel");
                    that.custno = this.oBindingContext.getProperty("CustomerNo");
                    var street = oView.byId("street1edit").setValue(this.oBindingContext.getProperty("Street"));
                    var Katr8 = this.oBindingContext.getProperty("Katr8");
                    var checkBox = oView.byId("checkconsentbox");
                    if (Katr8 === 'Y') {
                        checkBox.setSelected(true);
                    } else {
                        checkBox.setSelected(false);
                    }
                    var firstname = oView.byId("fnameedit").setValue(this.oBindingContext.getProperty("Firstname"));
                    var lastname = oView.byId("lnameedit").setValue(this.oBindingContext.getProperty("Lastname"));
                    var email = oView.byId("emailedit").setValue(this.oBindingContext.getProperty("EMail"));
                    var telNumber = this.oBindingContext.getProperty("Tel1Numbr");
                    telNumber = telNumber.replace(/-\d{2}$/, "");
                    oView.byId("phonenoedit").setValue(telNumber);
                    var pincode = oView.byId("pcodeedit").setValue(this.oBindingContext.getProperty("PostlCod1"));
                    var city = oView.byId("cityedit").setValue(this.oBindingContext.getProperty("City"));
                    var sDateValue = this.oBindingContext.getProperty("Dob");
                    var oDatePicker = oView.byId("datePickerIdedit");
                   
    
                    if (sDateValue !== null) {
                        var oDate = new Date(sDateValue);
                        oDate.setDate(oDate.getDate() + 1);
                        // Formatting the date to MM/DD/YYYY
                        var sFormattedDate = (oDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
                           (oDate.getDate()).toString().padStart(2, '0') + '/' +
                            oDate.getFullYear().toString();
    
                        // Set the formatted date to the DatePicker
                        oDatePicker.setValue(sFormattedDate);
                    } else {
                        // Set an empty value to the DatePicker
                        oDatePicker.setValue("");
                    }
    
                    var title = oView.byId("titleofMr").setValue(this.oBindingContext.getProperty("TitleP"));
    
    
                });
                var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
                var selectedCountry = oStoreModel.getProperty("/selectedCountry");
                var oCountrySelect = oView.byId("countryedit");
                var oCountryCodeSelect = oView.byId("countrycodeedit")
                oCountrySelect.setSelectedKey(selectedCountry);
                oCountryCodeSelect.setSelectedKey(selectedCountry)
                // var firstname = this.getView().byId("fnameedit").setValue( this.oBindingContext.getProperty("Firstname"));
                // var lastname = this.getView().byId("lnameedit").setValue( this.oBindingContext.getProperty("Lastname"));
                // var email = this.getView().byId("emailedit").setValue( this.oBindingContext.getProperty("EMail"));
                // var telnumber = this.getView().byId("phonenoedit").setValue( this.oBindingContext.getProperty("Tel1Numbr"));
                // var dateofbirth = this.getView().byId("datePickerIdedit").setValue( this.oBindingContext.getProperty("Dob"));
    
    
            },
    
      
    
            // Event handler for the "Update" button press
            onUpdatePress: function () {
                var that = this;
                // Retrieve the edited values of email and phone number
                var newEmail = this.byId("emailedit").getValue();
                var newPhoneNumber = this.byId("phonenoedit").getValue();
                var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
                var sStoreId = oStoreModel.getProperty("/selectedStoreId");
    
                var customerId = "";
                var oDialog = this.getView().byId("UpdateCustomer");
                var oCheckBox = this.getView().byId("checkconsentbox");
                var sConsentValue = oCheckBox.getSelected() ? "Y" : "N";
    
                // Open the dialog
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "com.luxasia.salesorder.view.UpdateCustomer", this);
                    oView.addDependent(oDialog);
                }
                // Get the OData model
                var oModel = this.getOwnerComponent().getModel('mainModel');
    
                var payload = {
                    "Tel1Numbr": newPhoneNumber,
                    "EMail": newEmail,
                    "StoreId": sStoreId,
                    "Katr8": sConsentValue
                };
                oDialog.close();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: that.getOwnerComponent().getModel("i18n").getProperty("Updating_customer"),
                    text: that.getOwnerComponent().getModel("i18n").getProperty("Please_Wait")
                });
                oBusyDialog.open();
                var url = "/CustomerSet('" + that.custno + "')";
    
                oModel.update(url, payload, {
                    success: function (oData, oResponse) {
                        oBusyDialog.close();
    
                        sap.m.MessageBox.success(that.getOwnerComponent().getModel("i18n").getProperty("Customer_updated_successfully"), {
                            onClose: function () {
                                that.onSearch();
    
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
    
    
            onCustomerPress: function (evt) {
                var oTable = this.getView().byId("customerTable");
                var oModel = this.getOwnerComponent().getModel("CustomerNoModel");
                oModel.setData({ modelData: {} });
                oModel.updateBindings(true);
                var oButton = evt.getSource();
                var oRow = oButton.getParent().getParent(); // Adjust this based on your table structure
    
                // Get the binding context of the row
                var oBindingContext = oButton.getParent().getBindingContext("customerModel");
    
                var sCustomerFirstname = oBindingContext.getProperty("CustomerNo");
    
                // Store Firstname in the model
                var oCustomerNoModel = this.getView().getModel("CustomerNoModel");
                if (!oCustomerNoModel) {
                    oCustomerNoModel = new sap.ui.model.json.JSONModel();
                    this.getView().setModel(oCustomerNoModel, "CustomerNoModel");
                }
    
                var aCustomerFirstnames = oCustomerNoModel.getProperty("/Firstnames") || [];
                aCustomerFirstnames.push(sCustomerFirstname);
                oCustomerNoModel.setProperty("/Firstnames", aCustomerFirstnames);
    
                this.getView().byId("customerTable").setVisible(false);
                // Perform navigation or other actions here
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("transaction");
    
            },
    
        });
    });