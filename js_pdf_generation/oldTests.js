$("#clickMe").click(function() {
	// Test HTML sources
	var $source = $("#pdfDiv")[0];
	// Test if js-generated HTML can produce a PDF file
	var testImg = '<img src="btt.jpg" width="433" height="63">';
	var testTable = '<table id="testTable"><colgroup><col width:40%; text-align:left;><col width:30%;><col width:30%;></colgroup><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh Hello There!</td></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh Hello There!</td></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh Hello There!</td></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh Hello There!</td></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh BLAGH BLAGH!</td></tr></table>';
	var imgPlusTable = '<img src="btt.jpg" width="433" height="63"><table id="testTable" width="1000"><colgroup><col width:40%; text-align:left;><col width:30%;><col width:30%;></colgroup><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh Hello There!</td></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh Hello There!</td></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh Hello There!</td></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh Hello There!</td></tr><tr><td>Relevant Information </td><td>Useless Info</td><td>Oh BLAGH BLAGH!</td></tr></table>';
	var header2 = "<h2>Settlements</h2>";
	
	// Run function
	// testPDFGeneration($source);
	// testPDFWithImage();
	// testPDFTable();
	spdf.BTTSettlementPDFGeneration();
});

function testPDFTable() {
	var testData = [{"test1":"data","test2":"data","test3":"data"},{"test1":"data","test2":"data","test3":"data"},{"test1":"data","test2":"data","test3":"data"},{"test1":"data","test2":"data","test3":"data"},{"test1":"data","test2":"data","test3":"data"}];
	var doc = new jsPDF();
	var headers = ["test1","test2","test3"];
	var config = {
		autoSize: true
	};

	doc.table(30, 30, testData, headers, config);
	doc.output("datauri");
}


function testPDFWithImage() {
	var img = new Image();

	img.onload = function() {
		var doc = new jsPDF();

		// Calculate center for image
		var imgWidth = 100;
		var pageWidth = doc.internal.pageSize.width;
		var xCoord = (pageWidth - imgWidth) / 2;

		doc.addImage(img, 'JPEG', xCoord, 10, imgWidth, 16, 'bttlogo');
		doc.output('datauri');
	}

	img.onError = function(){
		alert('Dang it Bobby');
	}

	img.src = "img/btt.jpg";
}

// Generates the PDF
function testPDFGeneration(testHTML) {
	
	var doc = new jsPDF("p", "pt", "letter");
	var source = testHTML;
	var margins = {
		top:80,
		bottom: 60,
		left:40,
		width:522
	};
	// THIS IS STUPID WHY DOES THIS MAKE THINGS WORK
	var specialElementHandlers = {
		'#bypassme': function(element, renderer) {
			return true;
		}
	}

	// Set document properties
	doc.setProperties({
		title: "Settlements PDF",
		subject: "Owner 1234",
		keywords: "Settlement, Driver, Owner",
		creator: "BTT Driver Portal"
	});

	doc.fromHTML(
		source,
		margins.left,
		margins.top,
		{
			"width": margins.width,
			"elementHandlers": specialElementHandlers
		},
		function(dispose) {
			// doc.save("Settlements.pdf");
			doc.output('datauri');
		},
		margins
	);
}