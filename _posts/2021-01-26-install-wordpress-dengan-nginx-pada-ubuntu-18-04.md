---
layout: post
comments: true
title: "Install Wordpress dengan LEMP Stack (Linux, Nginx, MySQL, & PHP)"
title_header: Blog
date: 2021-01-26
---

#### Membuat environment Virtual Machine dengan VirtualBox dan Vagrant

Kita belum akan menggunakan komputer `server asli`, melainkan kita akan menggunakan `Virtual Machine`. Untuk mempermudah proses menejnya, kita akan memanfaatkan Vagrant (https://www.vagrantup.com/). Jadi pastikan `VirtualBox` https://www.virtualbox.org/ dan `Vagrant` sudah terinstall pada komputer anda.

Saya akan menggunakan Virtual Machine `Ubuntu 18`. Jika belum ada, perintah dibawah akan mengunduhkan `box ubuntu/bionic64` ke lokal komputer anda.
```shell
$ vagrant box add ubuntu/bionic64
```
Buatkan folder dan inisialisasi `Vagrant` environment dengan `ubuntu/bionic64`.
```shell
$ mkdir wordpress-vagrant
$ cd wordpress-vagrant
$ vagrant init ubuntu/bionic64
```
Proses diatas akan membuatkan satu buah file yaitu `Vagrantfile`. Kita akan sesuaikan sedikit file `Vagrantfile` nya.
```
Vagrant.configure("2") do |config|

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = "ubuntu/bionic64"

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  config.vm.network "forwarded_port", guest: 80, host: 5000, host_ip: "127.0.0.1"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.14"
  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    # vb.gui = true
  
    # Customize the amount of memory on the VM:
    vb.memory = "4090"
  end
end
```

Pada setting diatas kita set `private_network` menjadi `192.168.33.14`. Sehingga nanti kita bisa akses website kita pada alamat tersebut.

Jalankan Virtual Machine anda.
```shell
$ vagrant up
```

Masuk kedalam Virtual Machine anda.
```shell
$ vagrant ssh
```

#### Install `Nginx`

```shell
$ sudo apt-get update
$ sudo apt-get install nginx
```

#### Setting `Firewall`

Selama proses development biasanya kita memakai koneksi non `https`. Jadi kita perlu mengijinkan `unsecure connection`.
Kita buka port `80`.

```shell
$ sudo ufw allow 'Nginx HTTP'
```

Cek konfigurasi

```shell
$ sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx HTTP                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx HTTP (v6)            ALLOW       Anywhere (v6)
```

Kita coba koneksi `http` tadi dengan membuka alamat `IP` kita `http://192.168.33.14`. Jika sudah running dengan baik akan tampil `Welcome to Nginx`.

#### Install `MySQL`

```shell
$ sudo apt install mysql-server
```

Ubuntu system dimana `MySQL 5.7 >` berjalan, `user root` MySQL-nya menggunakan `auth_socket`. Jadi kita perlu mengganti mekanisme authentication pada user `root` dari `auth_socket plugin` dengan password (`mysql_native_password`). Hal ini akan mempermudah kita menggunakan user `root` untuk external program.

```shell
$ sudo mysql
```

Kemudian kita check setiap `user` terkait mekanisme `auth method` yang dipakai

```
mysql> SELECT user,authentication_string,plugin,host FROM mysql.user;

+------------------+-------------------------------------------+-----------------------+-----------+
| user             | authentication_string                     | plugin                | host      |
+------------------+-------------------------------------------+-----------------------+-----------+
| root             |                                           | auth_socket           | localhost |
| mysql.session    | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| mysql.sys        | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| debian-sys-maint | *32DFAEC16BD57C7FC6B98DB435A68DCD729F6619 | mysql_native_password | localhost |
+------------------+-------------------------------------------+-----------------------+-----------+
4 rows in set (0.00 sec)
```

Bisa kita lihat, user `root` masih menggunakan metode `auth_socket`. Kita konfigurasi ulang user `root` dengan menggunakaan metode `password`.

Untuk contoh ini kita gunakan password `12345`. Tetapi disarankan sekali menggunakan password yang sangat `strong`.

```shell
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345';
```

Kita jalankan `FLUSH PRIVILEGES` untuk memperbaharui konfigurasi yang baru kita jalankan.
```shell
mysql> FLUSH PRIVILEGES;
```

Kita cek lagi hasilnya. Pastikan user `root` sudah menggunakan metode `password`

```shell
mysql> SELECT user,authentication_string,plugin,host FROM mysql.user;

+------------------+-------------------------------------------+-----------------------+-----------+
| user             | authentication_string                     | plugin                | host      |
+------------------+-------------------------------------------+-----------------------+-----------+
| root             | *00A51F3F48415C7D4E8908980D443C29C69B60C9 | mysql_native_password | localhost |
| mysql.session    | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| mysql.sys        | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | mysql_native_password | localhost |
| debian-sys-maint | *32DFAEC16BD57C7FC6B98DB435A68DCD729F6619 | mysql_native_password | localhost |
+------------------+-------------------------------------------+-----------------------+-----------+
4 rows in set (0.00 sec)
```

Bisa kita lihat, saat ini user `root` sudah tidak menggunakan metode `auth_socket`. Kemudian keluar dari `mysql`.
```shell
mysql> exit
```

Cek kembali apakah saat ini user `root` sudah menggunakan metode `password`.
```shell
$ mysql -u root -p
$ Enter password:
```

Selanjutnya kita persiapkan sekaligus untuk database `Wordpress` nya. Kita buat database dengan nama `kopicom`

```shell
$ mysql> CREATE DATABASE kopicom;
```

Jika sukses akan ada database baru dengan nama `kopicom`.

```shell
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| kopicom            |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
```

Kemudian keluar dari `mysql`.
```shell
mysql> exit
```

#### Install `PHP (PHP-FPM)`

By default `Nginx` tidak terdapat `native PHP proccessing` seperti pada Apache. Jadi kita perlu install `php-fpm` (fastCGI process manager). Kita akan perintahkan `Nginx` untuk memproses ke `php-fpm` melalui file konfigurasinya nanti.

```shell
$ sudo add-apt-repository universe
$ sudo apt-get install php-fpm php-mysql
```

#### Menambahkan `server blocks`

Setiap satu website ada baiknya kita buatkan satu `server blocks` untuk di `Nginx`. Mirip dengan konsep `virtual hosts` pada `Apache`. Konfigurasi server `blocks` berada pada folder `/etc/nginx/sites-available/`. Kita tambahkan file konfigurasi baru `kopi.com`. Kita samakan file konfigurasi tersebut dengan nama `domain` website yang kita buat.

```shell
$ sudo nano /etc/nginx/sites-available/kopi.com
```

Masukan konfigurasi berikut.
```
server {
        listen 80;
        root /var/www/kopicom;
        index index.php index.html index.htm index.nginx-debian.html;
        server_name kopi.com;

        location / {
                try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        }

        location ~ /\.ht {
                deny all;
        }
}
```

Simpan dan keluar dari `nano` atau `vi`. Sekarang kita aktifkan konfigurasi tadi dengan membuat `symbolic link` dari file konfigurasi yang barus saja kita buat dari dalam folder `/etc/nginx/sites-available/` ke `/etc/nginx/sites-enabled/`.

```shell
$ sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

Kita `unlink` konfigurasi `default` dari dalam folder `/etc/nginx/sites-enabled/`

```shell
$ sudo unlink /etc/nginx/sites-enabled/default
```

> Jika suatu saat kita ingin mengembalikan file konfigurasi `default` tadi tinggal menjalaankan perintah berikut.

```shell
$ sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
```

Kita pastikan tidak ada error pada file konfigurasi tadi, dengan menjalankan perintah berikut.

```shell
$ sudo nginx -t
```

Jika sudah tidak ada error, kita reload `Nginx`.

```shell
$ sudo systemctl reload nginx
```

#### Install `Wordpress`

Kita download dulu `Wordpress` versi terbaru. Download pada folder yang anda inginkan.

```shell
$ sudo wget https://wordpress.org/latest.tar.gz
```

Kita extract file archive tersebut.

```shell
$ sudo tar -xzvf latest.tar.gz
```

Kemudian kita pindahkan kedalam folder `/var/www`

```shell
$ sudo mv wordpress/ /var/www/kopicom
```

Selanjutnya tambahkan file `wp-config.php` yang kita `copy` dari contoh file konfigurasi `wp-config-sample.php`. Kita sesuaikan pada bagian konfigurasi databasenya dengan yang sudah kita buat.

```php
/** The name of the database for WordPress */
define( 'DB_NAME', 'kopicom' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '12345' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
```

Jika sudah, kita reload kembali `Nginx`.

```shell
$ sudo systemctl reload nginx
```

Cek `Nginx`.

```shell
$ sudo systemctl status nginx
```

Reload kembali halaman web kita pada alamat `http://192.168.33.14`. Jika semua proses diikuti dengan benar maka akan tampil halaman website yang 
kita buat dengan `Wordpress`.