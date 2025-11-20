import React, { useState, useEffect } from 'react';
import './App.css';
const initialMockRecipes = [
    { id: 101, title: "Lab News: React CRUD Completed", content: "Successfully implemented mock API handlers for lab tasks.", author: "Lab Instructor", urlToImage: "https://via.placeholder.com/150/007bff/FFFFFF?text=Mock+Post" },
];
const NEWS_API_KEY = '6d01b2a7b02e4cfcbfca947baf387dfa';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;
function App() {
    const [news, setNews] = useState([]);
    const [mockPosts, setMockPosts] = useState(initialMockRecipes);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState({ id: null, title: '', content: '', author: '', urlToImage: '' });
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(NEWS_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const realNews = data.articles.slice(0, 5).map((article, index) => ({
                    id: `real-${index}`,
                    title: article.title,
                    content: article.description || article.content,
                    author: article.author || 'Unknown',
                    urlToImage: article.urlToImage
                }));
                setNews(realNews);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching real news:", err);
                setError("Failed to fetch news. Check API key and network connection.");
                setLoading(false);
            }
        };
        fetchNews();
    }, []);
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            const updatedPosts = mockPosts.map(post => 
                post.id === currentPost.id ? currentPost : post
            );
            setMockPosts(updatedPosts);
            setIsEditing(false);
        } else {
            const newId = Date.now();
            const newPost = { ...currentPost, id: newId };
            setMockPosts([...mockPosts, newPost]);
        }
        setCurrentPost({ id: null, title: '', content: '', author: '', urlToImage: '' });
    };
    const handleEdit = (post) => {
        setIsEditing(true);
        setCurrentPost(post);
        window.scrollTo(0, 0);
    };
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this mock post?")) {
            const filteredPosts = mockPosts.filter(post => post.id !== id);
            setMockPosts(filteredPosts);
        }
    };
    if (loading) return <div className="loading">Loading news...</div>;
    if (error) return <div className="error">{error}</div>;
    return (
        <div className="container">
            <header>
                <h1>📰 React News and CRUD Lab</h1>
                <p>Demonstrating API GET (Real News) and local POST/PUT/DELETE (Mock Posts).</p>
            </header>
            <section className="form-section">
                <h2>{isEditing ? ' Edit Mock Post' : ' Create New Mock Post'}</h2>
                <form onSubmit={handleFormSubmit} className="crud-form">
                    <input 
                        type="text" 
                        placeholder="Title"
                        required
                        value={currentPost.title}
                        onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                    />
                    <textarea 
                        placeholder="Content"
                        required
                        value={currentPost.content}
                        onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    />
                    <input 
                        type="text" 
                        placeholder="Author"
                        value={currentPost.author}
                        onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                    />
                    <input 
                        type="url" 
                        placeholder="Image URL (optional)"
                        value={currentPost.urlToImage}
                        onChange={(e) => setCurrentPost({ ...currentPost, urlToImage: e.target.value })}
                    />
                    <button type="submit">
                        {isEditing ? 'Update Post (PUT)' : 'Add Post (POST)'}
                    </button>
                    {isEditing && <button type="button" onClick={() => { setIsEditing(false); setCurrentPost({ id: null, title: '', content: '', author: '', urlToImage: '' }); }}>Cancel</button>}
                </form>
            </section>
            
            <hr />

            <section className="news-feed">
                <h2> Real News Headlines (GET)</h2>
                <div className="card-grid">
                    {news.map(item => (
                        <NewsCard key={item.id} item={item} isReal={true} />
                    ))}
                </div>
            </section>
            
            <hr />

            <section className="mock-posts">
                <h2>📋 Mock Posts (Local CRUD)</h2>
                <div className="card-grid">
                    {mockPosts.map(item => (
                        <NewsCard 
                            key={item.id} 
                            item={item} 
                            handleEdit={handleEdit} 
                            handleDelete={handleDelete} 
                            isReal={false}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
const NewsCard = ({ item, handleEdit, handleDelete, isReal }) => (
    <div className={`news-card ${isReal ? 'real-news' : 'mock-post'}`}>
        {item.urlToImage && (
            <img 
                src={item.urlToImage} 
                alt={item.title} 
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x200?text=No+Image" }}
            />
        )}
        <h3>{item.title}</h3>
        <p className="author">By: {item.author}</p>
        <p>{item.content && item.content.substring(0, 150)}...</p>
        
        {!isReal && (
            <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(item)}>Edit (PUT)</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
        )}
    </div>
);
export default App;