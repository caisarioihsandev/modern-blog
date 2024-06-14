const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector('.banner');
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
});

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes("image")) {
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if (uploadType == "image") {
                addImage(data, file.name);
            } else {
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        });
    } else {
        alert("upload image only");
    }
};

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
};

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    if (articleField.value.length && blogTitleField.value.length) {
        // Generating ID
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // Setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date();
        
        // Creating the payload
        let data = {
            title : blogTitleField.value,
            article : articleField.value,
            bannerImage : bannerPath,
            publishedAt : `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            docName : docName
        };

        // Sending data to the server
        fetch('/submit', {
            method : 'post',
            headers: {'Content-Type' : 'application/json'},
            body : JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                location.href = `/`;
            } else {
                console.log(result.error);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
});