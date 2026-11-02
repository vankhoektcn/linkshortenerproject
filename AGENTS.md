# Dự án Link Shortener — Hướng dẫn lập trình cho LLM

Đây là tệp điểm vào dành cho các agent LLM làm việc trong repository này. Tệp nêu các tiêu chuẩn lập trình chung của dự án. Các hướng dẫn chi tiết theo từng chủ đề được lưu riêng trong thư mục [`/docs`](./docs).

## ⚠️ Đọc tài liệu trong /docs trước

**Trước khi viết hoặc sửa bất kỳ đoạn code nào, hãy đọc (các) hướng dẫn liên quan trong `/docs`.** Nếu đã có hướng dẫn cho phần bạn sắp chỉnh sửa (ví dụ: xác thực, cơ sở dữ liệu, UI), hãy tuân theo hướng dẫn đó thay vì kiến thức chung hoặc suy đoán. Nếu hướng dẫn mâu thuẫn với tệp này, hướng dẫn của chủ đề cụ thể đó được ưu tiên. Khi thêm hướng dẫn mới, hãy thêm vào bảng mục lục bên dưới.

### Mục lục `/docs`

| Tệp | Đọc khi bạn… |
| --- | ------------ |
| [docs/clerk-auth.md](./docs/clerk-auth.md) | thay đổi xác thực Clerk, đăng nhập/đăng ký, phiên, tuyến được bảo vệ hoặc chuyển hướng xác thực |
| [docs/ui-components.md](./docs/ui-components.md) | tạo hoặc thay đổi thành phần giao diện người dùng (UI) |


Khi thêm hướng dẫn mới, thêm một dòng vào bảng này (`docs/<chu-de>.md` — mô tả "đọc khi bạn…").

## Công nghệ sử dụng

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (`strict`)
- **Xác thực:** Clerk (`@clerk/nextjs`, `@clerk/ui`)
- **Cơ sở dữ liệu:** Neon Postgres (`@neondatabase/serverless`) với Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **UI:** Tailwind CSS v4, shadcn/ui (style `base-nova`, xây dựng trên `@base-ui/react`), icon `lucide-react`
- **Lint:** ESLint 9 với `eslint-config-next`

## Lệnh thường dùng

| Tác vụ | Lệnh |
| ------ | ---- |
| Chạy dev server | `npm run dev` |
| Build production | `npm run build` |
| Lint | `npm run lint` |
| Kiểm tra kiểu | `npx tsc --noEmit` |
| Tạo / áp dụng migration DB | `npx drizzle-kit generate` / `npx drizzle-kit migrate` |

Sau khi thay đổi, hãy chạy lint và kiểm tra kiểu, và sửa hết lỗi trước khi hoàn tất.

## Cấu trúc dự án

```
app/            Route, layout, page (App Router)
components/     Component React dùng chung
components/ui/  Thành phần shadcn/ui (được sinh tự động — xem phần UI)
db/             Drizzle client (index.ts) và schema (schema.ts)
lib/            Hàm tiện ích dùng chung (ví dụ cn trong utils.ts)
docs/           Các tệp hướng dẫn chi tiết cho LLM
proxy.ts        Clerk middleware (quy ước "proxy" của Next.js 16)
drizzle/        Migration được sinh ra (không sửa tay)
```

Dùng path alias `@/*` (trỏ tới thư mục gốc repo) cho mọi import không tương đối, ví dụ `@/components/ui/button`, `@/lib/utils`, `@/db`.

## Tiêu chuẩn lập trình chung

- Chỉ viết TypeScript. Không dùng `any`; ưu tiên `unknown` kèm thu hẹp kiểu. Không dùng `@ts-ignore`/`@ts-expect-error` nếu không có chú thích giải thích.
- Ưu tiên named export. Chỉ dùng default export khi Next.js hoặc công cụ yêu cầu (`page.tsx`, `layout.tsx`, `proxy.ts`, tệp cấu hình).
- Mặc định dùng `const`, ưu tiên early return thay vì lồng sâu, và viết hàm nhỏ, một nhiệm vụ.
- Đặt tên: `kebab-case` cho tệp và thư mục (`link-form.tsx`); `PascalCase` cho component và type; `camelCase` cho biến và hàm.
- Chỉ comment những chỗ có ý đồ không hiển nhiên; không diễn giải lại code.
- Không để code chết, import thừa hoặc `console.log` debug trong code được commit.
- Thay đổi gọn, đúng phạm vi: không format lại hay refactor code không liên quan.

## Quy tắc Next.js

