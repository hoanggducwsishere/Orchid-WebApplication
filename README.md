# 🌺 FER202 - Orchid Web Application (Fullstack Lab Project)

![React](https://img.shields.io/badge/Frontend-React_19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Build_Tool-Vite_8-646CFF?style=for-the-badge&logo=vite)
![Redux](https://img.shields.io/badge/State-Redux_Toolkit-764ABC?style=for-the-badge&logo=redux)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.2.5-6DB33F?style=for-the-badge&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_15-4169E1?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Container-Docker_Compose-2496ED?style=for-the-badge&logo=docker)

Dự án **FER202 - Orchid Web Application** là một ứng dụng Fullstack hoàn chỉnh phục vụ việc quản lý, trưng bày và đánh giá các loại hoa lan (Orchids). Ứng dụng tích hợp kiến trúc **Frontend React 19 (Vite)** hiện đại kết hợp **Redux Toolkit** và **Backend Spring Boot 3** cùng cơ sở dữ liệu **PostgreSQL** chạy trên **Docker**.

---

## 📐 Cấu trúc Thư mục Dự án (Project Structure)

```text
FER202/
├── 📁 backend/                       # Nguồn mã nguồn Backend (Spring Boot & PostgreSQL)
│   ├── 📁 src/main/java/com/orchid/backend/
│   │   ├── 📁 config/                # Cấu hình CORS, Web Security, Bean App
│   │   ├── 📁 controllers/           # REST API Controllers (Orchid, Category, Auth, User)
│   │   ├── 📁 models/                # Entity JPA Models (Orchid, Category, User, Role...)
│   │   ├── 📁 payload/               # DTO Request/Response Payloads
│   │   ├── 📁 repositories/          # Spring Data JPA Repositories
│   │   ├── 📁 security/              # Cấu hình Spring Security, JWT Filters & Provider
│   │   └── 📄 BackendApplication.java # Hàm main khởi chạy Spring Boot
│   ├── 📄 docker-compose.yml         # Cấu hình container PostgreSQL (Port 5433)
│   ├── 📄 init-data.sql              # Script khởi tạo cơ sở dữ liệu & dữ liệu mẫu
│   ├── 📄 pom.xml                    # Quản lý dependencies Maven (Java 21, Spring Boot 3)
│   ├── 📄 package.json               # Node.js backend helper (nếu dùng Express server)
│   └── 📄 .env                       # Biến môi trường cho Backend
│
├── 📁 src/                           # Nguồn mã nguồn Frontend (React 19 + Vite)
│   ├── 📁 api/                       # Đóng gói các hàm gọi API (Axios Instance)
│   │   ├── 📄 categoryApi.js         # API Quản lý danh mục hoa lan
│   │   └── 📄 orchidApi.js           # API Quản lý danh sách & chi tiết hoa lan
│   │
│   ├── 📁 assets/                    # Hình ảnh, biểu tượng và tài nguyên tĩnh
│   │
│   ├── 📁 components/                # Reusable UI Components
│   │   ├── 📄 NavigationBar.jsx      # Thanh điều hướng header responsive
│   │   ├── 📄 Footer.jsx             # Chân trang thông tin liên hệ
│   │   ├── 📄 OrchidModal.jsx        # Modal thêm / sửa thông tin hoa lan
│   │   ├── 📄 CategoryModal.jsx      # Modal quản lý danh mục
│   │   ├── 📄 StarRating.jsx         # Component đánh giá sao tích hợp
│   │   └── 📄 ScrollToTop.jsx        # Tự động cuộn lên đầu trang khi chuyển Route
│   │
│   ├── 📁 pages/                     # Các trang ứng dụng (Views)
│   │   ├── 📄 Home.jsx               # Trang chủ giới thiệu & hoa lan nổi bật
│   │   ├── 📄 Natural.jsx            # Danh mục hoa lan tự nhiên / hoang dã
│   │   ├── 📄 Detail.jsx             # Trang chi tiết hoa lan & đánh giá
│   │   ├── 📄 Favorites.jsx          # Danh sách hoa lan yêu thích của người dùng
│   │   ├── 📄 Management.jsx         # Trang quản trị CRUD hoa lan & danh mục (Admin)
│   │   ├── 📄 Login.jsx              # Trang đăng nhập (Hỗ trợ Google OAuth)
│   │   ├── 📄 Register.jsx           # Trang đăng ký tài khoản mới
│   │   ├── 📄 Profile.jsx            # Trang cá nhân người dùng
│   │   ├── 📄 About.jsx              # Trang giới thiệu thông tin dự án
│   │   ├── 📄 Contact.jsx            # Trang liên hệ
│   │   └── 📄 NotFound.jsx           # Trang 404 Not Found
│   │
│   ├── 📁 redux/                     # Quản lý trạng thái tập trung (Redux Toolkit)
│   │   ├── 📄 store.js               # Khởi tạo Redux Store
│   │   ├── 📄 orchidSlice.js         # Reducer & Actions cho dữ liệu Orchid
│   │   └── 📄 categorySlice.js       # Reducer & Actions cho dữ liệu Category
│   │
│   ├── 📁 routes/                    # Quản lý tuyến đường ứng dụng
│   │   └── 📄 AppRoutes.jsx          # Định nghĩa danh sách đường dẫn với React Router v7
│   │
│   ├── 📁 styles/                    # Các tập tin tùy chỉnh giao diện (Sass / CSS)
│   ├── 📁 utils/                     # Các hàm tiện ích bổ trợ
│   ├── 📄 App.jsx                    # Component gốc ứng dụng
│   ├── 📄 App.css / index.css        # CSS toàn cục & định dạng chuẩn
│   └── 📄 main.jsx                   # Điểm khởi chạy React App
│
├── 📁 public/                        # Tài nguyên tĩnh tĩnh không qua Vite build process
├── 📄 .env                           # Biến môi trường Frontend (API URL, OAuth Client ID)
├── 📄 .env.example                   # Mẫu biến môi trường tham khảo
├── 📄 index.html                     # File HTML chính của ứng dụng
├── 📄 package.json                   # Quản lý thư viện Frontend
├── 📄 vite.config.js                 # Cấu hình Vite bundler
└── 📄 README.md                      # Tài liệu hướng dẫn dự án (File hiện tại)
```

---

## 🛠️ Công Nghệ & Thư Viện Sử Dụng (Tech Stack)

### **Frontend**
- **Core:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/) (Hỗ trợ điều hướng SPA mượt mà)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & React Redux
- **UI Framework & Styling:** [Bootstrap 5](https://getbootstrap.com/), [React Bootstrap](https://react-bootstrap.github.io/), & [Sass](https://sass-lang.com/)
- **Form & Validation:** [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Authentication:** [Google OAuth 2.0](https://github.com/MomenSherif/react-oauth) (`@react-oauth/google`)

### **Backend & Database**
- **Language & Framework:** Java 21 + [Spring Boot 3.2.5](https://spring.io/projects/spring-boot)
- **Security:** Spring Security + JSON Web Token (JWT)
- **Persistence:** Spring Data JPA + Hibernate
- **Database:** PostgreSQL 15 (Chạy qua Docker Container)
- **Containerization:** Docker Compose

---

## ⚡ Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

### 1. Yêu cầu tiên quyết (Prerequisites)
Đảm bảo máy tính của bạn đã cài đặt:
- **Node.js** (v18 trở lên) & npm
- **JDK 21** (Dành cho Spring Boot backend)
- **Docker** & **Docker Desktop** (Dành cho PostgreSQL database)

---

### 2. Khởi chạy Database (PostgreSQL via Docker)

Vào thư mục `backend` và khởi chạy container Docker:

```bash
cd backend
docker-compose up -d
```
> Database PostgreSQL sẽ chạy tại port `5433` với tên CSDL `orchid_db`.

---

### 3. Cấu hình và Chạy Backend (Spring Boot)

1. Cấu hình thông số trong file `backend/.env` hoặc `application.properties` (nếu cần):
   - Database Port: `5433`
   - Database User: `orchid_user`
   - Database Password: `orchid_password`

2. Khởi chạy ứng dụng Spring Boot:
   - Dùng IntelliJ IDEA / Eclipse: Mở thư mục `backend` và run file `BackendApplication.java`.
   - Hoặc chạy qua dòng lệnh Terminal:
     ```bash
     cd backend
     ./mvnw spring-boot:run
     ```
   > Backend API sẽ hoạt động tại địa chỉ: `http://localhost:8080`

---

### 4. Cấu hình và Chạy Frontend (React + Vite)

1. Mở cửa sổ Terminal mới ở thư mục gốc của dự án (`FER202`):

2. Cài đặt các gói phụ thuộc (Dependencies):
   ```bash
   npm install
   ```

3. Tạo file `.env` từ `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Cấu hình các tham số môi trường:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. Khởi chạy server phát triển (Development Server):
   ```bash
   npm run dev
   ```
   > Mở trình duyệt và truy cập: **`http://localhost:5173`**

---

## 📜 Các Kịch Bản Lệnh (Available Scripts)

Tại thư mục gốc dự án Frontend:

| Lệnh `npm` | Chức năng |
| :--- | :--- |
| `npm run dev` | Khởi chạy Vite Server ở chế độ Development (HMR) |
| `npm run build` | Biên dịch dự án ra thư mục `dist` để chuẩn bị Deploy |
| `npm run lint` | Chạy ESLint để kiểm tra chất lượng & quy chuẩn mã nguồn |
| `npm run preview` | Xem trước bản build sản phẩm ở môi trường Local |

---

## 🎯 Các Tính Năng Chính (Key Features)

1. **Trang chủ & Danh mục Hoa lan (Home & Catalog):**
   - Hiển thị danh sách hoa lan phong phú, hỗ trợ tìm kiếm, lọc theo tự nhiên / lai tạo.
   - Xem chi tiết từng loại hoa lan (Detail Page) kèm hệ thống đánh giá sao (Rating & Feedback).

2. **Yêu thích (Favorites):**
   - Người dùng có thể đánh dấu lưu lại các giống hoa lan yêu thích cá nhân.

3. **Trang Quản trị (Admin Management):**
   - Quản lý CRUD (Thêm, Sửa, Xóa) danh sách hoa lan và các danh mục hoa lan thông qua Modal trực quan.

4. **Xác thực Người dùng (Authentication):**
   - Đăng ký, đăng nhập tài khoản thường qua JWT.
   - Đăng nhập nhanh thông qua **Google OAuth 2.0**.
