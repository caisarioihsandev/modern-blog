let blogDocName = decodeURI(location.pathname.split("/").pop());

fetch(`/apiblog/blog/${blogDocName}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Blog not found');
        }
        return response.json();
    })
    .then(data => {
        setupBlog(data);
    })
    .catch(error => {
        console.error('Error:', error);
        location.replace("/");
    });

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');

    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML = `Blog : ${data.title}`;
    blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;
    if (data.author) {
        publish.innerHTML += ` -- ${data.username}`;
    }

    const token = localStorage.getItem('access_token');

    if (token) {
        const decode = JSON.parse(localStorage.getItem('user'));
        if (data.author === decode.id) {
            let editBtn = document.getElementById('edit-blog-btn');
            editBtn.style.display = "inline";
            editBtn.href = `${blogDocName}/editor`;
        }
    }

    const article = document.querySelector('.article');
    readArticle(article, data.article);
}

const readArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);
    
    data.forEach(item => {
        // check for heading
        if(item[0] === '#'){
            let hCount = 0;
            let i = 0;
            while(item[i] === '#'){
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}><br/>`
        } 

        //checking for image format
        else if(item[0] === "!" && item[1] === "["){
            let seperator;

            for(let i = 0; i <= item.length; i++){
                if(item[i] === "]" && item[i + 1] === "(" && item[item.length - 1] === ")"){
                    seperator = i;
                }
            }

            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image"><br/>
            `;
        } else {
            ele.innerHTML += `<p>${item}</p><br/>`;
        }
    });
}