// Namespacing
var SettlementPDF = function() {

	// Set as local variables so we don't have to constantly pass 3920 variables into each function
	var doc = null;
	var settlementData = [];
	var deductionData = [];
	var pdfYLocation = 10;
	var settlementTableSize = -1;
	var deductionTableSize = -1;
	var settlementTotal = 0;
	var deductionTotal = 0;
	var total = 0;


	// Main function for the generation of pdfs
	function generatePDF() {
		// Figure out where we are
		if (doc == null) {
			// Beginning of process, create pdf and load image
			doc = new jsPDF();
			generateBanner();
		} else {
			// Image has been created, perform the rest of the PDF Generation tasks.
			// Load settlement/deduction data
			loadSettlementData();

			// Generate header text.
			doc.setFont("helvetica");
			doc = generateHeaderText("Owner ID: 1795");
			doc = generateHeaderText("Owner: TEST FREIGHT LLC");
			doc = generateHeaderText("Settlement Dates: " + moment().subtract("weeks", 1).format("MM/DD/YYYY") + " - " + moment().format("MM/DD/YYYY"));
			
			// Generate Settlement Header
			doc.setFontSize(20);
			doc.text(15, pdfYLocation, "Settlements");
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
			doc.text(15, pdfYLocation, "Deductions");
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
			doc.text(15, pdfYLocation, "Settlement Total");
			doc.text(doc.lastCellPos.x + 1, pdfYLocation, "$" + total.toFixed(2));

			// Display/Save doc
			doc.output("dataurlnewwindow");
		}
	}

	function loadSettlementData() {
		// settlementData = [{"test1":"data","test2":"data","test3":"data"},{"test1":"data","test2":"data","test3":"data"},{"test1":"data","test2":"data","test3":"data"},{"test1":"data","test2":"data","test3":"data"},{"test1":"data","test2":"data","test3":"data"}];
		settlementData = [{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK HAZMA SCFUEL JFKDLAJFKDLASJFDKLASJ","Net Price":"120.00"},{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK REF SCFUEL","Net Price":"456.78"},{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK REF SCFUEL","Net Price":"12.78"},{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK REF SCFUEL","Net Price":"948.01"},{"Unit":"123A45","ProNo":"101-123456-321-99","Equipment#":"MSKU123456","Account":"TRUCK REF SCFUEL","Net Price":"499.99"}];
		deductionData = [{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"},{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"},{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"},{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"},{"Unit":"123A45","Account":"TRUCK REF SCFUEL","Description":"OCC/ACC BROZOWSKI STEVE FROM 1088F3","Net Price":"120.00"}];
	}

	// Loads the banner image of the BTT Logo
	function generateBanner() {
		var img = new Image();

		img.onError = function() {
			alert("Something went wrong. Please try again.");
		}

		img.onload = function() {
			// Calculate center for image
			var imgWidth = 100;
			var pageWidth = doc.internal.pageSize.width;
			var xCoord = (pageWidth - imgWidth) / 2;

			// Add to PDF
			doc.addImage(img, 'JPEG', xCoord, pdfYLocation, imgWidth, 15, 'bttlogo');
			pdfYLocation += 20;

			// Send back to pdf generation
			generatePDF();
		}

		img.src = "img/btt.jpg";
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

		return doc;
	}

	function generateTable(data, headers, widths) {
		// Load table
		var config = {
			autoSize: false,
			widths: widths,
			lineHeight: 10,
			fontSize: 10
		};
		doc.table(15, pdfYLocation, data, headers, config);
		pdfYLocation = doc.lastCellPos.y + 17;

	}

	function generateSettlementSubtotal() {

		// Get total of settlements
		settlementTotal = 0;
		for (var i = 0; i < settlementData.length; i++) {
			var s = settlementData[i];
			settlementTotal += +s["Net Price"];
		}

		// Load beneath table
		doc.text(15, pdfYLocation, "Total Before Deduction:");
		doc.text(doc.lastCellPos.x + 1, pdfYLocation, "$" + settlementTotal.toFixed(2));
		pdfYLocation += 20;

	}

	function generateDeductionSubtotals() {

		// Get total of deductions
		deductionTotal = 0;
		for (var i = 0; i < deductionData.length; i++) {
			var d = deductionData[i];
			deductionTotal += +d["Net Price"];
		}

		// Load beneath table
		doc.text(15, pdfYLocation, "Deduction Total:");
		doc.text(doc.lastCellPos.x + 1, pdfYLocation, "$" + deductionTotal.toFixed(2));
		pdfYLocation += 5;
	}

	return {
		generatePDF: generatePDF
	}
}();

// On ready
$(function() {
// Handle button
	$("#clickMe").click(function() {
		SettlementPDF.generatePDF();
	});
});

