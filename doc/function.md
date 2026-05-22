# MyShop — 电商独立站后端服务

> 基于 **Node.js + Express + MySQL** 的前后端分离电商独立站后端 API 服务。  
> 面向个人站长/小型店铺场景，提供从商品展示、购物车下单、在线支付到订单履约的完整交易链路。

---

## 技术栈

| 层级       | 技术                           |
| ---------- | ------------------------------ |
| 运行环境   | Node.js                        |
| Web 框架   | Express 4.x                    |
| 数据库     | MySQL 5.7+ / 8.0               |
| 数据库驱动 | mysql2/promise（连接池）       |
| 身份认证   | JWT（jsonwebtoken + bcryptjs） |
| 文件上传   | multer（磁盘存储）             |
| 跨域支持   | cors                           |
| 环境变量   | dotenv                         |
| 热重载     | nodemon（开发环境）            |

---

## 项目目录结构

```
myshop/
├── bin/www                         # 服务启动入口
├── app.js                          # Express 应用配置（中间件、路由注册、错误处理）
├── initDatabase.js                 # 数据库初始化脚本（自动建库建表）
├── seedData.js                     # 模拟数据脚本（一键灌入测试数据）
├── package.json
├── .env / .env.example             # 环境变量配置
├── .gitignore
│
├── config/
│   └── siteConfig.js               # 站点配置内存缓存（启动加载 + 实时更新）
│
├── middleware/
│   ├── authUser.js                 # 前台用户 JWT 验证 + 可选登录中间件
│   ├── authAdmin.js                # 后台管理员 JWT 验证
│   ├── checkMaintenance.js         # 维护模式拦截（仅拦截前台）
│   └── validate.js                 # 通用参数校验（必填、手机号、邮箱、数字、分页）
│
├── services/
│   ├── orderService.js             # 订单核心业务（创建、取消、库存预占）
│   ├── paymentService.js           # 支付核心业务（模拟支付、回调处理）
│   └── cronService.js              # 定时任务（超时取消订单、自动确认收货）
│
├── utils/
│   ├── pool.js                     # MySQL 连接池 + 通用查询方法
│   ├── response.js                 # 统一响应封装（success / fail）
│   ├── auth.js                     # JWT 生成/验证 + 密码哈希/比对
│   └── upload.js                   # multer 上传配置（图片/文件过滤、大小限制）
│
├── routes/
│   ├── api/                        # ====== 前台用户接口 ======
│   │   ├── auth.js                 # 用户注册 / 登录 / 个人信息 / 改密
│   │   ├── categories.js           # 分类列表 / 分类详情
│   │   ├── products.js             # 商品列表（分页/搜索/筛选/排序） / 详情
│   │   ├── addresses.js            # 收货地址 CRUD
│   │   ├── orders.js               # 下单 / 订单列表 / 详情 / 取消 / 确认收货
│   │   └── payments.js             # 发起支付 / 模拟支付 / 支付状态 / 支付回调
│   │
│   └── admin/                      # ====== 后台管理接口 ======
│       ├── auth.js                 # 管理员登录 / 信息 / 改密
│       ├── categories.js           # 分类 CRUD
│       ├── products.js             # 商品 CRUD / 批量上下架
│       ├── orders.js               # 订单列表 / 详情 / 发货 / 改备注 / 改价 / 统计
│       ├── siteConfig.js           # 站点配置 CRUD / 批量更新 / 缓存刷新
│       └── uploads.js              # 单图 / 多图 / 文件上传 / 删除
│
├── docs/
│   └── api.md                      # 完整 API 接口文档
│
└── public/
    └── uploads/                    # 上传文件存储目录
```

---

## 数据库设计

共 **8** 张业务表，使用 InnoDB 引擎 + utf8mb4 字符集，外键约束保证数据一致性。

### 表关系 ER 图

```
users ──┬── addresses (1:N)
        └── orders (1:N)
              ├── order_details (1:N) ──── products
              └── payments (1:1)

categories ──── products (1:N)

site_configs （独立配置表）
```

### 数据表说明

#### users — 用户表

| 字段       | 类型         | 说明                |
| ---------- | ------------ | ------------------- |
| id         | int PK       | 主键自增            |
| phone      | varchar(11)  | 手机号（唯一）      |
| password   | varchar(255) | 密码（bcrypt 加密） |
| avatar     | varchar(255) | 头像 URL            |
| nickname   | varchar(50)  | 昵称                |
| status     | tinyint      | 状态 1=正常 0=禁用  |
| deleted_at | datetime     | 软删除时间          |

