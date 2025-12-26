## Merchant Wallet Server API

All API responses share a common envelope:

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

- code: 0 means success; non-zero means error
- message: brief message
- data: payload varies per endpoint

Authentication
- Use JWT in header: `Authorization: Bearer <token>` for protected endpoints

---

## Admin APIs

### POST /api/admin/register
- Description: Register a new admin
- Body:
```json
{
  "name": "string",
  "email": "string(email)",
  "password": "string(minLength=6)"
}
```
- Success Response:
```json
{
  "code": 0,
  "message": "success",
  "data": true
}
```

### POST /api/admin/login
- Description: Admin login with email + password
- Body:
```json
{
  "email": "string(email)",
  "password": "string"
}
```
- Success Response:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "string(jwt)"
  }
}
```

### GET /api/admin/merchants
- Description: List merchants (admin only)
- Auth: Required
- Query:
```json
{
  "page": 1,
  "pageSize": 10,
  "status": 0
}
```
- Success Response:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "string|null",
        "email": "string",
        "address": "string|null",
        "identity": {},
        "status": 0,
        "createdTime": "ISO",
        "updatedTime": "ISO",
        "version": 0
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

### GET /api/admin/merchants/:id
- Description: Get merchant detail
- Auth: Required
- Path Params: `id: number`
- Success Response: same shape as a merchant object above inside `data`

### POST /api/admin/merchants/audit
- Description: Audit merchant status (approve/reject)
- Auth: Required
- Body:
```json
{
  "merchantId": 1,
  "status": 2
}
```
- Success Response:
```json
{ "code": 0, "message": "success", "data": true }
```

---

## Merchant APIs

### POST /api/merchant/send-email-code
- Description: Send 6-digit email verification code to merchant
- Rate limit: 1 request/min per email
- Body:
```json
{
  "email": "string(email)"
}
```
- Success Response:
```json
{ "code": 0, "message": "success", "data": { "success": true } }
```

### POST /api/merchant/login-with-email
- Description: Login with email + code. Auto-register if email does not exist
- Body:
```json
{
  "email": "string(email)",
  "code": "string(6 digits)"
}
```
- Success Response:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "merchant": {
      "id": 1,
      "name": "string|null",
      "email": "string",
      "address": "string|null",
      "status": 0,
      "createdTime": "ISO",
      "updatedTime": "ISO",
      "version": 0
    },
    "token": "string(jwt)"
  }
}
```

### POST /api/merchant/add
- Description: Submit/Update merchant info for audit
- Auth: Required
- Body:
```json
{
  "name": "string?",
  "address": "string?",
  "identity": { "any": "object?" }
}
```
- Success Response: merchant object (see above) in `data`

### GET /api/merchant/info
- Description: Get current merchant info (by token)
- Auth: Required
- Success Response: merchant object in `data`
```
{
  "code": 0,
  "message": "success",
  "data": {
    "status"
    
  }
}
// 0:初始化 1:审核中 2:通过 3:不通过
```

### POST /api/merchant/qrcode
- Description: Generate USDT TRC20 QR code for merchant
- Auth: Required
- Body: none
- Success Response:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "qrcode": "string(base64 or url)",
    "address": "string",
    "amount": "string|number"
  }
}
```

### POST /api/merchant/upload
- Description: Upload merchant images (e.g., identity docs)
- Auth: Required
- Content-Type: multipart/form-data
- Form fields:
  - file: binary file (jpg/jpeg/png)
- Success Response:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "url": "string(oss url)",
    "filename": "string"
  }
}
```

---

## Error Codes
- 1007: Token verification failed
- 1012: Email already exists
- 1013: User not found
- 1014: Invalid password
- 1015: Email code send too frequent
- 1016: Email code expired
- 1017: Email code invalid
- 1018: Email send failed

---

## Notes
- Email code is valid for 5 minutes; verification clears the code
- JWT tokens are stored in Redis for both admin and merchant to enforce single-session validity
- Exempted (no auth) paths: `/api/admin/login`, `/api/merchant/send-email-code`, `/api/merchant/login-with-email`


