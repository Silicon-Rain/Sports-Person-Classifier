const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

const results = (b64) => {
    $.ajax({ 
        // url: 'http://localhost:5000/classify_image', 
        url: '/api/classify_image',
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify({ 'image_data': b64 }), 
        success: function(response) {
            let name_col = document.getElementById("celeb_name");
            let prob_col = document.getElementById("celeb_prob");

            name_col.innerHTML = "";
            prob_col.innerHTML = "";
            if(response.length != 0) {
                document.getElementById("desc").style.display = "flex";
                document.getElementById("result").innerText = response[0].class;
                document.getElementById("result").style.color = "green";

                const dict = response[0].class_dictionary
                const probs = response[0].class_probability                
                
                for(let i=0;i<probs.length;i++) {
                    name_col.innerHTML += `<div class="cells">${getKeyByValue(dict,i)}</div>`;
                    prob_col.innerHTML += `<div class="cells">${probs[i]}</div>`;
                }
            }
            else {
                document.getElementById("result").innerText = "Unclear Image";
                document.getElementById("result").style.color = "red";
            }
        }, 
        error: function(error) {
            console.log(error); 
            document.getElementById("result").innerText = "Server Error";
            document.getElementById("result").style.color = "aqua";
        } 
    }); 
}

function uploadImage() {
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imageView.style.backgroundImage = `url(${imgLink})`;
    imageView.textContent = "";

    var base64data = "";
    fetch(imgLink)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                base64data = reader.result;
                results(base64data)
            };
        });
}

inputFile.addEventListener("change", uploadImage);

dropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
});

dropArea.addEventListener("drop", function (e) {
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadImage();
});