#### categories — 商品分类表

| 字段 | 类型        | 说明             |
| ---- | ----------- | ---------------- |
| id   | int PK      | 主键自增         |
| name | varchar(50) | 分类名称（唯一） |

#### products — 商品表

| 字段        | 类型          | 说明             |
| ----------- | ------------- | ---------------- |
| id          | int PK        | 主键自增         |
| category_id | int FK        | 所属分类         |
| name        | varchar(255)  | 商品名称（唯一） |
| main_img    | varchar(255)  | 主图 URL         |
| images      | json          | 图片列表         |
| descript    | text          | 商品描述         |
| price       | decimal(10,2) | 售价             |
| cost_price  | decimal(10,2) | 成本价           |
| stock       | int           | 库存数量         |
| specs       | json          | 规格属性         |
| status      | tinyint       | 1=上架 0=下架    |
| sort_order  | int           | 排序权重         |

#### addresses — 收货地址表

| 字段                       | 类型         | 说明         |
| -------------------------- | ------------ | ------------ |
| id                         | int PK       | 主键自增     |
| user_id                    | int FK       | 所属用户     |
| name                       | varchar(30)  | 收货人姓名   |
| phone                      | varchar(11)  | 联系电话     |
| province / city / district | varchar      | 省/市/区     |
| detail                     | varchar(255) | 详细地址     |
| is_default                 | tinyint      | 是否默认地址 |

#### orders — 订单表

| 字段                                             | 类型          | 说明                                              |
| ------------------------------------------------ | ------------- | ------------------------------------------------- |
| id                                               | int PK        | 主键自增                                          |
| order_no                                         | varchar(32)   | 业务订单号（唯一）                                |
| user_id                                          | int FK        | 下单用户                                          |
| status                                           | tinyint       | 10=待付款 20=已付款 30=已发货 40=已完成 90=已取消 |
| total_amount                                     | decimal(10,2) | 商品总额                                          |
| freight_amount                                   | decimal(10,2) | 运费金额                                          |
| discount_amount                                  | decimal(10,2) | 优惠金额                                          |
| pay_amount                                       | decimal(10,2) | 实付金额                                          |
| address_snapshot                                 | json          | 下单时地址快照                                    |
| user_remark                                      | varchar(255)  | 用户备注                                          |
| express_company                                  | varchar(30)   | 物流公司                                          |
| tracking_no                                      | varchar(50)   | 物流单号                                          |
| pay_time / ship_time / finish_time / cancel_time | datetime      | 各环节时间戳                                      |

#### order_details — 订单明细表

| 字段         | 类型          | 说明             |
| ------------ | ------------- | ---------------- |
| id           | int PK        | 主键自增         |
| order_id     | int FK        | 所属订单         |
| product_id   | int FK        | 关联商品         |
| product_name | varchar(150)  | 下单时商品名快照 |
| product_spec | varchar(100)  | 下单时规格快照   |
| price        | decimal(10,2) | 下单时单价       |
| qty          | int           | 购买数量         |
| subtotal     | decimal(10,2) | 商品小计         |

#### payments — 支付记录表

| 字段         | 类型          | 说明                                       |
| ------------ | ------------- | ------------------------------------------ |
| id           | int PK        | 主键自增                                   |
| order_id     | int FK        | 所属订单（唯一）                           |
| channel      | varchar(20)   | 支付渠道（mock_pay / wechat_pay / alipay） |
| pay_amount   | decimal(10,2) | 实付金额                                   |
| status       | tinyint       | 0=待支付 1=成功 2=失败 3=退款中 4=已退款   |
| trade_no     | varchar(100)  | 第三方支付交易号                           |
| raw_response | json          | 支付平台原始回调报文                       |

#### site_configs — 站点配置表

| 字段         | 类型         | 说明           |
| ------------ | ------------ | -------------- |
| id           | int PK       | 主键自增       |
| config_key   | varchar(50)  | 配置键（唯一） |
| config_value | text         | 配置值         |
| description  | varchar(255) | 描述说明       |

---

## 系统功能总览

### 🛍️ 前台商城功能（/api）

#### 用户中心

