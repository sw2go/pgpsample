function init(input) {
	
	console.log(input);

	input.addEventListener('change', function() {
		console.log("input");
		

		var reader = new FileReader();
		reader.onload = function() {
			var arrayBuffer = this.result,
			array = new Uint8Array(arrayBuffer),
			binaryString = String.fromCharCode.apply(null, array);
			console.log(binaryString);
		}
		reader.readAsArrayBuffer(this.files[0]);

	}, false);		
};
	




async function readText(event) {
  const file = event.target.files.item(0)
  const text = await file.text();
  console.log("hoi");
  document.getElementById("output").innerText = text
  
  var fileContent = "My epic novel that I don't want to lose.";
  var bb = new Blob([fileContent ], { type: 'text/plain' });
  var a = document.getElementById("download");
  a.download = 'download.txt';
  a.href = window.URL.createObjectURL(bb);
}







