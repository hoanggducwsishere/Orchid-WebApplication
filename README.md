# 🌺 Orchid Haven

Ứng dụng web quản lý bộ sưu tập hoa lan: xem danh sách, tìm kiếm, đánh giá sao, lưu yêu thích và trang quản trị thêm/sửa/xoá dành cho admin.

Dự án môn **FER202**.

---

## 🧩 Công nghệ

| Phần | Dùng gì |
| :--- | :--- |
| Frontend | React 19, Vite 8, Redux Toolkit, React Router 7, Bootstrap 5 |
| Backend | Java 21, Spring Boot 3.2.5, Spring Security + JWT |
| Database | PostgreSQL (chạy bằng Docker) |

---

## 🏗 Hệ thống hoạt động thế nào

Hệ thống gồm **3 tầng tách rời**, mỗi tầng chạy độc lập ở một cổng riêng:

```text
   ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
   │    FRONTEND      │  gửi    │     BACKEND      │  truy   │     DATABASE     │
   │                  │  request│                  │  vấn    │                  │
   │  React + Vite    ├────────►│  Spring Boot     ├────────►│   PostgreSQL     │
   │  cổng 5173       │◄────────┤  cổng 8080       │◄────────┤   cổng 5433      │
   │                  │  JSON   │                  │  dữ liệu│                  │
   └──────────────────┘         └──────────────────┘         └──────────────────┘
         Giao diện                Xử lý + phân quyền              Lưu dữ liệu
```

| Tầng | Làm gì | Không làm gì |
| :--- | :--- | :--- |
| **Frontend** | Vẽ giao diện, nhận thao tác của người dùng | Không đụng thẳng vào database |
| **Backend** | Kiểm tra đăng nhập, xử lý logic, quyết định ai được làm gì | Không lo giao diện |
| **Database** | Lưu dữ liệu | Không chứa logic |

Điểm mấu chốt: **frontend không bao giờ nói chuyện trực tiếp với database.** Mọi thứ phải đi qua backend, vì đó là nơi duy nhất kiểm tra quyền. Nếu frontend nối thẳng vào database thì ai cũng sửa được dữ liệu của người khác.

### Đăng nhập hoạt động ra sao

Hình dung JWT như một **tấm thẻ ra vào**:

```text
   1. Đăng nhập          2. Backend phát thẻ        3. Mọi request sau
      ──────────            ──────────────             đều phải đeo thẻ

   email + mật khẩu  ──►  kiểm tra đúng/sai  ──►  cấp JWT  ──►  frontend lưu lại
                                                                      │
                                                                      ▼
                                          backend kiểm thẻ  ◄──  đính vào request
                                                  │
                                    ┌─────────────┴─────────────┐
                                    ▼                           ▼
                              thẻ hợp lệ                  không có thẻ
                              → trả dữ liệu               → lỗi 401
```

Ứng dụng hỗ trợ hai cách lấy thẻ: đăng nhập bằng **email + mật khẩu**, hoặc bằng **tài khoản Google**. Cả hai đều kết thúc ở cùng một chỗ — backend cấp JWT, frontend lưu lại và dùng cho các request tiếp theo.

---

## 📂 Cấu trúc thư mục

```text
FER202/
│
├── src/                    # 🎨 FRONTEND (React)
│   ├── api/                # Gọi API tới backend (axios)
│   ├── components/         # Các mảnh giao diện dùng lại nhiều nơi
│   │                       #   NavigationBar, Footer, OrchidModal, StarRating...
│   ├── pages/              # Mỗi file là một trang
│   │                       #   Home, Detail, Login, Register, Management...
│   ├── redux/              # Kho dữ liệu chung của toàn app
│   ├── routes/             # Khai báo đường dẫn nào hiện trang nào
│   ├── config/             # Cấu hình (Google login)
│   ├── utils/              # Hàm tiện ích
│   ├── styles/             # File SCSS
│   ├── assets/             # Ảnh
│   ├── App.jsx             # Khung layout chung
│   └── main.jsx            # Điểm khởi chạy app
│
├── backend/                # ⚙️ BACKEND (Spring Boot)
│   ├── src/main/java/com/orchid/backend/
│   │   ├── controllers/    # Nhận request, trả response
│   │   ├── models/         # Bảng trong database
│   │   │                   #   Orchid, Category, User, Feedback
│   │   ├── repositories/   # Câu lệnh truy vấn database
│   │   ├── security/       # Đăng nhập, JWT, phân quyền
│   │   ├── payload/        # Định dạng dữ liệu vào/ra
│   │   └── config/         # Tạo sẵn dữ liệu mẫu lúc khởi động
│   ├── docker-compose.yml  # Cấu hình container PostgreSQL
│   ├── Dockerfile          # Đóng gói backend để deploy
│   └── pom.xml             # Khai báo thư viện Java
│
├── public/                 # File tĩnh
├── index.html
├── package.json            # Khai báo thư viện frontend
└── vite.config.js
```

### Một request đi qua đâu

Ví dụ khi mở trang chủ để lấy danh sách hoa lan:

```
Home.jsx  →  redux/orchidSlice.js  →  api/orchidApi.js
                                            ↓  (HTTP)
        OrchidController  →  OrchidRepository  →  PostgreSQL
```

---

## 🚀 Chạy dự án

Cần cài sẵn: **Node.js 20+**, **JDK 21**, **Docker Desktop**.

**Bước 1 — Bật database**

```bash
cd backend && docker-compose up -d
```

**Bước 2 — Chạy backend**

Tạo file `backend/.env` từ `backend/.env.example`, điền `JWT_SECRET` (chuỗi ngẫu nhiên bất kỳ, tối thiểu 32 ký tự).

Rồi mở IntelliJ IDEA, chạy file `BackendApplication.java`.

**Bước 3 — Chạy frontend**

```bash
cp .env.example .env
npm install
npm run dev
```

Mở trình duyệt vào **http://localhost:5173** và đăng nhập:

```
admin@orchid.vn / admin123
```

---

## 📜 Lệnh hay dùng

| Lệnh | Làm gì |
| :--- | :--- |
| `npm run dev` | Chạy frontend ở chế độ phát triển |
| `npm run build` | Đóng gói frontend để deploy |
| `npm run preview` | Xem thử bản đã đóng gói |
| `docker-compose up -d` | Bật database *(trong thư mục `backend/`)* |
| `docker-compose down` | Tắt database |

---

## 🌐 Bản đã deploy

| Phần | Địa chỉ |
| :--- | :--- |
| Frontend | https://orchid-haven-eight.vercel.app |
| Backend | https://orchid-backend-4kyb.onrender.com |

> Backend dùng gói miễn phí nên tự ngủ khi không ai dùng. Lần truy cập đầu có thể chờ khoảng 1 phút.
