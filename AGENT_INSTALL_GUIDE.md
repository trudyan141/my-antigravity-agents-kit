# Hướng dẫn Cài đặt & Phân phối .agent Cá nhân

File này hướng dẫn bạn cách đóng gói folder `.agent` (bộ não AI) của bạn thành một công cụ có thể cài đặt nhanh chóng vào bất kỳ dự án nào bằng lệnh `npx`.

---

## 🚀 Cách 1: Cài đặt chuyên nghiệp bằng NPX (Khuyên dùng)

Sau khi bạn đã publish repo này lên NPM (hoặc dùng bản clone từ Git), bạn có thể cài đặt bộ não AI cực kỳ chuyên nghiệp:

```bash
# Di chuyển vào dự án của bạn
cd your-project

# Khởi tạo bộ Kit
npx @trudyan141/antigravity-kit init
```

Lệnh này sẽ tự động:

1. Copy folder `.agent` vào dự án hiện tại.
2. Thêm `.agent/` vào file `.gitignore` (nếu chưa có).

---

## 🚀 Cách 2: Cài đặt Offline (Dành cho máy hiện tại)

Nếu bạn muốn cài đặt bộ Kit đang có sẵn trên máy vào các dự án khác:

1. Di chuyển vào thư mục gốc của repo này.
2. Link nó vào hệ thống toàn cục:
   ```bash
   npm link
   ```
3. Ở project mới, chạy lệnh:
   ```bash
   init-agent
   ```

---

## 🔄 Quy trình "Tiến hóa" Bộ não AI (Evolution Workflow)

Đây là tính năng độc nhất giúp bộ não AI của bạn ngày càng thông minh hơn sau mỗi dự án.

### Bước 1: Đánh dấu "Trụ sở chính" (Làm 1 lần)

Tại folder Kit này (Master Kit), hãy chạy lệnh:

```bash
npx . set-master
```

Lệnh này giúp máy tính ghi nhớ đây là "trụ sở" lưu trữ kiến thức gốc.

### Bước 2: Học hỏi tại dự án con

Khi bạn đang làm ở một dự án khác và đã thêm/sửa một Skill cực hay trong folder `.agent`, hãy gõ:

```bash
npx @trudyan141/antigravity-kit sync
```

Bộ cài sẽ tự động "thu hoạch" những cải tiến đó và gửi ngược về Trụ sở chính (Master Kit) cho bạn.

### Bước 3: Chốt sổ (Review & Push)

Quay lại folder Master Kit này, bạn dùng `git diff` để kiểm tra lại các kiến thức mới vừa được đồng bộ về, sau đó `git push` lên GitHub để lưu lại vĩnh viễn.

---

## 🚀 Cách 2: Tạo "Bộ cài đặt" Online (npx Initializer) - Step-by-Step

### Bước 1: Khởi tạo Project CLI

Tạo một thư mục mới để chứa mã nguồn của bộ cài đặt.

```bash
mkdir my-agent-init && cd my-agent-init
npm init -y
mkdir bin
```

### Bước 2: Cấu hình `package.json`

Mở `package.json` và thêm trường `bin`. Đây là phần quan trọng nhất để npm nhận diện lệnh chạy.

```json
{
  "name": "my-agent-init",
  "version": "1.0.0",
  "bin": {
    "my-agent-init": "./bin/init.js"
  },
  "type": "module",
  "dependencies": {
    "chalk": "^5.0.0"
  }
}
```

### Bước 3: Viết Script khởi tạo (`bin/init.js`)

File này sẽ tự động clone folder `.agent` từ GitHub của bạn về dự án hiện tại.

```javascript
#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import chalk from "chalk";

// ⚠️ THAY ĐỔI URL NÀY THÀNH REPO CHỨA FOLDER .AGENT CỦA RIÊNG BẠN
const REPO_URL = "https://github.com/your-username/your-agent-brain.git";

console.log(chalk.blue('🚀 Đang khởi chuẩn bị "cấy ghép" bộ não AI...'));

if (fs.existsSync(".agent")) {
  console.log(chalk.yellow("⚠️ Thư mục .agent đã tồn tại trong dự án này."));
  process.exit(0);
}

try {
  // Clone repo vào folder tạm .agent
  execSync(`git clone ${REPO_URL} .agent`, { stdio: "inherit" });

  // Xóa folder .git bên trong để tránh xung đột với repo chính của dự án
  fs.rmSync(".agent/.git", { recursive: true, force: true });

  console.log(
    chalk.green("✅ Cài đặt thành công! AI của bạn đã sẵn sàng làm việc.")
  );
} catch (error) {
  console.error(chalk.red("❌ Lỗi không thể tải bộ não AI:"), error.message);
  process.exit(1);
}
```

### Bước 4: Đưa lên chợ ứng dụng (npm)

Nếu bạn muốn dùng lệnh `npx`, bạn cần publish nó lên npm.

```bash
npm login
npm publish --access public
```

_(Lưu ý: Bạn có thể đặt tên package khác nếu tên `my-agent-init` đã bị trùng)._

### Bước 5: Sử dụng mọi lúc, mọi nơi

Ở bất kỳ dự án mới nào, bạn chỉ cần mở Terminal và gõ:

```bash
npx my-agent-init
```

---

## 🔗 Các phương pháp khác

Nếu bạn không muốn dùng npm, bạn có thể dùng:

- **Git Submodule:** `git submodule add <url-repo-agent> .agent`
- **Symbolic Link:** `ln -s /duong/dan/den/agent/goc .agent`

> [!TIP]
> Việc dùng `npx` giúp bạn không cần nhớ đường dẫn file trên máy, chỉ cần có internet là bạn có thể "triệu hồi" trợ lý AI của mình ở bất cứ đâu.
