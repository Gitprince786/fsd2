import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addPost,
  deletePost,
  fetchPosts,
  selectAllPosts,
  selectPostError,
  selectPostMetrics,
  selectPostStatus,
  selectUpcomingPosts,
} from './features/posts/postsSlice';

const tabs = ['Overview', 'Calendar', 'Analytics'];
const emptyForm = { title: '', platform: 'Instagram', status: 'Draft', date: '2026-08-01', content: '' };

function App() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const upcomingPosts = useSelector(selectUpcomingPosts);
  const metrics = useSelector(selectPostMetrics);
  const loading = useSelector(selectPostStatus);
  const error = useSelector(selectPostError);
  const navItems = [
    { label: 'Overview', icon: '◉', key: 'Overview' },
    { label: 'Calendar', icon: '▦', key: 'Calendar' },
    { label: 'Analytics', icon: '◌', key: 'Analytics' },
  ];
  const [activeTab, setActiveTab] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(emptyForm);
  const [showComposer, setShowComposer] = useState(false);

  const handleNotification = () => alert('No new notifications');
  const handleRefresh = () => dispatch(fetchPosts());

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const visiblePosts = filter === 'All' ? posts : posts.filter((post) => post.status === filter);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    dispatch(addPost({ ...form, id: `p-${Date.now()}`, color: 'violet' }));
    setForm(emptyForm);
    setShowComposer(false);
  };

  return (
    <main className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="brand"><span className="brand-mark">B</span><span>Biggainer</span></div>
        <div className="workspace-switcher"><span className="avatar">AM</span><span><strong>Growth Lab</strong><small>Performance workspace</small></span><span className="chevron">⌄</span></div>
        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot"><div className="sync-dot" /> <span>Redux store synced</span><small>v2.4.1</small></div>
      </aside>

      <section className="content-area">
        <header className="topbar"><button type="button" className="menu-toggle" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle menu">☰</button><div className="crumb">Workspace <span>/</span> {activeTab}</div><div className="top-actions"><button className="icon-button" type="button" onClick={handleNotification} aria-label="Notifications">♢<i /></button><span className="user-name">Alex Morgan</span><span className="avatar avatar-dark">AM</span></div></header>
        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">TUESDAY, JULY 21, 2026</p><h1>Good morning, Alex <span>✦</span></h1><p className="subheading">Your content engine is humming. Here is the shape of the week.</p></div><button className="primary-button" onClick={() => setShowComposer(true)}><span>＋</span> Create post</button></div>

          <div className="tab-row">{tabs.map((tab) => <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>{tab}</button>)}<div className="tab-line" /></div>

          {activeTab === 'Overview' && <>
            <div className="metric-grid"><Metric label="Total posts" value={metrics.total} note="+18% from last month" accent="coral" icon="✦" /><Metric label="Published" value={metrics.published} note="On track this week" accent="mint" icon="✓" /><Metric label="Scheduled" value={metrics.scheduled} note="Next: in 2 days" accent="blue" icon="◷" /><Metric label="Avg. engagement" value="8.4%" note="+2.1% this month" accent="gold" icon="↗" /></div>
            <div className="section-heading"><div><h2>Content pulse</h2><p>Everything you need to keep the week moving.</p></div><button className="text-button" onClick={() => setActiveTab('Calendar')}>View calendar <span>→</span></button></div>
            <div className="dashboard-grid"><section className="panel schedule-panel"><div className="panel-heading"><div><h3>Upcoming schedule</h3><p>Next pieces in your publishing queue</p></div><span className="live-label"><i /> Live</span></div>{loading === 'pending' ? <div className="loading-state">Loading your content queue...</div> : error ? <div className="error-state">{error}</div> : <div className="post-list">{upcomingPosts.map((post) => <PostRow key={post.id} post={post} onDelete={() => dispatch(deletePost(post.id))} />)}</div>}<button className="panel-link" onClick={() => setActiveTab('Calendar')}>See all content <span>→</span></button></section><section className="panel insight-panel"><div className="panel-heading"><div><h3>Channel mix</h3><p>Where your voice is showing up</p></div><span className="dots">•••</span></div><div className="donut-wrap"><div className="donut"><strong>4</strong><span>channels</span></div><div className="legend"><Legend color="coral" label="Instagram" value="42%" /><Legend color="blue" label="LinkedIn" value="28%" /><Legend color="gold" label="X" value="18%" /><Legend color="mint" label="Threads" value="12%" /></div></div><div className="insight-note"><span>↗</span><p><strong>Nice balance.</strong> Instagram is carrying your reach this month.</p></div></section></div>
          </>}
          {activeTab === 'Calendar' && <Calendar posts={posts} filter={filter} setFilter={setFilter} visiblePosts={visiblePosts} onDelete={(id) => dispatch(deletePost(id))} onRefresh={() => dispatch(fetchPosts())} loading={loading} />}
          {activeTab === 'Analytics' && <Analytics metrics={metrics} />}
        </div>
      </section>
      {showComposer && <div className="modal-backdrop" onMouseDown={() => setShowComposer(false)}><form className="composer" onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()}><div className="composer-head"><div><p className="eyebrow">NEW CONTENT</p><h2>Create a post</h2></div><button type="button" className="close-button" onClick={() => setShowComposer(false)}>×</button></div><label>Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Give this post a working title" /></label><div className="form-row"><label>Platform<select value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })}>{['Instagram', 'LinkedIn', 'X', 'Threads'].map((option) => <option key={option}>{option}</option>)}</select></label><label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{['Draft', 'Scheduled', 'Published'].map((option) => <option key={option}>{option}</option>)}</select></label></div><label>Publish date<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label>Content<textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="What do you want to say?" rows="4" /></label><button className="primary-button full-width">Add to workspace <span>→</span></button></form></div>}
    </main>
  );
}

