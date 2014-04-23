// Namespacing
var SettlementPDF = function() {

	// Set as local variables so we don't have to constantly pass 3920 variables into each function
	var doc = null;
	var img = new Image();
	var settlementData = [];
	var deductionData = [];
	var pdfXLocation = 12;
	var pdfYLocation = 10;
	var settlementTotal = 0;
	var deductionTotal = 0;
	var total = 0;
	var settlementDates = "";

	// Creates functions to support IE8
	function IE8Fixes() {
		// Object.keys
		Object.keys = Object.keys || (function () {
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
				DontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				DontEnumsLength = DontEnums.length;
		  
			return function (o) {
				if (typeof o != "object" && typeof o != "function" || o === null)
					throw new TypeError("Object.keys called on a non-object");
			 
				var result = [];
				for (var name in o) {
					if (hasOwnProperty.call(o, name))
						result.push(name);
				}
			 
				if (hasDontEnumBug) {
					for (var i = 0; i < DontEnumsLength; i++) {
						if (hasOwnProperty.call(o, DontEnums[i]))
							result.push(DontEnums[i]);
					}   
				}
			 
				return result;
			};
		})();


		// Canvas.


	} // end function IE8FIXES

	// begins and manages export process
	function exportPDF() {
		// If IE8, run functions to support
		if (typeof(Object.keys) === "undefined") {
			IE8Fixes();
		}

		if (img.src === "") {
			// first time through, load image
			loadImage();
		} else {
			// Image has been loaded, proceed with PDF Generation
			var masterSettlementData = loadSettlementData();

			// Check to see if data exists
			if (masterSettlementData.length < 1) {
				// No data
				alert("Cannot export with no data.");
			} else {
				doc = new jsPDF();

				// Generate all settlements
				for (var i = 0; i < 3; i++) {
					if (i > 0) {
						doc.addPage();
						pdfYLocation = 10;
					}

					// Set current settlement/deduction data
					setCurrentSettlementData(masterSettlementData, i);

					// Generate settlement onto PDF
					generateSettlement();
				}

				// Display
				doc.output("dataurlnewwindow");

				// Save
				// doc.save("Settlements.pdf");
			}		}
	}

	// Loads image, then proceeds with PDF Generation
	function loadImage() {
		img.onError = function() {
			alert("Something went wrong. Please try again.");
			throw("Image loading error");
		}

		img.onload = function() {
			// Image loaded, send back to export function
			exportPDF();
		}

		// Set image source, starting the load of the image
		img.src = "img/btt.jpg";
	}

	// Loads data from the dataSource
	function loadSettlementData() {
		// settlementData = [{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK HAZMA SCFUEL","Net Price":"120.00"},{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK REF SCFUEL","Net Price":"456.78"},{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK REF SCFUEL","Net Price":"12.78"},{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK REF SCFUEL","Net Price":"948.01"},{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK REF SCFUEL","Net Price":"499.99"}];
		// deductionData = [{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"},{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"},{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"},{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"},{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"}];

		// Get data from dataSource
		var data = Settlements.sDataSource.data();
		return data;
	}

	// Filters through settlement data to filter out settlements and deductions
	function setCurrentSettlementData(data, index) {

		// reset settlement and deduction data
		settlementData = [];
		deductionData = [];

		// Convert settlements and deductions appropriately
		var detailsList = data[index].SettlementDetailsList;
		for (var i = 0; i < detailsList.length; i++) {
			var detail = detailsList[i];
			if (detail.Deduction) {
				convertDetail(detail, "deduction");
			} else {
				convertDetail(detail, "settlement");
			}
		}

		// Get Current Settlement Dates
		var fromDate = data[index].FromSettlementDate;
		var toDate = data[index].ToSettlementDate;
		settlementDates = fromDate + " - " + toDate;
	}

	// Converts a settlement list detail into either a settlement or deduction data row
	function convertDetail(detail, type) {
		if (type === "settlement") {
			// Convert to settlement and add to settlementData
			var s = {
				"Unit": detail.UnitNo,
				"ProNo": detail.LocationCode + "-" + detail.ProNo + "-" + detail.LineNo + "-" + detail.MoveNo,
				"Equipment#": detail.EquipmentNo,
				"Account": detail.AccountCode,
				"Net Price": detail.Amount.toFixed(2).toString()
			};
			settlementData.push(s);
		} else if (type === "deduction") {
			// Convert to deduction and add to deductionData
			var d = {
				"Unit": detail.UnitNo,
				"Account": detail.AccountCode,
				"Description": detail.Description,
				"Net Price": detail.Amount.toFixed(2).toString()
			}
			deductionData.push(d);
		}
	}

	// Main function for the generation of settlements
	function generateSettlement() {
		// Image has been created, perform the rest of the PDF Generation tasks.
		// Generate banner
		// generateBanner();

		// Generate header text.
		doc.setFont("helvetica");
		// doc = generateHeaderText("Owner ID: 1795");
		// doc = generateHeaderText("Owner: TEST FREIGHT LLC");
		// doc = generateHeaderText("Settlement Dates: " + moment().subtract("weeks", 1).format("MM/DD/YYYY") + " - " + moment().format("MM/DD/YYYY"));
		generateHeaderText("Settlement Dates: " + settlementDates);
		
		// Generate Settlement Header
		doc.setFontSize(20);
		doc.text(pdfXLocation, pdfYLocation, "Settlements");
		pdfYLocation += 5

		// Generate Settlement Table
		doc.setFontSize(8);
		var settlementHeaders = ["Unit","ProNo","Equipment#", "Account", "Net Price"];
		var settlementWidths = {"Unit":20,"ProNo":45,"Equipment#":35,"Account":60,"Net Price":25};
		generateTable(settlementData, settlementHeaders, settlementWidths);

		// Generate Settlement subtotals
		generateSettlementSubtotal();

		// Generate Deduction Header
		doc.setFontSize(20);
		doc.text(pdfXLocation, pdfYLocation, "Deductions");
		pdfYLocation += 5

		// Generate Deductions
		doc.setFontSize(8);
		var deductionHeaders = ["Unit","Account","Description", "Net Price"];
		var deductionWidths = {"Unit":20,"Account":45,"Description":95,"Net Price":25};
		generateTable(deductionData, deductionHeaders, deductionWidths);

		// Generate Deduction subtotals
		generateDeductionSubtotals();

		// Generate Total
		total = settlementTotal - deductionTotal;
		doc.setFontSize(12);
		doc.text(pdfXLocation, pdfYLocation, "Settlement Total");
		doc.text(doc.lastCellPos.x + 1, pdfYLocation, "$" + total.toFixed(2));
	}

	// Loads the banner image of the BTT Logo
	function generateBanner() {
		// Calculate center for image
		var imgWidth = 100;
		var pageWidth = doc.internal.pageSize.width;
		var xCoord = (pageWidth - imgWidth) / 2;

		// Add to PDF
		doc.addImage(img, 'JPEG', xCoord, pdfYLocation, imgWidth, 15, 'bttlogo');
		pdfYLocation += 20;
	}

	// Loads the header text immediately under the banner
	function generateHeaderText(text) {
		var fontSize = 12;
		doc.setFontSize(fontSize);

		// Get widths
		var pageWidth = doc.internal.pageSize.width;
		var textWidth = doc.getStringUnitWidth(text)*fontSize/doc.internal.scaleFactor;
		var xCoord = (pageWidth - textWidth) / 2;
		var yCoord = pdfYLocation;
		pdfYLocation += 5;
		doc.text(xCoord, yCoord, text);
	}

	// Given an array of objects, headers, and column widths, generates a table on the pdf document
	function generateTable(data, headers, widths) {
		// Load table
		var config = {
			autoSize: false,
			widths: widths,
			lineHeight: 10,
			fontSize: 10
		};
		doc.table(pdfXLocation, pdfYLocation, data, headers, config);
		pdfYLocation = doc.lastCellPos.y + 17;
	}

	// Generates the subtotal of the current settlement
	function generateSettlementSubtotal() {

		// Get total of settlements
		settlementTotal = 0;
		for (var i = 0; i < settlementData.length; i++) {
			var s = settlementData[i];
			settlementTotal += +s["Net Price"];
		}

		// Load beneath table
		doc.text(pdfXLocation, pdfYLocation, "Total Before Deduction:");
		doc.text(doc.lastCellPos.x + 1, pdfYLocation, "$" + settlementTotal.toFixed(2));
		pdfYLocation += 20;
	}

	// 
	function generateDeductionSubtotals() {

		// Get total of deductions
		deductionTotal = 0;
		for (var i = 0; i < deductionData.length; i++) {
			var d = deductionData[i];
			deductionTotal += +d["Net Price"];
		}

		// Load beneath table
		doc.text(pdfXLocation, pdfYLocation, "Deduction Total:");
		doc.text(doc.lastCellPos.x + 1, pdfYLocation, "$" + deductionTotal.toFixed(2));
		pdfYLocation += 5;
	}

	return {
		exportPDF: exportPDF
	}
}();

// On ready
$(function() {
// Handle button
	$("#clickMe").click(function() {
		if (typeof(jsPDF) !== "undefined") {
			SettlementPDF.exportPDF();
		}
	});
});
