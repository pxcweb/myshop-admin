# MyShop 电商 API 接口文档

## 基础信息

- **基础 URL**: `http://localhost:3000`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证方式

使用 JWT Token 进行身份验证，在请求头中添加：

```
Authorization: Bearer <token>
```

## 统一响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 失败响应
```json
{
  "code": 400,
  "message": "错误描述",
  "error": {}
}
```

### 分页响应
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

## 常见错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/登录失败 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 413 | 文件过大 |
| 500 | 服务器错误 |
| 503 | 服务维护中 |

---

# 前台接口 (/api)

## 认证模块

### 用户注册

**POST** `/api/auth/register`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | ✅ | 手机号（11位） |
| password | string | ✅ | 密码 |
| nickname | string | ❌ | 昵称 |

**请求示例**:
```json
{
  "phone": "13800138000",
  "password": "123456",
  "nickname": "张三"
}
```

**响应示例**:
```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "userId": 1
  }
}
```

### 用户登录

**POST** `/api/auth/login`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | ✅ | 手机号 |
| password | string | ✅ | 密码 |

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "张三",
      "avatar": null
    }
  }
}
```

### 获取当前用户信息

**GET** `/api/auth/me`

**需要认证**: ✅

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickname": "张三",
    "avatar": "/uploads/avatar.jpg",
    "status": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 修改用户信息

**PUT** `/api/auth/me`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | ❌ | 新昵称 |
| avatar | string | ❌ | 头像URL |

### 修改密码

**PUT** `/api/auth/password`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| oldPassword | string | ✅ | 旧密码 |
| newPassword | string | ✅ | 新密码 |

---

## 分类模块

### 分类列表

**GET** `/api/categories`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "电子产品",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 分类详情

**GET** `/api/categories/:id`

---

## 商品模块

### 商品列表

**GET** `/api/products`

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | ❌ | 页码，默认1 |
| pageSize | number | ❌ | 每页数量，默认10 |
| category_id | number | ❌ | 分类ID |
| keyword | string | ❌ | 搜索关键词 |
| sort | string | ❌ | 排序：price_asc, price_desc, sales |

**请求示例**:
```
GET /api/products?page=1&pageSize=10&category_id=1&keyword=手机&sort=price_asc
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": 1,
        "category_id": 1,
        "name": "iPhone 15",
        "main_img": "/uploads/product1.jpg",
        "price": "6999.00",
        "stock": 100,
        "sort_order": 0,
        "status": 1,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

### 商品详情

**GET** `/api/products/:id`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "category_id": 1,
    "name": "iPhone 15",
    "main_img": "/uploads/product1.jpg",
    "images": ["img1.jpg", "img2.jpg"],
    "descript": "商品描述",
    "price": "6999.00",
    "cost_price": "5000.00",
    "stock": 100,
    "specs": ["黑色", "128GB"],
    "status": 1,
    "sort_order": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 地址模块

### 地址列表

**GET** `/api/addresses`

**需要认证**: ✅

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "张三",
      "phone": "13800138000",
      "province": "广东省",
      "city": "深圳市",
      "district": "南山区",
      "detail": "科技园路88号",
      "is_default": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 地址详情

**GET** `/api/addresses/:id`

**需要认证**: ✅

### 新增地址

**POST** `/api/addresses`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | ✅ | 收货人姓名 |
| phone | string | ✅ | 联系电话 |
| province | string | ❌ | 省份 |
| city | string | ❌ | 城市 |
| district | string | ❌ | 区县 |
| detail | string | ✅ | 详细地址 |
| is_default | number | ❌ | 是否默认 1=是 0=否 |

### 更新地址

**PUT** `/api/addresses/:id`

**需要认证**: ✅

### 删除地址

**DELETE** `/api/addresses/:id`

**需要认证**: ✅

---

## 订单模块

### 创建订单

**POST** `/api/orders`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| address_id | number | ✅ | 收货地址ID |
| items | array | ✅ | 商品列表 |
| items[].product_id | number | ✅ | 商品ID |
| items[].qty | number | ✅ | 购买数量 |
| user_remark | string | ❌ | 用户备注 |

**请求示例**:
```json
{
  "address_id": 1,
  "items": [
    {"product_id": 1, "qty": 2},
    {"product_id": 2, "qty": 1}
  ],
  "user_remark": "请尽快发货"
}
```

