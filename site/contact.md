---
layout: default
title: "Contact — Sara Sadr Jahani"
permalink: /contact/
show_footer_cta: false
---
<div class="page-header">
  <h1>Get in touch</h1>
  <p class="lede">Happy to talk about LLM systems, retrieval and agent projects, or AI engineering roles. Email or LinkedIn is the quickest way to reach me.</p>
</div>

<section>
  <div class="contact-block reveal">
    <h2>Let&rsquo;s build something reliable.</h2>
    <div class="contact-links">
      {% for s in site.socials %}<a href="{{ s.url }}">{{ s.url | remove: "mailto:" }}</a>{% endfor %}
      <a href="{{ '/cv/' | relative_url }}">CV — PDF</a>
    </div>
  </div>
</section>
