const blogSection = document.querySelector('.blogs-section');

let token = localStorage.getItem('access_token');
async function fetchData () {
    try {
        const response = await fetch('/admin', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            await response.json();
        } else {
            console.log('Error:', response.statusText);
        }
    
    } catch (error) {
        console.log('Error:', response.statusText);
    }
}

const getUserWrittenBlogs = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch('/apiblog/blogs', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Beaerer ${token}`
        }
    });

    if (!response.ok) {
        console.log("There is no Blog")
    } else {
        const blogs = await response.json();
    
        if (blogs.length > 0) {
            blogs.forEach(blog => {
                createBlog(blog);
            });
        } else {
            console.log("There is no data");
        }        
    }
};

const createBlog = (blog) => {
    blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${blog.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${blog.title.substring(0, 100) + '...'}</h1>
        <p class="blog-overview">${blog.article.substring(0, 200) + '...'}</p>
        <a href="/${blog.docName}" class="btn dark">read</a>
        <a href="/${blog.docName}/editor" class="btn grey">edit</a>
        <a href="/admin" onclick="deleteBlog('${blog.docName}')" class="btn danger delete-blog">delete</a>
    </div>
    `;
};

// fetch blogs initially if token exists
if (localStorage.getItem('access_token')) {
    getUserWrittenBlogs();
}

const deleteBlog = async (docName) => {

    // Delete from databases
    fetch(`/apiblog/remove/${docName}`).then(response => {
        if (!response.ok) {
            throw new Error('Blog already has been delete');
        }
        response.json({msg: 'Blog successfully deleted'});
    });


};