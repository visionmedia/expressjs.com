<div id="blog-side-menu-container">
  <h3 class="toc-title">
    <a href="/{{ page.lang }}/blog/posts">All Posts</a>
  </h3>
  <ul id="blog-side-menu">
    <span class="toc-title"><em>On this page</em></span>
      {% for post in site.posts %}
    <li>
      <a href="{{post.url}}">{{ post.title }}</a>
    </li>
      {% endfor %}
  </ul>
</div> 
<button id="menu-toggle" title="show blogs list">All Blogs &#x25BC</button>