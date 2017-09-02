---
layout: post
comments: true
title: "How To Fixing docker npm install Error: getaddrinfo ENOTFOUND registry.npmjs.org registry.npmjs.org:443"
title_header: Blog
date: 2017-09-02
---

<h3>Open and Edit NetworkManager.conf file</h3>

```shell
gedit /etc/NetworkManager/NetworkManager.conf
```

<p>Next, Comment this line</p>

```
#dns=dnsmasq
```

Next Execute the following commands

```shell
sudo service network-manager restart
```

```shell
sudo service docker restart
```

<h3>Hope this help...</h3>
