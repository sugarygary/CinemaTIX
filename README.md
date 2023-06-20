# Project: CinemaTIX API

API ini digunakan untuk developer bioskop untuk mempromosikan dan melakukan pembelian tiket yang akan dilakukan oleh beberapa marketplace dan website-website review

# 📁 Collection: Bioskop

## End-point: Register Bioskop Developer

Endpoint ini digunakan untuk registrasi akun developer milik bioskop. Bioskop bisa menambahkan cabang, studio, dan jadwal baru.

### Method: POST

> ```
> undefined
> ```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Login Bioskop Developer

Endpoint ini digunakan untuk mendapatkan API key developer bioskop untuk mengakses endpoint developer bioskop yang membutuhkan Authentication dan Authorization.

### Method: POST

> ```
> undefined
> ```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Buka Cabang Baru

Endpoint ini akan digunakan untuk membuat cabang bioskop baru. Cabang bioskop akan memiliki beberapa studio.

### Method: POST

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 37kpt8pjnX |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Buat Studio Baru

Endpoint ini akan digunakan untuk membuat studio dari cabang bioskop yang dimiliki. Pastikan untuk menginput studio secara urut mulai dari studio 1 sampai terakhir karena nomor studio akan auto-generate. Studio akan memiliki jadwal film.

### Method: POST

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 37kpt8pjnX |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Buat Jadwal Baru

Endpoint ini digunakan untuk membuat jadwal baru. Endpoint ini akan otomatis membuatkan tiket sesuai baris dan kolom studio.

### Method: POST

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 37kpt8pjnX |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Cabang

Endpoint ini akan menampilkan cabang yang dimiliki bioskop beserta studionya.

### Method: GET

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 37kpt8pjnX |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Jadwal

Endpoint ini akan menampilkan jadwal yang tayang pada cabang yang dimiliki bioskop

### Method: GET

> ```
> localhost:3000/api/bioskop/jadwal/:id_cabang
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 37kpt8pjnX |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Sales Report

Endpoint ini akan menampilkan total pendapatan dan history transaksi tiket yang berhasil.

### Method: GET

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 37kpt8pjnX |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Void Tiket

Endpoint ini digunakan untuk void tiket agar tidak bisa dibeli oleh marketplace. Endpoint ini berguna untuk meniadakan tiket-tiket yang sudah dibeli lewat pembelian di bioskop langsung secara offline atau nomor kursi tidak tersedia karena infrastruktur studio.

### Method: PUT

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 37kpt8pjnX |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Delete Cabang

Endpoint ini digunakan untuk menghapus cabang yang tidak aktif.

### Method: DELETE

> ```
> localhost:3000/api/bioskop/delete-cabang/:id_cabang
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 37kpt8pjnX |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Web Review

## End-point: Register Web Review

Endpoint ini digunakan untuk registrasi akun developer website review. Developer web bisa mengakses endpoint untuk menampilkan informasi bioskop dan film.

### Method: POST

> ```
> undefined
> ```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Login Web Review

Endpoint ini digunakan untuk mendapatkan API key developer web review untuk mengakses endpoint developer web review yang membutuhkan Authentication dan Authorization.

### Method: POST

> ```
> undefined
> ```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Subscribe

Endpoint ini digunakan webreview untuk berlangganan dengan CinemaTIX API supaya bisa mengakses informasi jadwal bioskop dan film yang up to date.

### Method: POST

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | nVPl0L7BBU |

### Body formdata

| Param            | value | Type |
| ---------------- | ----- | ---- |
| bukti_pembayaran |       | file |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Query Bioskop

Endpoint akan menampilkan bioskop sesuai keyword atau semua bioskop yang terdaftar di CinemaTIX jika keyword tidak disertakan.

### Method: GET

> ```
> localhost:3000/api/webreview/query-bioskop?nama_bioskop=xxi
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | nVPl0L7BBU |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

### Query Params

| Param        | value |
| ------------ | ----- |
| nama_bioskop | xxi   |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Show Jadwal

Endpoint ini berfungsi untuk menampilkan jadwal-jadwal bioskop sesuai film yang diinputkan.

### Method: GET

> ```
> localhost:3000/api/webreview/show-jadwal/:movie_id/:id_bioskop?
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | nVPl0L7BBU |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

### Query Params

| Param | value |
| ----- | ----- |
|       | null  |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Now Showing

Endpoint ini akan menampilkan film yang tayang hari ini sesuai bioskop yang terdaftar di CinemaTIX

### Method: GET

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | nVPl0L7BBU |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Coming Soon

Endpoint ini akan menampilkan film yang akan segera tayang sesuai bioskop yang terdaftar di CinemaTIX

### Method: GET

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | nVPl0L7BBU |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Marketplace

## End-point: Buat Marketplace

Endpoint ini digunakan untuk registrasi akun developer marketplace. Developer marketplace bisa mengakses endpoint untuk menampilkan informasi bioskop dan memesan tiket.

### Method: POST

