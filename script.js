var publicKeyArmored;
var privateKeyArmored;




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


async function generateKeys() {

    const userid = { name: 'Jon Smith', email: 'jon@example.com' };
	const passphrase = 'my passphrase';
    
	const key = await window.openpgp.generateKey({
        type: 'rsa', // Type of the key
        rsaBits: 2048, // RSA key size (defaults to 4096 bits)
        userIDs: [userid], // you can pass multiple user IDs
        passphrase: passphrase // protects the private key
    });
	
	console.log(key);
	publicKeyArmored = key.publicKey;
	privateKeyArmored = key.privateKey;

}


function downloadBlob(data, fileName, mimeType) {
	var blob, url;
	blob = new Blob([data], {
	type: mimeType
	});
	url = window.URL.createObjectURL(blob);
	downloadURL(url, fileName);
	setTimeout(function() {
	return window.URL.revokeObjectURL(url);
	}, 1000);
}

function downloadURL(data, fileName) {
	var a;
	a = document.createElement('a');
	a.href = data;
	a.download = fileName;
	document.body.appendChild(a);
	a.style = 'display: none';
	a.click();
	a.remove();
}


async function pgp_encrypt(inputBuffer, passphrase) {
		
	var message = await window.openpgp.createMessage({ binary: inputBuffer });
	const publicKey = await window.openpgp.readKey({ armoredKey: publicKeyArmored });
	const privateKey = await window.openpgp.decryptKey({ privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }), passphrase });
	
	var encrypted = await openpgp.encrypt({
        message, // input as Message object
        encryptionKeys: publicKey, //
        signingKeys: privateKey, // optional,
		format: 'binary',
		config: { preferredCompressionAlgorithm: openpgp.enums.compression.zlib }
    });
	console.log(encrypted);
	return encrypted;	
}

async function pgp_decrypt(inputBuffer, passphrase) {
	
	const privateKey = await window.openpgp.decryptKey({ privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }), passphrase });
		
	const encryptedMessage = await openpgp.readMessage({
        binaryMessage: inputBuffer // parse encrypted bytes
    });
	const { data: decrypted, signatures } = await openpgp.decrypt({
        message: encryptedMessage,
        decryptionKeys: privateKey,
        format: 'binary' // output as Uint8Array
    });
	
	return decrypted;
    
}



async function encrypt(inputBuffer, secret) {
	var message = await window.openpgp.createMessage({ binary: inputBuffer });
	var encrypted = await openpgp.encrypt({
        message, // input as Message object
        passwords: [secret], // multiple passwords possible
        format: 'binary' // don't ASCII armor (for Uint8Array output)
    });
	
	return encrypted;
    
}

async function decrypt(inputBuffer, secret) {
	
	const encryptedMessage = await openpgp.readMessage({
        binaryMessage: inputBuffer // parse encrypted bytes
    });
	const { data: decrypted } = await openpgp.decrypt({
        message: encryptedMessage,
        passwords: [secret], // decrypt with password
        format: 'binary' // output as Uint8Array
    });
	
	return decrypted;
    
}


function downloadStream() {
	
	const url = 'https://d8d913s460fub.cloudfront.net/videoserver/cat-test-video-320x240.mp4';
	const fileStream = streamSaver.createWriteStream('cat.mp4');

	fetch(url).then(res => {
	  const readableStream = res.body

	  // more optimized
	  //if (window.WritableStream && readableStream.pipeTo) {
	  //	return readableStream.pipeTo(fileStream)
	  //	  .then(() => console.log('done writing'))
	  //}

	  window.writer = fileStream.getWriter()

	  const reader = res.body.getReader()
	  const pump = () => reader.read()
		.then(res => res.done
		  ? writer.close()
		  : writer.write(res.value).then(pump))

	  pump()
	})
	
	
}












