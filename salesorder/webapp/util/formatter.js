sap.ui.define([], function () {
	"use strict";
	return {
	
		precendingZerosRemvoal:function(articleno){
			if(articleno != null){
            articleno = articleno.replace(/^0+/, '');
            return articleno;
			}
        },
		decimal : function(d){
			return parseFloat(d).toFixed(2);// if value is string
			// if number use below statement
			// return d.toFixed(2)
		},
		formatAvailableQty: function (sAvailableQty) {
           
            console.log("AvailableQty Type:", typeof sAvailableQty);
            console.log("AvailableQty Value:", sAvailableQty);

            return sAvailableQty;
        },
		removeHifenFromMobileNo: function(Tel1Numbr){
			if (!Tel1Numbr || typeof Tel1Numbr !== "string") {
				return Tel1Numbr; // Return input as is if it's not a valid string
			}
		
			// Split the string at the hyphen
			var parts = Tel1Numbr.split('-');
		
			// Extract the last part which contains the digits after the hyphen
			var afterHyphen = parts.length > 1 ? parts.pop() : '';
		
			// Extract the digits before the hyphen
			var beforeHyphen = parts.join('');
		
			// Join with hyphen in the desired format
			return afterHyphen.length > 0 ? afterHyphen + '-' + beforeHyphen : beforeHyphen;
		},
		dateFormat: function(inputDate) {
            if (!inputDate) {
                return "";
            }

            // Parse input date string
            var year = inputDate.substring(0, 4);
            var month = inputDate.substring(4, 6);
            var day = inputDate.substring(6, 8);

            // Return formatted date string
            return day + "-" + month + "-" + year;
        },
		 calculateTotalPrice:function(aItems, sDate) {
			var fTotalPrice = 0;
			aItems.forEach(function(oContext) {
				if (oContext.getProperty("Date") === sDate) {
					fTotalPrice += parseFloat(oContext.getProperty("Price"));
				}
			});
			return fTotalPrice.toFixed(2); // Optionally, you can format the total price as per your requirement
		},
		
	};
});