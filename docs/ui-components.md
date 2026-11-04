# Hướng dẫn thành phần UI

Đọc tài liệu này khi tạo hoặc thay đổi giao diện người dùng trong ứng dụng.

- Luôn dùng các component Shadcn UI từ `@/components/ui` cho thành phần và điều khiển giao diện. Không tự triển khai component UI thay thế bằng HTML, CSS hoặc Tailwind.
- Nếu thiếu component cần dùng, thêm bằng `npx shadcn@latest add <component>` thay vì tự tạo component tương đương.
- Có thể tạo component nghiệp vụ để tổ chức màn hình, nhưng chỉ ghép các component Shadcn UI; không tạo primitive hoặc control UI tùy chỉnh.
- Giao diện mặc định và chủ đạo là nền tối: thẻ `<html>` trong `app/layout.tsx` luôn có class `dark`, nên các token trong `.dark` của `app/globals.css` được áp dụng. Luôn dùng theme token ngữ nghĩa (`bg-background`, `text-foreground`, …), không hard-code màu nền sáng như `bg-white`.
