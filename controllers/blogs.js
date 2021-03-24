const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .populate('user', {blogs: 0})
        .then(blogs => {
            return response.json(blogs)
        })
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

    const user = request.user

    const newBlog = {...request.body}
    if(!newBlog.likes){
        newBlog.likes = 0
    }
    if(!newBlog.url || !newBlog.title){
        return response.status(404).end()
    }
    

    newBlog.user = user._id
    const blog = new Blog(newBlog)

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response)=>{

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() != request.user.id){
        return response.status(401).json({error: 'Unauthorized'})
    }
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
})

blogsRouter.put('/:id', (request, response)=>{
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    Blog
        .findByIdAndUpdate(request.params.id, blog, {new: true})
        .then(updatedBlog=>{
            response.json(updatedBlog)
        })
})

module.exports = blogsRouter