- Chỉ dùng **App Router**. Không thêm thư mục `pages/`.
- Component mặc định là **Server Component**. Chỉ thêm `"use client"` khi cần state, effect, event handler hoặc API của trình duyệt, và giữ client component nhỏ và nằm sâu nhất có thể trong cây.
- Đọc và ghi dữ liệu ở phía server: đọc trong Server Component, ghi qua **Server Action** (`"use server"`) hoặc route handler. Không gọi cơ sở dữ liệu từ client component.
- Validate mọi dữ liệu đầu vào từ bên ngoài (form data, search params, request body) ở phía server trước khi sử dụng.
- Việc chặn/xử lý request nằm trong `proxy.ts` (không phải `middleware.ts`). Chỉ giữ các nội dung liên quan đến xác thực/định tuyến.
- Dự án bật `cacheComponents: true`: component đọc dữ liệu runtime (`auth()`, `cookies()`, DB không cache) phải nằm trong `<Suspense>`; chi tiết trong [docs/nextjs.md](./docs/nextjs.md).
- Dùng `next/image`, `next/link`, `next/font` thay vì `<img>`, `<a>` (cho link nội bộ) hoặc tự nạp font.
- Dùng các helper có kiểu (`PageProps`, `LayoutProps`) như đã dùng trong dự án khi khai báo kiểu cho route component.

## Xác thực (Clerk)

- Dùng Clerk cho mọi xác thực và định danh người dùng; không tự xây dựng cơ chế xác thực.
- Ở phía server, lấy người dùng qua `auth()` / `currentUser()` từ `@clerk/nextjs/server` và **luôn kiểm tra quyền ngay trong server action / route handler / hàm truy xuất dữ liệu** — không chỉ dựa vào UI phía client hoặc `proxy.ts`.
- Mọi truy vấn DB trên dữ liệu thuộc về người dùng phải được giới hạn theo `userId` Clerk của người dùng đã xác thực, để người dùng chỉ đọc/sửa được link của chính mình.
- Dùng các component của Clerk (`SignIn`, `SignUp`, `UserButton`, `Show`, …) cho UI xác thực. Route đăng nhập/đăng ký là các catch-all route tại `app/sign-in/[[...sign-in]]` và `app/sign-up/[[...sign-up]]`.
- Không bao giờ để lộ `CLERK_SECRET_KEY` hoặc bất kỳ biến nào không có tiền tố `NEXT_PUBLIC_` ra code phía client.

## Cơ sở dữ liệu (Drizzle + Neon)

- Định nghĩa mọi bảng trong `db/schema.ts` và export client `db` từ `db/index.ts`; import từ `@/db`.
- Không bao giờ ghép chuỗi SQL thô có chứa input người dùng — dùng query builder của Drizzle / template `sql` có tham số hóa.
- Thay đổi schema phải qua migration: sửa `db/schema.ts`, chạy `drizzle-kit generate`, xem lại SQL được sinh ra, rồi migrate. Không sửa tay các tệp migration đã sinh.
- Đặt truy cập DB trong các module chỉ chạy ở server (ví dụ `db/queries/*.ts`) và gọi từ Server Component hoặc Server Action. Không rải truy vấn khắp các component UI.
- Đọc chuỗi kết nối từ `process.env.DATABASE_URL`; không hard-code thông tin đăng nhập.

## UI và giao diện

- Tạo kiểu bằng các utility class của **Tailwind CSS v4**. Không viết CSS tùy chỉnh hoặc `style` inline trừ khi utility không biểu đạt được; style toàn cục và theme token nằm trong `app/globals.css`.
- Dùng theme token có ngữ nghĩa (`bg-background`, `text-foreground`, `border`, …) thay vì màu hard-code để giao diện sáng/tối luôn hoạt động.
- Ghép class bằng `cn()` từ `@/lib/utils`.
- Dùng **component shadcn/ui** từ `@/components/ui` cho mọi UI chuẩn (button, input, dialog, …). Thêm component còn thiếu bằng `npx shadcn@latest add <component>`; không tự viết bản thay thế. Không sửa các tệp được sinh trong `components/ui`, trừ khi là thay đổi thiết kế có chủ đích áp dụng toàn dự án.
- Icon chỉ lấy từ `lucide-react`.
- Xây dựng UI dễ truy cập và responsive (ưu tiên mobile): HTML ngữ nghĩa, control form có nhãn, trạng thái focus nhìn thấy được, `alt` có ý nghĩa.

## Bảo mật và cấu hình

- Secret nằm trong `.env` (đã git-ignore). Không commit secret hoặc in ra log/phản hồi.
- Validate và làm sạch URL do người dùng cung cấp (chỉ cho phép `http:`/`https:`) trước khi lưu hoặc chuyển hướng, để tránh open redirect và lạm dụng URL `javascript:`.
- Không tin ID người dùng do client gửi lên; luôn lấy danh tính từ phiên Clerk ở phía server.

## Quy trình làm việc

- Cài dependency bằng `npm` (repo dùng `package-lock.json`); không dùng trình quản lý gói khác.
- Chỉ thêm dependency khi thực sự cần thiết và nêu rõ lý do.
- Giữ tài liệu luôn cập nhật: nếu thay đổi hành vi được nêu trong một hướng dẫn `/docs` hoặc trong tệp này, hãy cập nhật trong cùng thay đổi.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
