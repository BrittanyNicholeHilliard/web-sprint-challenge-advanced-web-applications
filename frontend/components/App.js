import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios/index'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)


  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/')}
  const redirectToArticles = () => {navigate('/articles')}

  const logout = () => {
    if (localStorage.getItem('token')){
      localStorage.removeItem('token')
    }
    setMessage('Goodbye!')
    redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    axios.post('http://localhost:9000/api/login', {username, password})
    .then(res => {
      const {token} = res.data
      localStorage.setItem('token', token)
      redirectToArticles()
    }).catch(err => {
      console.log(err)
    })
  }



  const getArticles = () => {
    axiosWithAuth().get('http://localhost:9000/api/articles')
    .then(res => {
      setArticles(res.data.articles)
      setMessage(res.data.message)
    }).catch(err => {
      console.log(err)
    })    
  }



  const postArticle = article => {
    axiosWithAuth().post('http://localhost:9000/api/articles', article)
    .then(res => {
      const { article } = res.data
        setArticles(articles.concat(article))
        setMessage(res.data.message)  
      }).catch(err => {
      console.log(err)
    })
  }



  const updateArticle = ( article_id, article ) => {
    setSpinnerOn(true)
    axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`, article)
    .then(res => {
        setMessage(res.data.message)
        const updatedArticle = res.data.article
        setArticles(articles.map(art => (art.article_id === article_id) ? updatedArticle : art
        ))
      }).catch(err => {
        console.log(err)
      })
      setSpinnerOn(false)
  }

  const deleteArticle = article_id => {
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
    .then(res => {
      console.log(res)
      setArticles(articles.filter(art => (art.article_id != article_id)))
      setMessage(res.data.message)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm articles={articles} postArticle={postArticle} updateArticle={updateArticle} currentArticle={articles.find(x => x.article_id === currentArticleId)}  currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId}/>
              <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