function Metric({ label, value, note, accent, icon }) { return <div className="metric-card"><div className={`metric-icon ${accent}`}>{icon}</div><p>{label}</p><strong>{value}</strong><small className={accent === 'coral' || accent === 'mint' ? 'positive' : ''}>{note}</small></div>; }
function Legend({ color, label, value }) { return <div className="legend-row"><span className={`legend-dot ${color}`} />{label}<strong>{value}</strong></div>; }
function PostRow({ post, onDelete }) { return <div className="post-row"><div className={`post-badge ${post.color}`}>{post.platform.slice(0, 1)}</div><div className="post-copy"><strong>{post.title}</strong><span>{post.platform} · {new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><span className={`status ${post.status.toLowerCase()}`}>{post.status}</span><button className="row-delete" onClick={onDelete} aria-label={`Delete ${post.title}`}>×</button></div>; }
function Calendar({ posts, filter, setFilter, visiblePosts, onDelete, onRefresh, loading }) { return <div className="calendar-view"><div className="section-heading"><div><p className="eyebrow">CONTENT LIBRARY</p><h2>Publishing calendar</h2><p>Normalized posts, ready for action.</p></div><button className="secondary-button" onClick={onRefresh}>{loading === 'pending' ? 'Refreshing...' : '↻ Refresh data'}</button></div><div className="filter-row">{['All', 'Draft', 'Scheduled', 'Published'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}{item !== 'All' && <span>{posts.filter((post) => post.status === item).length}</span>}</button>)}</div><div className="library-grid">{visiblePosts.map((post) => <article className="library-card" key={post.id}><div className={`library-band ${post.color}`} /><div className="library-card-body"><div className="card-top"><span className={`status ${post.status.toLowerCase()}`}>{post.status}</span><button className="row-delete" onClick={() => onDelete(post.id)}>×</button></div><h3>{post.title}</h3><p>{post.content}</p><footer><span>{post.platform}</span><time>{post.date}</time></footer></div></article>)}</div></div>; }
function Analytics({ metrics }) { return <div className="analytics-view"><div className="section-heading"><div><p className="eyebrow">PERFORMANCE SNAPSHOT</p><h2>Analytics at a glance</h2><p>Derived state keeps the numbers consistent with your posts.</p></div></div><div className="analytics-board"><div className="chart"><div className="chart-label"><span>Engagement trend</span><strong>+24.8%</strong></div><div className="bars">{[38, 54, 46, 72, 64, 86, 74, 94].map((height, index) => <div className="bar-column" key={index}><div className="bar" style={{ height: `${height}%` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M'][index]}</small></div>)}</div></div><div className="analytics-list"><h3>Content health</h3><div><span>Publishing consistency</span><strong>86%</strong></div><div><span>Channel coverage</span><strong>{metrics.total}/4</strong></div><div><span>Queue readiness</span><strong>{metrics.scheduled + metrics.published}/{metrics.total}</strong></div></div></div></div>; }

export default App;