- **手机号注册 / 登录** — 手机号 + 密码认证，JWT token 鉴权
- **个人信息管理** — 查看和修改昵称、头像
- **密码管理** — 旧密码验证后修改新密码

#### 商品浏览

- **分类列表** — 获取所有商品分类
- **商品列表** — 分页浏览，支持按分类筛选、关键词搜索、价格/销量排序
- **商品详情** — 查看商品完整信息（主图、图片列表、描述、价格、规格、库存）

#### 收货地址

- **地址 CRUD** — 新增、编辑、删除收货地址
- **默认地址** — 设置/切换默认收货地址

#### 购物下单

- **创建订单** — 多商品合并下单，自动计算运费（满减包邮）、生成订单号
- **订单列表** — 按状态筛选、分页浏览
- **订单详情** — 查看订单信息、商品明细、物流信息
- **取消订单** — 待付款订单可取消，自动恢复库存
- **确认收货** — 已发货订单可确认收货

#### 在线支付

- **发起支付** — 创建支付记录，支持多渠道
- **模拟支付** — 开发/测试环境下模拟支付成功
- **支付状态查询** — 实时查询订单支付状态
- **支付回调** — 接收第三方支付平台异步通知（预留接口）

---

### 🏪 后台管理功能（/admin）

#### 管理员认证

- **管理员登录** — 独立 token 类型，与普通用户隔离
- **信息/密码管理** — 查看个人信息、修改密码

#### 分类管理

- **分类 CRUD** — 新增、编辑、删除商品分类
- **全量查询** — 不分页获取所有分类（用于下拉选择）

#### 商品管理

- **商品 CRUD** — 新增、编辑、删除商品（含主图、图片列表、规格、描述）
- **多条件筛选** — 按分类、关键词、上下架状态筛选
- **批量上下架** — 一次性切换多个商品状态
- **排序权重** — 通过 sort_order 控制商品展示顺序

#### 订单管理

- **订单列表** — 多条件筛选（订单号、状态、用户手机号、时间范围）
- **订单详情** — 查看完整订单信息、商品明细、支付记录
- **发货操作** — 录入物流公司和运单号，订单状态自动流转
- **修改备注** — 管理员内部备注
- **修改价格** — 待付款订单可调整金额
- **订单统计** — 按状态汇总订单数量和金额、今日订单数据

#### 站点配置

- **配置管理** — 查看所有配置项、新增/编辑/删除配置
- **批量更新** — 一次性更新多个配置值
- **缓存刷新** — 手动刷新内存中的配置缓存

#### 文件上传

- **单图/多图上传** — 支持 jpeg/jpg/png/gif/webp，单张 ≤ 5MB
- **文件上传** — 支持 pdf/zip 等附件，≤ 10MB
- **文件删除** — 按文件名删除已上传文件

---

### ⚙️ 系统级功能

| 功能               | 说明                                                          |
| ------------------ | ------------------------------------------------------------- |
| **JWT 双身份认证** | 前台用户 token 和后台管理员 token 独立验证，互不干扰          |
| **维护模式**       | 一键开关，开启后前台所有接口返回 503，后台管理不受影响        |
| **库存防超卖**     | 下单时 SQL 层面 `WHERE stock >= qty` 乐观锁扣减               |
| **库存预占机制**   | 下单即扣库存（可配置开关），取消/超时自动恢复                 |
| **超时自动取消**   | 定时任务每分钟扫描，超时未支付订单自动取消（可配置超时时间）  |
| **自动确认收货**   | 发货后 N 天自动确认（可配置天数，默认 10 天）                 |
| **运费自动计算**   | 订单满 X 元包邮（可配置），否则收取基础运费                   |
| **配置内存缓存**   | site_configs 启动时加载到 Map，修改后实时更新，减少数据库查询 |
| **统一响应格式**   | `{ code, message, data }` 规范化所有接口输出                  |
| **全局错误处理**   | 异步 try/catch + 中间件兜底，统一错误码和提示信息             |
| **CORS 跨域**      | 可配置允许域名白名单，支持前端分离部署                        |
| **文件安全**       | 上传类型白名单过滤 + 删除时防路径遍历攻击                     |
| **用户软删除**     | users 表 deleted_at 字段，保留历史订单关联数据                |

---

### 📋 24 项站点配置项

系统预置 24 项可配置参数，覆盖交易、运费、通知、SEO、安全等多个维度：

