const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async ()=>{
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog=>new Blog(blog))
    const promiseArray = blogObjects.map(blog=>blog.save())
    await Promise.all(promiseArray)
})

test('notes are returned as JSON', async ()=>{
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('identifier is named as id', async ()=>{
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('posting new blog', async ()=>{
  const newBlog = {
    title: "ABCD",
    author: "BCDS",
    url: "efnenfw",
    likes: 17
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'ABCD'
  )
})

test('checking likes property', async ()=>{
  const newBlog = {
    title: "ABCD",
    author: "BCDS",
    url: "efnenfw"
  }

  const returnedBlog = await api.post('/api/blogs').send(newBlog)
  expect(returnedBlog.body.likes).toBe(0)
})

test('url or title missing', async ()=>{
  const newBlog = {
    title: "ABCD",
    author: "BCDS",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(404)
})

afterAll(() => {
    mongoose.connection.close()
})