# Hướng dẫn thành phần UI

Đọc tài liệu này khi tạo hoặc thay đổi giao diện người dùng trong ứng dụng.

- Luôn dùng các component Shadcn UI từ `@/components/ui` cho thành phần và điều khiển giao diện. Không tự triển khai component UI thay thế bằng HTML, CSS hoặc Tailwind.
- Nếu thiếu component cần dùng, thêm bằng `npx shadcn@latest add <component>` thay vì tự tạo component tương đương.
- Có thể tạo component nghiệp vụ để tổ chức màn hình, nhưng chỉ ghép các component Shadcn UI; không tạo primitive hoặc control UI tùy chỉnh.