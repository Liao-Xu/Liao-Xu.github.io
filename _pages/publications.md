---
layout: archive
title: "Publication (*: equal contributions; †: corresponding author; #: alphabetical order)"
permalink: /publications/
author_profile: true
---

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{[author.googlescholar](https://scholar.google.com/citations?user=_F26oo4AAAAJ&hl=en)}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