| 分类     | 配置项                        | 默认值                      | 说明                     |
| -------- | ----------------------------- | --------------------------- | ------------------------ |
| 交易规则 | order_timeout_minutes         | 30                          | 下单超时自动取消（分钟） |
|          | min_order_amount_for_checkout | 0.00                        | 最低起订金额             |
|          | allow_guest_checkout          | 1                           | 是否允许游客下单         |
|          | auto_confirm_delivery_days    | 10                          | 自动确认收货天数         |
|          | enable_inventory_reservation  | 1                           | 下单是否预占库存         |
| 运费税务 | freight_default_amount        | 10.00                       | 基础运费                 |
|          | free_shipping_threshold       | 99.00                       | 包邮门槛金额             |
|          | tax_enabled                   | 0                           | 是否开启税费             |
|          | tax_rate                      | 0.13                        | 默认税率                 |
| 通知触达 | notification_email_from       | support@yourdomain.com      | 通知发件邮箱             |
|          | notify_admin_on_new_order     | 1                           | 新订单管理员提醒         |
|          | notify_user_on_status_change  | 1                           | 状态变更用户通知         |
|          | sms_provider                  | aliyun                      | 短信服务商               |
| 展示SEO  | site_name                     | My Awesome Store            | 站点名称                 |
|          | seo_meta_keywords             | 手工皮具, 定制钱包, 真皮    | SEO 关键词               |
|          | home_banner_image_url         | /uploads/banner_default.jpg | 首页轮播图               |
|          | footer_copyright_text         | © 2024 My Store...         | 页脚版权文案             |
|          | maintenance_mode              | 0                           | 维护模式开关             |
| 安全风控 | max_login_attempts            | 5                           | 登录最大失败次数         |
|          | register_ip_limit_count       | 5                           | 单 IP 每日最大注册数     |
|          | enable_captcha_on_login       | 0                           | 登录验证码开关           |
|          | allowed_file_extensions       | jpg,png,pdf,zip             | 上传文件白名单           |
| 开发者   | debug_mode                    | 0                           | 调试模式开关             |
|          | mock_payment_enabled          | 1                           | 模拟支付开关             |

---

## 快速开始

### 环境要求

- Node.js ≥ 14
- MySQL ≥ 5.7
- npm ≥ 6

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/pxcweb/myshop.git
cd myshop

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写数据库连接信息

# 4. 初始化数据库（自动建库建表）
node initDatabase.js

# 5. 灌入模拟数据（可选）
node seedData.js

# 6. 启动服务
npm start
```

服务启动后访问 `http://localhost:3000`

### 测试账号

| 角色     | 手机号      | 密码     |
| -------- | ----------- | -------- |
| 管理员   | 13800138000 | admin123 |
| 普通用户 | 13800138001 | 123456   |

> 运行 `node seedData.js` 后将创建 15 个用户、8 个分类、26 个商品、40 个订单等完整测试数据。

---

## API 接口概览

### 前台接口（/api）— 共 21 个

| 模块 | 方法   | 路径                            | 认证 | 说明                       |
| ---- | ------ | ------------------------------- | ---- | -------------------------- |
| 认证 | POST   | /api/auth/register              | -    | 用户注册                   |
|      | POST   | /api/auth/login                 | -    | 用户登录                   |
|      | GET    | /api/auth/me                    | ✅   | 获取个人信息               |
|      | PUT    | /api/auth/me                    | ✅   | 修改个人信息               |
|      | PUT    | /api/auth/password              | ✅   | 修改密码                   |
| 分类 | GET    | /api/categories                 | -    | 分类列表                   |
|      | GET    | /api/categories/:id             | -    | 分类详情                   |
| 商品 | GET    | /api/products                   | -    | 商品列表（分页/搜索/排序） |
|      | GET    | /api/products/:id               | -    | 商品详情                   |
| 地址 | GET    | /api/addresses                  | ✅   | 地址列表                   |
|      | GET    | /api/addresses/:id              | ✅   | 地址详情                   |
|      | POST   | /api/addresses                  | ✅   | 新增地址                   |
|      | PUT    | /api/addresses/:id              | ✅   | 更新地址                   |
|      | DELETE | /api/addresses/:id              | ✅   | 删除地址                   |
| 订单 | POST   | /api/orders                     | ✅   | 创建订单                   |
|      | GET    | /api/orders                     | ✅   | 订单列表                   |
|      | GET    | /api/orders/:id                 | ✅   | 订单详情                   |
|      | PATCH  | /api/orders/:id/cancel          | ✅   | 取消订单                   |
|      | PATCH  | /api/orders/:id/confirm         | ✅   | 确认收货                   |
| 支付 | POST   | /api/payments/create            | ✅   | 发起支付                   |
|      | POST   | /api/payments/mock              | ✅   | 模拟支付                   |
|      | GET    | /api/payments/status            | ✅   | 查询支付状态               |
|      | POST   | /api/payments/callback/:channel | -    | 支付回调                   |

