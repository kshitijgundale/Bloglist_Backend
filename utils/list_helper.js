const e = require('cors')
const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog)=> sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
    let sorted_list = blogs.sort((a,b ) => b.likes - a.likes)
    const {title, author, likes} = sorted_list[0]
    return {title, author, likes}
}

const mostBlogs = (blogs) => {
    let grouped_by_author = _.countBy(blogs, 'author')
    let blog_freq = Object.keys(grouped_by_author).map((elm)=>(
        {
            author: elm,
            blogs: grouped_by_author[elm]
        }
    ))
    let sorted_list = blog_freq.sort((a, b)=> b.blogs - a.blogs)

    return sorted_list[0]
}

const mostLikes = (blogs) =>{
    let grouped_by_author = _.groupBy(blogs, 'author')
    let likes = Object.keys(grouped_by_author).map((elm)=>(
        {
            author: elm,
            likes: grouped_by_author[elm].reduce((sum, blog)=>sum+blog.likes, 0)
        }
    ))
    let sorted_list = likes.sort((a, b)=> b.blogs - a.blogs)

    return sorted_list[0]
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}