**响应示例**:
```json
{
  "code": 201,
  "message": "下单成功",
  "data": {
    "id": 1,
    "order_no": "202401011200001234",
    "user_id": 1,
    "status": 10,
    "total_amount": "7998.00",
    "freight_amount": "10.00",
    "discount_amount": "0.00",
    "pay_amount": "8008.00",
    "address_snapshot": {...},
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 订单列表

**GET** `/api/orders`

**需要认证**: ✅

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | ❌ | 页码 |
| pageSize | number | ❌ | 每页数量 |
| status | number | ❌ | 状态：10待付款 20已付款 30已发货 40已完成 90已取消 |

### 订单详情

**GET** `/api/orders/:id`

**需要认证**: ✅

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "order_no": "202401011200001234",
    "status": 10,
    "total_amount": "7998.00",
    "pay_amount": "8008.00",
    "address_snapshot": {
      "name": "张三",
      "phone": "13800138000",
      "province": "广东省",
      "city": "深圳市",
      "district": "南山区",
      "detail": "科技园路88号"
    },
    "details": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 1,
        "product_name": "iPhone 15",
        "product_spec": "黑色/128GB",
        "price": "6999.00",
        "qty": 2,
        "subtotal": "13998.00"
      }
    ]
  }
}
```

### 取消订单

**PATCH** `/api/orders/:id/cancel`

**需要认证**: ✅

### 确认收货

**PATCH** `/api/orders/:id/confirm`

**需要认证**: ✅

---

## 支付模块

### 发起支付

**POST** `/api/payments/create`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| order_id | number | ✅ | 订单ID |
| channel | string | ❌ | 支付渠道：mock_pay, wechat_pay, alipay |