> ```
> undefined
> ```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Login Marketplace

Endpoint ini digunakan untuk mendapatkan API key developer marketplace untuk mengakses endpoint developer marketplace yang membutuhkan Authentication dan Authorization.

### Method: POST

> ```
> undefined
> ```

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Query Bioskop

Endpoint akan menampilkan bioskop sesuai keyword atau semua bioskop yang terdaftar di CinemaTIX jika keyword tidak disertakan.

### Method: GET

> ```
> localhost:3000/api/marketplace/detail-bioskop?nama_bioskop=xx
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 5Ca48SjQN0 |

### Query Params

| Param        | value |
| ------------ | ----- |
| nama_bioskop | xx    |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Cabang Bioskop

Endpoint ini akan menampilkan informasi cabang dari suatu bioskop beserta studionya

### Method: GET

> ```
> localhost:3000/api/marketplace/show-bioskop/:id_bioskop
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 5Ca48SjQN0 |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Show Kursi Tersedia

Endpoint ini akan menampilkan kursi yang tersedia dalam suatu jadwal.

### Method: GET

> ```
> localhost:3000/api/marketplace/show-kursi/:id_jadwal
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 5Ca48SjQN0 |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Show Jadwal Filter By Movie

Endpoint ini akan menampilkan jadwal yang menampilkan film tertentu

### Method: GET

> ```
> localhost:3000/api/marketplace/show-jadwal-by-movie/:id_film
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 5Ca48SjQN0 |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Show Jadwal On Cabang

Endpoint ini akan menampilkan seluruh jadwal yang dimiliki oleh cabang bioskop tertentu.

### Method: GET

> ```
> localhost:3000/api/marketplace/show-jadwal-by-cabang/:id_cabang
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 5Ca48SjQN0 |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Show Owned Tickets

Endpoint ini akan menampilkan tiket/history yang dimiliki marketplace. Akan mengembalikan tiga array yaitu approved, rejected, dan pending.

### Method: GET

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 5Ca48SjQN0 |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Pesan Tiket

Endpoint ini digunakan marketplace untuk memesan tiket yang tersedia.

### Method: POST

> ```
> undefined
> ```

### Headers

| Content-Type | Value      |
| ------------ | ---------- |
| x-api-key    | 5Ca48SjQN0 |

### Body formdata

| Param            | value   | Type |
| ---------------- | ------- | ---- |
| id_jadwal        | JW00003 | text |
| nomor_kursi      | B11     | text |
| bukti_pembayaran |         | file |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

# 📁 Collection: Admin

## End-point: Get Pending Tiket

Endpoint akan menampilkan pembayaran tiket yang masih menunggu konfirmasi admin. Bukti pembayaran terletak di folder uploads/tiket.

### Method: GET

> ```
> undefined
> ```

### Headers

| Content-Type | Value |
| ------------ | ----- |
| x-api-key    | admin |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Reject Tiket

Endpoint ini digunakan untuk membatalkan pembelian tiket akibat bukti pembayaran yang disertakan tidak valid. Untuk melihat tiket yang berstatus pending bisa panggil endpoint Get Pending Tiket. Bukti pembayaran terletak di folder uploads/tiket.

### Method: PUT

> ```
> localhost:3000/api/admin/reject-tiket/:id_tiket
> ```

### Headers

| Content-Type | Value |
| ------------ | ----- |
| x-api-key    | admin |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Approve Tiket

Endpoint ini digunakan untuk mengkonfirmasi pembayaran tiket. Untuk melihat tiket yang berstatus pending bisa panggil endpoint Get Pending Tiket. Bukti pembayaran terletak di folder uploads/tiket.

### Method: PUT

> ```
> localhost:3000/api/admin/acc-tiket/:id_tiket
> ```

### Headers

| Content-Type | Value |
| ------------ | ----- |
| x-api-key    | admin |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Confirm Subscription

Endpoint ini digunakan untuk mengkonfirmasi subscription milik marketplace. Bukti pembayaran akan terletak pada folder uploads/subscription.

### Method: PUT

> ```
> localhost:3000/api/admin/acc-web-review/:id_subscription
> ```

### Headers

| Content-Type | Value |
| ------------ | ----- |
| x-api-key    | admin |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Revoke Marketplace

Endpoint ini digunakan untuk menghapus hak akses akun marketplace. Akun yang direvoke tidak akan bisa memanggil endpoint marketplace manapun. Hal ini dikarenakan akun marketplace memiliki beberapa endpoint GET berisikan informasi bioskop tanpa memerlukan subscription. Untuk menghindari penyalahgunaan akses, maka akun marketplace yang tidak memiliki history transaksi bisa di revoke.

### Method: DELETE

> ```
> localhost:3000/api/admin/revoke-marketplace/:username
> ```

### Headers

| Content-Type | Value |
| ------------ | ----- |
| x-api-key    | admin |

### Body formdata

| Param | value | Type |
| ----- | ----- | ---- |

⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

---

Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
