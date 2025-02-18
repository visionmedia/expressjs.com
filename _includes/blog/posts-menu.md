<ul id="menu">
  <span class="toc-title"><em>Blog posts</em></span>
  <li>
    <ul id="side-menu" class="active">
    <li>
      <a href="/{{ page.lang }}/blog/posts">All Posts</a>
    </li>
      {% for post in site.posts %}
    <li>
      <a href="{{post.url}}">{{ post.title }}</a>
    </li>
      {% endfor %}
  </ul>
  </li>
</ul> 
<button id="menu-toggle" title="show blogs list">All Blogs &#x25BC;</button>