**响应示例**:
```json
{
  "code": 201,
  "message": "支付记录已创建",
  "data": {
    "id": 1,
    "order_id": 1,
    "channel": "mock_pay",
    "pay_amount": "8008.00",
    "status": 0,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 模拟支付

**POST** `/api/payments/mock`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| payment_id | number | ✅ | 支付记录ID |

**响应示例**:
```json
{
  "code": 200,
  "message": "支付成功",
  "data": {
    "success": true,
    "message": "支付成功",
    "order_id": 1
  }
}
```

### 查询支付状态

**GET** `/api/payments/status?order_id=1`

**需要认证**: ✅

### 支付回调

**POST** `/api/payments/callback/:channel`

**无需认证**，供第三方支付平台调用。

---

# 后台接口 (/admin)

## 管理员认证

### 管理员登录

**POST** `/admin/auth/login`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | ✅ | 手机号 |
| password | string | ✅ | 密码 |

### 获取管理员信息

**GET** `/admin/auth/me`

**需要认证**: ✅

### 修改管理员密码

**PUT** `/admin/auth/password`

**需要认证**: ✅

---

## 分类管理

### 分类列表

**GET** `/admin/categories`

**需要认证**: ✅

**查询参数**: page, pageSize

### 获取所有分类

**GET** `/admin/categories/all`

**需要认证**: ✅

### 创建分类

**POST** `/admin/categories`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | ✅ | 分类名称 |

### 更新分类

**PUT** `/admin/categories/:id`

**需要认证**: ✅

### 删除分类

**DELETE** `/admin/categories/:id`

**需要认证**: ✅

---

## 商品管理

### 商品列表

**GET** `/admin/products`

**需要认证**: ✅

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | ❌ | 页码 |
| pageSize | number | ❌ | 每页数量 |
| category_id | number | ❌ | 分类筛选 |
| keyword | string | ❌ | 关键词搜索 |
| status | number | ❌ | 状态筛选 1=上架 0=下架 |

### 商品详情

**GET** `/admin/products/:id`

**需要认证**: ✅

### 创建商品

**POST** `/admin/products`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | ✅ | 商品名称 |
| category_id | number | ❌ | 分类ID |
| main_img | string | ❌ | 主图URL |
| images | array | ❌ | 图片列表 |
| descript | string | ❌ | 商品描述 |
| price | number | ✅ | 售价 |
| cost_price | number | ❌ | 成本价 |
| stock | number | ❌ | 库存 |
| specs | array | ❌ | 规格 |
| sort_order | number | ❌ | 排序权重 |
| status | number | ❌ | 状态 1=上架 0=下架 |

### 更新商品

**PUT** `/admin/products/:id`

**需要认证**: ✅

### 删除商品

**DELETE** `/admin/products/:id`

**需要认证**: ✅

### 批量上下架

**PATCH** `/admin/products/status`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | array | ✅ | 商品ID列表 |
| status | number | ✅ | 状态 1=上架 0=下架 |

---

## 订单管理

### 订单列表

**GET** `/admin/orders`

**需要认证**: ✅

**查询参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | ❌ | 页码 |
| pageSize | number | ❌ | 每页数量 |
| order_no | string | ❌ | 订单号搜索 |
| status | number | ❌ | 状态筛选 |
| user_phone | string | ❌ | 用户手机号 |
| start_date | string | ❌ | 开始日期 |
| end_date | string | ❌ | 结束日期 |

### 订单详情

**GET** `/admin/orders/:id`

**需要认证**: ✅

### 发货

**PATCH** `/admin/orders/:id/ship`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| express_company | string | ✅ | 物流公司名称 |
| tracking_no | string | ✅ | 物流单号 |

### 修改备注

**PATCH** `/admin/orders/:id/remark`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| remark | string | ✅ | 备注内容 |

### 修改价格

**PATCH** `/admin/orders/:id/price`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pay_amount | number | ✅ | 实付金额 |
| total_amount | number | ❌ | 订单总额 |
| freight_amount | number | ❌ | 运费 |
| discount_amount | number | ❌ | 优惠金额 |

### 订单统计

**GET** `/admin/orders/stats`

**需要认证**: ✅

---

## 站点配置

### 配置列表

**GET** `/admin/site-config`

**需要认证**: ✅

### 获取所有配置

**GET** `/admin/site-config/all`

**需要认证**: ✅

### 创建配置

**POST** `/admin/site-config`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| config_key | string | ✅ | 配置键 |
| config_value | string | ✅ | 配置值 |
| description | string | ❌ | 描述 |

### 更新配置

**PUT** `/admin/site-config/:id`

**需要认证**: ✅

### 批量更新配置

**PATCH** `/admin/site-config/batch`

**需要认证**: ✅

**请求参数**:
```json
{
  "configs": [
    {"config_key": "site_name", "config_value": "新站点名称"},
    {"config_key": "maintenance_mode", "config_value": "0"}
  ]
}
```

### 删除配置

**DELETE** `/admin/site-config/:id`

**需要认证**: ✅

### 刷新配置缓存

**POST** `/admin/site-config/refresh`

**需要认证**: ✅

---

## 文件上传

### 单图上传

**POST** `/admin/uploads/image`

**需要认证**: ✅

**Content-Type**: `multipart/form-data`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | ✅ | 图片文件 |

**响应示例**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "/uploads/1704067200000_1234.jpg",
    "filename": "1704067200000_1234.jpg"
  }
}
```

### 多图上传

**POST** `/admin/uploads/images`

**需要认证**: ✅

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| files | file[] | ✅ | 图片文件数组（最多10张） |

### 文件上传

**POST** `/admin/uploads/file`

**需要认证**: ✅

### 删除文件

**DELETE** `/admin/uploads/:filename`

**需要认证**: ✅

---

# 订单状态说明

| 状态码 | 说明 | 说明 |
|--------|------|------|
| 10 | 待付款 | 订单已创建，等待支付 |
| 20 | 已付款 | 支付成功，等待发货 |
| 30 | 已发货 | 商家已发货，等待收货 |
| 40 | 已完成 | 用户已确认收货 |
| 90 | 已取消 | 订单已取消 |

# 支付状态说明

| 状态码 | 说明 |
|--------|------|
| 0 | 待支付 |
| 1 | 支付成功 |
| 2 | 支付失败 |
| 3 | 退款中 |
| 4 | 已退款 |

---

# 附录：环境变量配置

| 变量 | 说明 | 默认值 |
|------|------|--------|
| DB_HOST | 数据库主机 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_USER | 数据库用户 | root |
| DB_PASSWORD | 数据库密码 | - |
| DB_NAME | 数据库名称 | myshop |
| PORT | 服务端口 | 3000 |
| JWT_SECRET | JWT密钥 | - |
| JWT_EXPIRES_IN | Token过期时间 | 7d |
| CORS_ORIGIN | CORS允许域名 | * |