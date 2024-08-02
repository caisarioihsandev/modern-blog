// Checking for user logged in
const token = localStorage.getItem('access_token');
if (!token) {
    location.replace("/login"); // Redirect to login page if no one is logged in
}

// Setting up the blog editor functionalities
const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');
const blogNumId = document.querySelector('.blogId');

// Banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector('.banner');
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');

// upload image in text area
const uploadInput = document.querySelector('#image-upload');

// for banner (heading picture)
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

publishBtn.addEventListener('click', async () => {
    if (articleField.value.length && blogTitleField.value.length) {
        let docName;
        if (blogID[0] == 'editor') {
            // Generating ID
            let letters = 'abcdefghijklmnopqrstuvwxyz';
            let blogTitle = blogTitleField.value.split(" ").join("-");
            let id = '';
            for (let i = 0; i < 4; i++) {
                id += letters[Math.floor(Math.random() * letters.length)];
            }
            docName = `${blogTitle}-${id}`;
        } else {
            docName = decodeURI(blogID[0]);
        }

        let date = new Date();
        
        // Creating the payload
        let data = {
            id: blogNumId.value || '',
            title : blogTitleField.value,
            article : articleField.value,
            bannerImage : bannerPath,
            publishedAt : `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
            docName : docName,
            author: JSON.parse(localStorage.getItem('user')).id
        };

        // Sending data to the server
        await fetch('/apiblog/submit', {
            method : 'post',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token}`
            },
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

// checking for existing blog edits
let blogID = location.pathname.split("/");
blogID.shift(); // it will remove first element which is empty from the array 

if (blogID[0] != "editor") {
    // means we are in existing blog edit route
    fetch(`/apiblog/blog/${decodeURI(blogID[0])}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data) {
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title || '';
            articleField.value = data.article || '';
            blogNumId.value = data.id || '';
        } else {
            location.replace("/"); // home route
        }
    })
    .catch(err => {
        console.log(err);
        location.replace("/");
    });
}