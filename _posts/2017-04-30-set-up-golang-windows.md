---
layout: post
title: "Set up Development Environment Untuk Memulai Coding Golang di Windows"
title_header: Blog
date: 2017-04-30
---

<h3>Instalasi</h3>
<p>
Untuk memulai coding di Golang di Sistem Operasi Windows, ada beberapa tahap yang harus di lakukan.
</p>
<p>
Tahap pertama yang harus di lakukan adalah mendownload binary/ file instalasi dari Golang. Download <a href="https://golang.org/dl/">disini</a>.<br>
<img src="/assets/img/posts/2017-04-30-set-up-golang-windows-1.jpg" width="500" height="250"/><br>
Setelah download selesai, langkah berikutnya adalah proses installasi. Proses installasi sangat mudah, tinggal klik dua kali pada file yang udah kalian download.
Tinggal tekan next sampai selesai.
</p>

<hr>

<h3>Environment variable</h3>
<p>
<b>Setting environment variable</b>, pada tahap ini kita akan fokus untuk set up komputer kita supaya bisa di gunakan untuk development Go.<br>
Setelah proses instalasi selesai, jika setting folder untuk instalasi Go default, biasanya akan berada di <b>C:\Go</b> <br>
<img src="/assets/img/posts/2017-04-30-set-up-golang-windows-2.jpg" width="500" height="250"/><br>
<b>copy alamat folder C:\Go</b> dan buka <b>Control Panel > System and Security > System > Advance System Settings > Environtment Variables.</b><br>
Pada bagian <b>System Properties</b> pilih <b>New</b><br>
<img src="/assets/img/posts/2017-04-30-set-up-golang-windows-3.jpg" width="418" height="477"/><br>
Langkah selanjutnya adalah set up <b>GOPATH</b>, <b>GOPATH</b> environment variable adalah lokasi spesifik untuk folder <b>Workspace</b> kita.<br>
Secara default biasanya berada di <b>C:\Users\YourName\go</b> di Sistem Operasi <b>Windows</b>
Jadi semua folder projek <b>Go</b> kita akan berada di satu tempat, mengapa.... nanti bakal saya jelaskan.<br>
Proses hampir sama dengan set up  <b>GOROOT</b> di atas. buka <b>Control Panel > System and Security > System > Advance System Settings > Environtment Variables.</b><br>
Pada bagian <b>System Properties</b> pilih <b>New</b><br>
<img src="/assets/img/posts/2017-04-30-set-up-golang-windows-4.jpg" width="418" height="477"/><br>
Bisa dilihat pada gambar di atas, saya meletakan folder <b>Workspace</b> di <b>E:\JIMAT\go-project</b>, jadi nanti semua projek <b>Go</b> yang saya buat akan berada disini.<br> 
Nah... sampai tahap ini kita sudah melakukan dua langkah penting dalam proses set up <b>environment variable</b> untuk memulai development di <b>Go</b>.<br>
Buka <b>CMD</b><br>
jalankan perintah<br>
<b> $ go env </b><br>
Jika tidak ada masalah akan muncul output seperti ini<br>
</p>
<img src="/assets/img/posts/2017-04-30-set-up-golang-windows-5.jpg" width="520" height="276"/><br>

<hr>

<h3>Point Penting</h3>
<p>
<ul>
<li>Go Programmer biasanya meletakan Code mereka berada dalam satu <i>Workspace</i></li>
<li>Dalam satu <i>Workspace</i> memiliki banyak repositori yang di kelola oleh <i>Version Control</i> seperti <b>Git</b></li>
<li>Setiap repositori memiliki satu atau lebih <i>Package</i></li>
<li>Dalam satu <i>Package</i> memiliki satu atau lebih <b>Go Code</b> dalam satu folder, jadi dalam satu folder dalam setiap file <b>.go</b> harus memiliki nama <i>Package</i> yang sama</li>
<ul>
</p>

<hr>

<h3>Aplikasi Pertama</h3>
<p>
Pada folder <b>Workspace</b> kita nanti akan ada tiga folder, yaitu:
</p>
<p>
<ul>
<li><b>src</b>, di folder inilah semua projek kita berada</li>
<li><b>pkg</b>, di folder inilah semua <b>Package Objects</b> kita berada</li>
<li><b>bin</b>, di folder inilah semua <b>binary</b> file atau file <b>.exe</b> kita berada, file tersebut terbentu setelah kita menjalankan <b>$ go build</b> di root projek kita</li>
<ul>
</p>

<p>
Buatlah folder <b>src</b> di folder <b>GOPATH</b> kamu, kalau di tempatku beradi di <b>E:\JIMAT\go-project\src</b>.<br>
Setelah pembuatan folder diatas, buatlah folder lagi di <b>E:\JIMAT\go-project\src</b>, dengan format berikut <b>github.com/username-kamu</b><br>
Lebih bagus lagi jika kamu sudah memiliki akun <a href="https://github.com/">Github</a>.<br>
Pada <b>github.com/username-kamu</b> Ganti <i>username</i> dengan username <a href="https://github.com/">Github</a> kamu.<br>
Di folder <b>github.com/username-kamu</b> Buat folder lagi dengan nama <b>go-app1</b>, jadi hasilya menjadi seperti ini, kalau di tempat saya: <br>
<b>E:\JIMAT\go-project\src\github.com\wuriyanto48\go-app1</b>.<br>
Buat satu file dengan nama <b>main.go</b> di folder <b>go-app1</b>, letakan kode program berikut:
</p>

```go
	package main

	import "fmt"

	func main() {
		fmt.Println("Hello, Indonesia.....")
	}
```

<p>
Jalankan perintah<br>
<b>$ go run main.go</b><br>
Kalo semua proses instalasi di jalankan dengan benar, maka akan terlihat output:
<b>Hello, Indonesia.....</b>
</p>

<hr>

<h3>Kesimpulan</h3>
<p>
Nah.... sampai disini, kita sudah berhasil melakukan proses instalasi, <b>setting environment variable</b> dan membuat aplikasi pertama kita. Proses tidak terlalu sulit si kalau menurut saya...<br>
Pada artikel berikutnya mungkin kita akan bahas hal menarik lainya dari <b>Go Programming</b>.<br>
</p>

<h3>bye...........</h3>