### 后台接口（/admin）— 共 25 个

| 模块 | 方法   | 路径                       | 说明                   |
| ---- | ------ | -------------------------- | ---------------------- |
| 认证 | POST   | /admin/auth/login          | 管理员登录             |
|      | GET    | /admin/auth/me             | 获取管理员信息         |
|      | PUT    | /admin/auth/password       | 修改密码               |
| 分类 | GET    | /admin/categories          | 分类列表（分页）       |
|      | GET    | /admin/categories/all      | 所有分类（下拉）       |
|      | GET    | /admin/categories/:id      | 分类详情               |
|      | POST   | /admin/categories          | 创建分类               |
|      | PUT    | /admin/categories/:id      | 更新分类               |
|      | DELETE | /admin/categories/:id      | 删除分类               |
| 商品 | GET    | /admin/products            | 商品列表（筛选/分页）  |
|      | GET    | /admin/products/:id        | 商品详情               |
|      | POST   | /admin/products            | 创建商品               |
|      | PUT    | /admin/products/:id        | 更新商品               |
|      | DELETE | /admin/products/:id        | 删除商品               |
|      | PATCH  | /admin/products/status     | 批量上下架             |
| 订单 | GET    | /admin/orders              | 订单列表（多条件筛选） |
|      | GET    | /admin/orders/:id          | 订单详情               |
|      | GET    | /admin/orders/stats        | 订单统计               |
|      | PATCH  | /admin/orders/:id/ship     | 发货                   |
|      | PATCH  | /admin/orders/:id/remark   | 修改备注               |
|      | PATCH  | /admin/orders/:id/price    | 修改价格               |
| 配置 | GET    | /admin/site-config         | 配置列表               |
|      | GET    | /admin/site-config/all     | 所有配置               |
|      | POST   | /admin/site-config         | 创建配置               |
|      | PUT    | /admin/site-config/:id     | 更新配置               |
|      | DELETE | /admin/site-config/:id     | 删除配置               |
|      | PATCH  | /admin/site-config/batch   | 批量更新               |
|      | POST   | /admin/site-config/refresh | 刷新缓存               |
| 上传 | POST   | /admin/uploads/image       | 单图上传               |
|      | POST   | /admin/uploads/images      | 多图上传               |
|      | POST   | /admin/uploads/file        | 文件上传               |
|      | DELETE | /admin/uploads/:filename   | 删除文件               |

---

## 订单状态流转

```
用户下单 → [10 待付款] → 支付成功 → [20 已付款] → 管理员发货 → [30 已发货] → 用户确认收货 → [40 已完成]
                  ↓                                                                      ↓
            取消/超时                                                              自动确认（N天）
                  ↓
            [90 已取消]
```

---

## 环境变量配置

| 变量                 | 说明               | 默认值    |
| -------------------- | ------------------ | --------- |
| DB_HOST              | 数据库主机         | localhost |
| DB_PORT              | 数据库端口         | 3306      |
| DB_USER              | 数据库用户         | root      |
| DB_PASSWORD          | 数据库密码         | —         |
| DB_NAME              | 数据库名称         | myshop    |
| DB_POOL_LIMIT        | 连接池最大连接数   | 10        |
| DB_POOL_IDLE_TIMEOUT | 连接空闲超时（ms） | 60000     |
| PORT                 | 服务端口           | 3000      |
| JWT_SECRET           | JWT 签名密钥       | —         |
| JWT_EXPIRES_IN       | Token 有效期       | 7d        |
| CORS_ORIGIN          | CORS 允许域名      | \*        |

---

## 接口文档

详细接口文档（请求参数、响应格式、示例）见 [api.md]

---

## License

MIT
