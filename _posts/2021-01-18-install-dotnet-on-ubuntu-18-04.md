---
layout: post
comments: true
title: "Install Dotnet on Ubuntu 18.04"
title_header: Blog
date: 2021-01-18
---

<h3>Install Dotnet SDK and Dotnet runtime</h3>

install SDK
```shell
$ wget https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
$ sudo dpkg -i packages-microsoft-prod.deb
$ sudo apt-get update; \
  sudo apt-get install -y apt-transport-https && \
  sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-5.0
```

install runtime
```shell
$ sudo apt-get update; \
  sudo apt-get install -y apt-transport-https && \
  sudo apt-get update && \
  sudo apt-get install -y aspnetcore-runtime-5.0
```

verify the installation
```shell
$ dotnet -h
```

create console app
```shell
$ dotnet new console -o myapp
$ cd myapp/
$ dotnet run
```