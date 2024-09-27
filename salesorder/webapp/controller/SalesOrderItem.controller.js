sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/PDFViewer",
      ],
    
      function (BaseController, Filter, FilterOperator, PDFViewer) {
      "use strict";
  
      return BaseController.extend("com.product.salesorder.controller.SalesOrderItem", {
        onInit: function () {
            // this._pdfViewer = new PDFViewer();
            // this.getView().addDependent(this._pdfViewer);
            if (!this.valueHelpForPdfViewer)
              this.valueHelpForPdfViewer = new sap.ui.xmlfragment("com.product.salesorder.Fragments.pdfViewerForSalesOrder", this);
            this.getView().addDependent(this.valueHelpForPdfViewer);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    
            oRouter.getRoute("SalesOrderItem").attachMatched(this._onRouteMatched, this);
    
            var oModel = this.getOwnerComponent().getModel("SelectedCustomerModel");
            this.getView().setModel(oModel, "SelectedCustomerModel");
            this.loadPDFjsLib();
    
          },
          _onRouteMatched: function (oEvent) {
            var that = this;
            var oArgs = oEvent.getParameter("arguments");
    
            var sSalesOrderNo = oArgs.SSalesno;
    
            this.sSalesOrderNo = sSalesOrderNo;
            this.sSoldtocust = oArgs.SSoldTo;
    
            var oModel = this.getOwnerComponent().getModel("mainModel");
            var oJsonModel = this.getView().getModel("SelectedCustomerModel");
            var oFilter = new sap.ui.model.Filter("SalesorderNo", sap.ui.model.FilterOperator.EQ, sSalesOrderNo);
            if (isNaN(this.sSoldtocust)) {
              this.getView().byId("emailtocust").setVisible(false);
            } else (
              this.getView().byId("emailtocust").setVisible(true)
            )
            // Read data from the model using the provided URL
            oModel.read("/SalesOrderItemSet", {
              filters: [oFilter],
              success: function (oData) {
                that.email = oData.results[0].Email;
    
                oData.results.forEach(function (item) {
                  item.Discount = parseFloat(item.Discount).toFixed(2);
                  item.NetPrice = parseFloat(item.NetPrice).toFixed(2);
                  item.RetailPrice = parseFloat(item.RetailPrice).toFixed(2);
                  item.TargetQty = parseFloat(item.TargetQty).toFixed(0);
                  item.TaxAmount = parseFloat(item.TaxAmount).toFixed(2);
                });// Assuming results contains the array of data
                oJsonModel.setData(oData.results);
                that.getView().setModel(oJsonModel, "SelectedCustomerModel");
                // You can process the data here
              },
              error: function (error) {
                // Handle errors during the fetch
                console.error("Error fetching data:", error);
              }
            });
          },
    
    
          OnEmailPress: function () {
            var that = this;
            sap.m.MessageBox.confirm(
              this.getOwnerComponent().getModel("i18n").getProperty("Send_Email") + ": " + that.email, {
              title: this.getOwnerComponent().getModel("i18n").getProperty("Confirmation"),
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  var oModel = that.getOwnerComponent().getModel("mainModel");
                  var baseUrl = oModel.sServiceUrl;
                  var sEmailUrl = "/PdfPrintSet(SalesOrderNo='" + that.sSalesOrderNo + "',Action='EMAIL')/$value";
                  $.ajax({
                    url: baseUrl + sEmailUrl,
                    method: "GET",
                    success: function (data) {
                      sap.m.MessageToast.show(that.getOwnerComponent().getModel("i18n").getProperty("Email_Sent"));
                    }
                  });
                }
              }.bind(this)
            });
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
                  printJS({ printable: pdfImages, type: 'image', style: 'img { display: block; margin-bottom: 10px; }' });
                };
                document.head.appendChild(script);
              } else {
                printJS({ printable: pdfImages, type: 'image', style: 'img { display: block; margin-bottom: 10px; }' });
              }
            } else {
              console.error('No images available to print.');
            }
          },
          onOpenPDFPress: function () {
            var that = this;
            var oModel = that.getOwnerComponent().getModel("mainModel");
            var baseUrl = oModel.sServiceUrl;
            var sServiceURl = "/PdfPrintSet(SalesOrderNo='" + this.sSalesOrderNo + "',Action='PDF')/$value";
            this.valueHelpForPdfViewer.open();
            var htmlControl = this.valueHelpForPdfViewer.getContent()[0];
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
    
                    var loadingTask = pdfjsLib.getDocument({ data: pdfdata });
                    loadingTask.promise.then(function (pdf) {
                      console.log('PDF loaded:', pdf.numPages, 'pages');
    
                      var container = document.getElementById('pdfContainer');
    
                      // Clear the container before rendering new pages
                      clearContainer();
    
                      // Clear the global pdfImages array
                      pdfImages = [];
    
                      // Function to render each page onto a separate canvas
                      var renderPage = function (pageNum) {
                        pdf.getPage(pageNum).then(function (page) {
                          console.log('Page ' + pageNum + ' loaded');
                          var scale = 1.5; // Higher scale for improved quality
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
                            console.log('Page ' + pageNum + ' rendered');
    
                            // Convert canvas to image and store in the global pdfImages array
                            pdfImages.push(canvas.toDataURL('image/png'));
    
                            if (pageNum < pdf.numPages) {
                              renderPage(pageNum + 1); // Render next page
                            }
                          }).catch(function (error) {
                            console.error('Error rendering page ' + pageNum, error);
                          });
                        }).catch(function (error) {
                          console.error('Error loading page ' + pageNum, error);
                        });
                      };
    
                      // Start rendering from the first page
                      renderPage(1);
                    }).catch(function (error) {
                      console.error('Error loading PDF document', error);
                    });
                  }
                };
    
                // Read the fetched PDF blob as data URL
                reader.readAsDataURL(data);
              },
              error: function (error) {
                console.error('Error fetching PDF:', error);
              }
            });
          },
    
          handlePdfViewerCancel: function () {
            this.valueHelpForPdfViewer.close();
    
          },
          onGoSalesCompletion: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("TodayTransaction");
    
          },
        });
      }
    );