# Hướng dẫn xác thực Clerk

Đọc tài liệu này khi thay đổi xác thực, phiên đăng nhập, giao diện đăng nhập/đăng ký, tuyến được bảo vệ hoặc chuyển hướng liên quan đến xác thực.

- Clerk là nhà cung cấp xác thực và định danh duy nhất. Không thêm thư viện xác thực khác, luồng mật khẩu/phiên tùy chỉnh hoặc nguồn định danh thay thế. Mọi phương thức đăng nhập, kể cả đăng nhập mạng xã hội, phải được cấu hình qua Clerk.
- `/dashboard` là tuyến được bảo vệ. Kiểm tra xác thực ở phía server tại page hoặc layout; đồng thời kiểm tra quyền trong từng Server Action, Route Handler hoặc ranh giới truy cập dữ liệu có xử lý dữ liệu được bảo vệ. Không chỉ dựa vào `proxy.ts` hay UI phía client.
- Người dùng chưa đăng nhập có thể truy cập `/`. Nếu người dùng đã đăng nhập truy cập `/`, chuyển hướng họ đến `/dashboard`.
- Mọi lối vào đăng nhập và đăng ký, kể cả truy cập trực tiếp `/sign-in` hoặc `/sign-up`, phải mở giao diện modal của Clerk. Dùng API modal được Clerk hỗ trợ, chẳng hạn `SignInButton` và `SignUpButton` với `mode="modal"`; không hiển thị biểu mẫu xác thực toàn trang.
- Dùng API server và client của Clerk đúng ngữ cảnh. Giữ `proxy.ts` tập trung vào xử lý request Clerk; đây không phải ranh giới phân quyền duy nhất.
- Không đưa `CLERK_SECRET_KEY` hoặc biến môi trường không có tiền tố `NEXT_PUBLIC_` vào code phía client.
