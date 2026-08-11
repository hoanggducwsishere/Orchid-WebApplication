# 🌺 Orchid Haven

![React](https://img.shields.io/badge/Frontend-React_19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Build-Vite_8-646CFF?style=for-the-badge&logo=vite)
![Redux](https://img.shields.io/badge/State-Redux_Toolkit-764ABC?style=for-the-badge&logo=redux)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.2.5-6DB33F?style=for-the-badge&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=for-the-badge&logo=docker)

Ứng dụng fullstack quản lý và trưng bày bộ sưu tập hoa lan: duyệt danh mục, xem chi tiết, đánh giá sao, lưu yêu thích, và trang quản trị CRUD dành cho admin. Dự án môn **FER202**.

Điểm đáng chú ý về mặt kỹ thuật: xác thực hai đường (JWT nội bộ + Google OAuth 2.0 có xác minh phía server), tách bạch cấu hình theo môi trường, và triển khai thật lên Vercel + Render.

| Thành phần | Địa chỉ |
| :--- | :--- |
| Frontend (Vercel) | https://orchid-haven-eight.vercel.app |
| Backend API (Render) | https://orchid-backend-4kyb.onrender.com |

> Backend chạy gói Free của Render nên **ngủ sau ~15 phút** không có request. Lần gọi đầu tiên có thể mất 30–60 giây để đánh thức. Đây là hành vi bình thường, không phải lỗi.

---

## 📑 Mục lục

- [Kiến trúc tổng quan](#-kiến-trúc-tổng-quan)
- [Bắt đầu nhanh](#-bắt-đầu-nhanh)
- [Biến môi trường](#-biến-môi-trường)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Tài liệu API](#-tài-liệu-api)
- [Cơ chế xác thực](#-cơ-chế-xác-thực)
- [Lệnh thường dùng](#-lệnh-thường-dùng)
- [Triển khai](#-triển-khai)
- [Xử lý sự cố](#-xử-lý-sự-cố)
- [Ghi chú kỹ thuật](#-ghi-chú-kỹ-thuật)

---

## 🏗 Kiến trúc tổng quan

```mermaid
flowchart LR
    U["Người dùng"]

    subgraph V["Vercel"]
        FE["React 19 + Vite 8<br/>SPA tĩnh"]
    end

    subgraph R["Render"]
        BE["Spring Boot 3.2.5<br/>REST API"]
        DB[("PostgreSQL")]
    end

    G["Google Identity<br/>Services"]

    U --> FE
    FE -->|"REST + Bearer JWT"| BE
    BE -->|"JDBC / Hibernate"| DB
    FE -->|"1. lấy access token"| G
    BE -->|"2. xác minh token"| G
```

Frontend là SPA tĩnh, không có server riêng — mọi logic nghiệp vụ và truy cập dữ liệu đều đi qua REST API của backend. Toàn bộ endpoint ngoài `/api/auth/**` đều yêu cầu JWT hợp lệ.

**Luồng dữ liệu một request điển hình:**

```
Component  →  Redux Thunk  →  src/api/*.js (axios + interceptor gắn JWT)
                                      ↓
        Controller  →  Repository (Spring Data JPA)  →  PostgreSQL
```

---

## ⚡ Bắt đầu nhanh

### Yêu cầu

| Công cụ | Phiên bản |
| :--- | :--- |
| Node.js | 20.19+ hoặc 22.12+ *(bắt buộc, Vite 8 yêu cầu)* |
| JDK | 21 |
| Docker Desktop | bản mới nhất |

### 1. Khởi động database

```bash
cd backend && docker-compose up -d
```

PostgreSQL chạy ở cổng **5433** (không phải 5432, để tránh đụng Postgres cài sẵn trên máy).

### 2. Cấu hình và chạy backend

```bash
cd backend && cp .env.example .env
```

Mở `backend/.env` và điền `JWT_SECRET` — **bắt buộc, không có giá trị mặc định**:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Sau đó chạy `BackendApplication.java` từ IntelliJ IDEA (Run ▶). Backend lắng nghe ở `http://localhost:8080`.

> Dự án **không kèm Maven wrapper** (`mvnw`). Muốn chạy bằng dòng lệnh thì cần cài Maven riêng, rồi `mvn spring-boot:run`.

### 3. Cấu hình và chạy frontend

```bash
cp .env.example .env
npm install
npm run dev
```

Mở **http://localhost:5173**. Đăng nhập bằng tài khoản admin được seed tự động:

```
admin@orchid.vn / admin123
```

> Đổi mật khẩu này trước khi triển khai thật — xem [Biến môi trường](#-biến-môi-trường).

---

## 🔐 Biến môi trường

### Frontend — `.env` ở thư mục gốc

| Biến | Bắt buộc | Mô tả |
| :--- | :---: | :--- |
| `VITE_API_BASE_URL` | ✅ | URL gốc của backend, **phải kết thúc bằng `/api`**. Không khai thì fallback về `http://localhost:8080/api` |
| `VITE_GOOGLE_CLIENT_ID` | ⬜ | OAuth Client ID. Không khai thì nút "Sign in with Google" tự ẩn, phần còn lại vẫn chạy |
| `VITE_ADMIN_EMAIL` | ⬜ | Email liên hệ hiển thị ở trang About |
| `VITE_WEB3FORMS_ACCESS_KEY` | ⬜ | Khoá gửi form ở trang Contact |
| `VITE_CLOUDINARY_CLOUD_NAME` | ⬜ | Upload ảnh trong modal quản trị |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | ⬜ | Upload preset tương ứng |

> ⚠️ Vite **nhúng cứng** biến `VITE_*` vào bundle lúc build, không đọc lúc chạy. Đổi biến xong **bắt buộc build lại**, nếu không giá trị cũ vẫn nằm nguyên trong bundle.

### Backend — `backend/.env`

Spring Boot nạp file này qua `spring.config.import` khai trong `application.properties`. Khi triển khai thì không dùng file `.env`, hãy khai trực tiếp trong phần Environment Variables của nền tảng.

| Biến | Bắt buộc | Mặc định | Mô tả |
| :--- | :---: | :--- | :--- |
| `JWT_SECRET` | ✅ | *(không có)* | Khoá ký JWT, tối thiểu 32 ký tự. **Thiếu là ứng dụng không khởi động** |
| `SPRING_DATASOURCE_URL` | ⬜ | `jdbc:postgresql://localhost:5433/orchid_db` | Chuỗi JDBC. Khi deploy phải khai biến này |
| `SPRING_DATASOURCE_USERNAME` | ⬜ | `orchid_user` | |
| `SPRING_DATASOURCE_PASSWORD` | ⬜ | `orchid_password` | |
| `JWT_EXPIRATION_MS` | ⬜ | `86400000` | Hạn dùng token (24 giờ) |
| `ADMIN_EMAIL` | ⬜ | `admin@orchid.vn` | Email tài khoản admin được seed |
| `ADMIN_PASSWORD` | ⬜ | `admin123` | Mật khẩu admin seed |
| `PORT` | ⬜ | `8080` | Render tự cấp biến này |

**`JWT_SECRET` cố tình không có giá trị mặc định.** Một secret nằm sẵn trong mã nguồn đồng nghĩa với việc bất kỳ ai đọc được repo cũng tự ký được token admin hợp lệ. Thà để ứng dụng chết ngay lúc khởi động còn hơn âm thầm chạy bằng secret mà cả thế giới đều biết.

**`ADMIN_PASSWORD` chỉ có tác dụng khi tài khoản chưa tồn tại.** `DataInitializer` chỉ seed khi không tìm thấy email admin trong database. Database đã có sẵn tài khoản thì đổi biến này không có tác dụng gì — phải xoá bản ghi cũ rồi khởi động lại.

---

## 📂 Cấu trúc thư mục

```text
FER202/
├── src/                              # Frontend — React 19 + Vite 8
│   ├── api/                          # Lớp gọi HTTP, mỗi file một axios instance
│   │   ├── orchidApi.js              # CRUD hoa lan + interceptor gắn JWT vào header
│   │   └── categoryApi.js            # CRUD danh mục
│   │
│   ├── components/                   # Component tái sử dụng
│   │   ├── NavigationBar.jsx         # Thanh điều hướng, chuyển sáng/tối
│   │   ├── Footer.jsx
│   │   ├── OrchidModal.jsx           # Form thêm/sửa hoa lan (Formik + Yup + Cloudinary)
│   │   ├── CategoryModal.jsx         # Form thêm/sửa danh mục
│   │   ├── StarRating.jsx            # Hiển thị đánh giá sao
│   │   ├── ScrollToTop.jsx           # Cuộn lên đầu trang khi đổi route
│   │   ├── GoogleLoginButton.jsx     # Cô lập hook useGoogleLogin (xem Cơ chế xác thực)
│   │   └── ErrorBoundary.jsx         # Chặn lỗi runtime, tránh trang trắng
│   │
│   ├── pages/                        # Mỗi file một màn hình
│   │   ├── Home.jsx                  # Danh sách + tìm kiếm + lọc theo danh mục
│   │   ├── Detail.jsx                # Chi tiết một loài
│   │   ├── Natural.jsx               # Lọc riêng nhóm hoa lan tự nhiên
│   │   ├── Favorites.jsx             # Yêu thích, lưu ở localStorage
│   │   ├── Management.jsx            # Trang quản trị CRUD (chỉ admin)
│   │   ├── Profile.jsx
│   │   ├── Login.jsx  Register.jsx   # Xác thực
│   │   ├── About.jsx  Contact.jsx
│   │   └── NotFound.jsx              # 404
│   │
│   ├── redux/                        # Redux Toolkit
│   │   ├── store.js                  # Cấu hình store
│   │   ├── orchidSlice.js            # State + async thunk cho hoa lan
│   │   └── categorySlice.js          # State + async thunk cho danh mục
│   │
│   ├── config/googleAuth.js          # Nguồn duy nhất quyết định bật/tắt Google login
│   ├── routes/AppRoutes.jsx          # Khai báo route + ProtectedRoute
│   ├── utils/imageHelper.js          # Ánh xạ tên file ảnh sang URL sau khi Vite băm tên
│   ├── assets/hooks/useTheme.js      # Hook chế độ sáng/tối, ghi nhớ ở localStorage
│   ├── assets/                       # Ảnh tĩnh
│   ├── styles/app.scss               # Biến Sass + theme
│   ├── App.jsx                       # Khung layout gốc
│   └── main.jsx                      # Điểm khởi chạy, dựng cây Provider
│
├── backend/                          # Backend — Spring Boot 3.2.5 + Java 21
│   ├── src/main/java/com/orchid/backend/
│   │   ├── controllers/              # Tầng REST
│   │   │   ├── AuthController.java   # /login, /register, /google
│   │   │   ├── OrchidController.java # CRUD hoa lan
│   │   │   └── CategoryController.java
│   │   ├── models/                   # Entity JPA — Orchid, Category, User, Feedback
│   │   ├── payload/                  # DTO vào/ra, tách khỏi entity
│   │   ├── repositories/             # Spring Data JPA
│   │   ├── security/
│   │   │   ├── WebSecurityConfig.java     # Filter chain, CORS, phân quyền route
│   │   │   ├── JwtUtils.java              # Sinh và kiểm tra JWT
│   │   │   ├── AuthTokenFilter.java       # Đọc header Authorization mỗi request
│   │   │   ├── AuthEntryPointJwt.java     # Trả 401 khi thiếu/sai token
│   │   │   ├── GoogleTokenVerifier.java   # Xác minh access token với Google
│   │   │   ├── UserDetailsImpl.java
│   │   │   └── UserDetailsServiceImpl.java
│   │   ├── config/DataInitializer.java    # Seed admin + danh mục + dữ liệu mẫu
│   │   └── BackendApplication.java        # Hàm main
│   │
│   ├── src/main/resources/application.properties
│   ├── Dockerfile                    # Multi-stage: Maven build → JRE 21 alpine
│   ├── docker-compose.yml            # PostgreSQL cho môi trường local (cổng 5433)
│   ├── init-data.sql                 # Script SQL khởi tạo tuỳ chọn
│   └── pom.xml
│
├── public/                           # Tài nguyên copy nguyên trạng, không qua bundler
├── vercel.json                       # Rewrite mọi đường dẫn về index.html (SPA routing)
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🔌 Tài liệu API

Base URL: `http://localhost:8080/api` (local) — `https://orchid-backend-4kyb.onrender.com/api` (production)

### Xác thực — `/api/auth` *(công khai)*

| Method | Endpoint | Body | Trả về |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | `{ email, password }` | `JwtResponse` |
| `POST` | `/auth/register` | `{ name, email, password }` | `{ message }` |
| `POST` | `/auth/google` | `{ accessToken }` | `JwtResponse` |

**`JwtResponse`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "System Admin",
  "email": "admin@orchid.vn",
  "isAdmin": true
}
```

### Hoa lan — `/api/orchids` *(cần JWT)*

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/orchids` | Danh sách toàn bộ |
| `GET` | `/orchids/{id}` | Chi tiết một bản ghi |
| `POST` | `/orchids` | Tạo mới |
| `PUT` | `/orchids/{id}` | Cập nhật |
| `DELETE` | `/orchids/{id}` | Xoá |

### Danh mục — `/api/categories` *(cần JWT)*

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/categories` | Danh sách |
| `POST` | `/categories` | Tạo mới |
| `PUT` | `/categories/{id}` | Cập nhật |
| `DELETE` | `/categories/{id}` | Xoá |

### Mã lỗi

| Mã | Ý nghĩa |
| :--- | :--- |
| `400` | Body sai định dạng hoặc thiếu trường bắt buộc |
| `401` | Thiếu JWT, JWT sai chữ ký, hoặc đã hết hạn |
| `404` | Không tìm thấy tài nguyên |

**Ví dụ gọi thử:**

```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@orchid.vn","password":"admin123"}' \
  | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

curl http://localhost:8080/api/orchids -H "Authorization: Bearer $TOKEN"
```

---

## 🔑 Cơ chế xác thực

### Đăng nhập thường

```
Login.jsx  →  POST /api/auth/login  →  AuthenticationManager xác thực
           →  JwtUtils sinh JWT (HS256)  →  lưu vào localStorage['user']
```

Từ đó mọi request đi qua `src/api/*.js` được interceptor tự gắn `Authorization: Bearer <token>`. Phía backend, `AuthTokenFilter` đọc header này ở mỗi request và nạp `SecurityContext`.

### Đăng nhập Google

```
1. GoogleLoginButton  →  Google Identity Services  →  nhận access_token
2. POST /api/auth/google { accessToken }
3. GoogleTokenVerifier  →  gọi https://www.googleapis.com/oauth2/v3/userinfo
4. Google trả profile  →  tìm user theo email, chưa có thì tạo mới
5. Backend sinh JWT của chính nó  →  frontend lưu JWT này
```

Ba điểm quan trọng trong thiết kế này:

**Frontend lưu JWT của backend, không lưu token của Google.** Access token của Google là chuỗi mờ đục dạng `ya29.…`, không phải JWT, nên `JwtUtils` không thể đọc được. Lưu nhầm là mọi request đều trả 401 kèm lỗi `JWT strings must contain exactly 2 period characters`.

**Backend tự xác minh token với Google, không tin lời frontend.** Nếu chỉ nhận email do client gửi lên thì bất kỳ ai cũng có thể mạo danh bất kỳ tài khoản nào.

**Quyền admin do backend quyết định**, bằng cách đối chiếu với `ADMIN_EMAIL`. Để frontend tự so email rồi tự gán `isAdmin` chẳng khác nào cho client tự phong quyền cho mình.

### Phân quyền

`WebSecurityConfig` áp dụng: `/api/auth/**` công khai, `OPTIONS` công khai để CORS preflight đi qua, **mọi đường dẫn còn lại yêu cầu xác thực**. Ở phía frontend, `ProtectedRoute` trong `AppRoutes.jsx` chặn trước ở tầng giao diện, còn trang `/management` kiểm tra thêm cờ admin.

---

## 📜 Lệnh thường dùng

| Lệnh | Chức năng |
| :--- | :--- |
| `npm run dev` | Vite dev server kèm HMR, cổng 5173 |
| `npm run build` | Build production ra thư mục `dist/` |
| `npm run preview` | Chạy thử bản build ở local — **dùng cái này để tái hiện lỗi chỉ xảy ra trên production** |
| `npm run lint` | Kiểm tra ESLint |
| `docker-compose up -d` | Bật PostgreSQL *(chạy trong thư mục `backend/`)* |
| `docker-compose down` | Tắt database, giữ nguyên dữ liệu |

---

## 🚀 Triển khai

### Backend → Render

| Cấu hình | Giá trị |
| :--- | :--- |
| Loại service | Web Service |
| Language | **Docker** *(không phải Node — Render hay đoán nhầm vì thấy `package.json` ở thư mục gốc)* |
| Root Directory | `backend` |
| Region | **Phải trùng region với database** |

Khai các biến `SPRING_DATASOURCE_*`, `JWT_SECRET`, `ADMIN_PASSWORD` trong phần Environment.

Render đưa chuỗi kết nối dạng `postgresql://user:pass@host/db`, nhưng JDBC **không nhận** định dạng đó. Phải chuyển thành:

```
jdbc:postgresql://host/db
```

Thêm tiền tố `jdbc:`, và cắt bỏ đoạn `user:pass@` ra khai riêng ở hai biến username/password.

### Frontend → Vercel

`vercel.json` đã cấu hình sẵn rewrite để React Router hoạt động khi người dùng F5 ở một route bất kỳ. Chỉ cần khai `VITE_API_BASE_URL` và `VITE_GOOGLE_CLIENT_ID` với scope **Production**, rồi Redeploy và **bỏ tick "Use existing Build Cache"** — biến `VITE_*` được nhúng lúc build, dùng lại cache là dùng lại giá trị cũ.

### Google Cloud Console

Thêm domain production vào **Authorized JavaScript origins** của đúng OAuth Client đang dùng:

```
https://orchid-haven-eight.vercel.app
```

Không có dấu `/` ở cuối. Đây là mục *JavaScript origins*, không phải *redirect URIs* — luồng `useGoogleLogin` chỉ kiểm tra origin.

---

## 🔧 Xử lý sự cố

Bảng dưới đây là các lỗi đã thực sự gặp trong quá trình phát triển dự án này.

| Triệu chứng | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| Trang trắng hoàn toàn, console báo `Missing required parameter client_id` | `VITE_GOOGLE_CLIENT_ID` rỗng. Hook `useGoogleLogin` ném lỗi bên trong `useEffect`, React gỡ toàn bộ cây component | Khai biến, hoặc bỏ trống để nút Google tự ẩn |
| `UnknownHostException: dpg-xxxx-a` khi chạy ở máy | Cấu hình đang trỏ vào hostname nội bộ của Render, chỉ phân giải được bên trong mạng Render | Dùng giá trị mặc định `localhost:5433` cho local |
| `Could not resolve placeholder 'JWT_SECRET'` | Chưa khai `JWT_SECRET` | Điền vào `backend/.env`, hoặc khai ở Environment của nền tảng deploy |
| 401 kèm `JWT strings must contain exactly 2 period characters` | localStorage đang giữ access token của Google thay vì JWT | `localStorage.removeItem('user')` rồi đăng nhập lại |
| Ảnh hỏng, thẻ `img` có `src="[object Module]"` | Vite 8 đã gỡ tuỳ chọn `as: 'url'` của `import.meta.glob` | Dùng `{ eager: true, query: '?url', import: 'default' }` |
| `Driver claims to not accept jdbcUrl` | Chuỗi kết nối thiếu tiền tố `jdbc:` hoặc còn `user:pass@` | Xem lại phần [Triển khai](#-triển-khai) |
| Production gọi vào `localhost:8080`, trình duyệt chặn mixed content | `VITE_API_BASE_URL` chưa được khai hoặc sai tên | Khai đúng tên biến, scope Production, rồi build lại không dùng cache |
| Google báo `origin_mismatch` | Domain chưa được thêm vào đúng OAuth Client đang chạy | Đối chiếu Client ID trong bundle với Client ID trên Google Console |
| Request đầu tiên lên production mất gần một phút | Render Free ngủ sau 15 phút không hoạt động | Bình thường. Muốn hết thì nâng gói trả phí |

---

## 📝 Ghi chú kỹ thuật

**Vì sao `useGoogleLogin` bị tách riêng ra `GoogleLoginButton.jsx`.** Hook này ném lỗi đồng bộ ngay trong `useEffect` khi `client_id` rỗng. Lỗi phát sinh trong effect mà không có error boundary sẽ khiến React tháo bỏ toàn bộ root tree — người dùng nhận về một trang trắng tinh, không thông báo gì. Tách ra thành component riêng cho phép chỉ render nó khi thực sự có client ID, để một tính năng phụ không kéo sập cả ứng dụng. `ErrorBoundary` ở `main.jsx` là lớp phòng vệ thứ hai cho các lỗi tương tự.

**Cổng 5433 thay vì 5432.** Tránh xung đột với PostgreSQL có thể đã cài sẵn trên máy.

**`ddl-auto=update`.** Hibernate tự tạo và cập nhật schema. Tiện cho môi trường học tập, nhưng với hệ thống thật nên dùng Flyway hoặc Liquibase để kiểm soát phiên bản schema.

### Hạn chế đã biết

- **CORS đang mở cho mọi origin.** `WebSecurityConfig` dùng `setAllowedOriginPatterns("*")`. Chấp nhận được cho đồ án, nhưng hệ thống thật cần giới hạn danh sách domain cụ thể.
- **Hai property không được đọc ở đâu cả**: `app.seed.demo-data` và `app.cors.allowed-origins` khai trong `application.properties` nhưng không có mã nguồn nào sử dụng. Đặt biến môi trường tương ứng sẽ không có tác dụng gì.
- **`backend/package.json` là tàn dư** của một bản thử nghiệm Express/Mongoose trước đó. Backend hiện tại thuần Spring Boot, file này không tham gia vào quá trình build.
- **Entity `Feedback` chưa có repository lẫn controller.** Hibernate vẫn tạo bảng nhưng chưa có API nào thao tác với nó.
- **Chưa có test tự động** ở cả frontend lẫn backend.
