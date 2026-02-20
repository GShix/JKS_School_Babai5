# Fee Management API Reference

## Base URL
All endpoints are prefixed with: `/api/fee-management`

**Authentication:** All endpoints require admin authentication via Bearer token

---

## Fee Categories

### Create Fee Category
**POST** `/categories`

**Request Body:**
```json
{
  "name": "Tuition Fee",
  "description": "Monthly tuition fee",
  "isActive": true,
  "displayOrder": 1
}
```

**Response:**
```json
{
  "message": "Fee category created successfully",
  "data": {
    "id": 1,
    "name": "Tuition Fee",
    "description": "Monthly tuition fee",
    "isActive": true,
    "displayOrder": 1,
    "createdAt": "2024-02-20T10:00:00.000Z",
    "updatedAt": "2024-02-20T10:00:00.000Z"
  }
}
```

### Get All Categories
**GET** `/categories?isActive=true`

### Get Category by ID
**GET** `/categories/:id`

### Update Category
**PUT** `/categories/:id`

### Delete Category (Soft Delete)
**DELETE** `/categories/:id`

---

## Fee Structures

### Create Fee Structure
**POST** `/structures`

**Request Body:**
```json
{
  "name": "Class 8 - Academic Year 2081-2082",
  "academicYear": "2081-2082",
  "class": "8",
  "section": "A",
  "dueDate": "2024-06-30",
  "description": "Fee structure for class 8 section A",
  "items": [
    {
      "feeCategoryId": 1,
      "amount": 15000,
      "description": "Annual tuition"
    },
    {
      "feeCategoryId": 2,
      "amount": 2000,
      "description": "Library access"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Fee structure created successfully",
  "data": {
    "id": 1,
    "name": "Class 8 - Academic Year 2081-2082",
    "academicYear": "2081-2082",
    "class": "8",
    "section": "A",
    "totalAmount": 17000,
    "isActive": true,
    "dueDate": "2024-06-30",
    "items": [
      {
        "id": 1,
        "amount": 15000,
        "category": {
          "id": 1,
          "name": "Tuition Fee"
        }
      }
    ]
  }
}
```

### Get All Structures
**GET** `/structures?academicYear=2081-2082&class=8&isActive=true`

### Get Structure by ID
**GET** `/structures/:id`

### Update Structure
**PUT** `/structures/:id`

### Delete Structure (Soft Delete)
**DELETE** `/structures/:id`

---

## Fee Allocations

### Allocate to Single Student
**POST** `/allocations/student`

**Request Body:**
```json
{
  "studentId": 1,
  "feeStructureId": 1,
  "discount": 1000,
  "discountReason": "Sibling discount",
  "dueDate": "2024-06-30",
  "notes": "First installment"
}
```

**Response:**
```json
{
  "message": "Fee allocated to student successfully",
  "data": {
    "id": 1,
    "studentId": 1,
    "feeStructureId": 1,
    "totalAmount": 17000,
    "paidAmount": 0,
    "balance": 16000,
    "status": "pending",
    "discount": 1000,
    "discountReason": "Sibling discount",
    "dueDate": "2024-06-30",
    "student": {
      "id": 1,
      "fullName": "Ram Bahadur Thapa",
      "rollNumber": "R-2024-001",
      "class": "8",
      "section": "A"
    },
    "feeStructure": {
      "name": "Class 8 - Academic Year 2081-2082"
    }
  }
}
```

### Allocate to Multiple Students (Bulk)
**POST** `/allocations/bulk`

**Request Body:**
```json
{
  "studentIds": [1, 2, 3, 4, 5],
  "feeStructureId": 1,
  "discount": 0,
  "dueDate": "2024-06-30"
}
```

### Allocate to Entire Class
**POST** `/allocations/class`

**Request Body:**
```json
{
  "class": "8",
  "section": "A",
  "feeStructureId": 1,
  "discount": 0
}
```

### Get All Allocations
**GET** `/allocations?studentId=1&status=pending`

**Query Parameters:**
- `studentId` - Filter by student
- `feeStructureId` - Filter by fee structure
- `status` - Filter by status (pending, partial, paid, overdue)
- `academicYear` - Filter by academic year
- `class` - Filter by class

### Get Allocation by ID
**GET** `/allocations/:id`

### Get Student's Allocations
**GET** `/allocations/student/:studentId`

**Response:**
```json
{
  "message": "Student fee allocations fetched successfully",
  "data": {
    "allocations": [...],
    "summary": {
      "totalAllocated": 50000,
      "totalPaid": 30000,
      "totalBalance": 20000,
      "totalDiscount": 0,
      "statusCounts": {
        "pending": 1,
        "partial": 2,
        "paid": 1,
        "overdue": 0
      }
    }
  }
}
```

### Update Allocation
**PUT** `/allocations/:id`

**Request Body:**
```json
{
  "discount": 2000,
  "discountReason": "Scholarship awarded",
  "dueDate": "2024-07-31",
  "notes": "Extension granted"
}
```

### Delete Allocation
**DELETE** `/allocations/:id`

---

## Fee Transactions

### Collect Payment
**POST** `/transactions/collect`

**Request Body:**
```json
{
  "feeAllocationId": 1,
  "amount": 5000,
  "paymentMethod": "cash",
  "paymentDate": "2024-02-20",
  "remarks": "Partial payment - first installment"
}
```

**For Bank Transfer:**
```json
{
  "feeAllocationId": 1,
  "amount": 10000,
  "paymentMethod": "bank_transfer",
  "paymentDate": "2024-02-20",
  "bankName": "Nepal Bank",
  "bankAccountNumber": "1234567890",
  "referenceNumber": "TXN-20240220-001",
  "remarks": "Bank transfer"
}
```

**Response:**
```json
{
  "message": "Payment collected successfully",
  "data": {
    "transaction": {
      "id": 1,
      "receiptNumber": "FEE-2024-00001",
      "amount": 5000,
      "paymentMethod": "cash",
      "paymentDate": "2024-02-20",
      "status": "confirmed",
      "feeAllocation": {
        "student": {
          "fullName": "Ram Bahadur Thapa"
        },
        "feeStructure": {
          "name": "Class 8 - Academic Year 2081-2082"
        }
      },
      "collector": {
        "fullName": "Admin User"
      }
    },
    "allocation": {
      "id": 1,
      "totalAmount": 17000,
      "paidAmount": 5000,
      "balance": 12000,
      "status": "partial"
    }
  }
}
```

### Get All Transactions
**GET** `/transactions?startDate=2024-02-01&endDate=2024-02-28&paymentMethod=cash&status=confirmed`

**Query Parameters:**
- `studentId` - Filter by student
- `feeAllocationId` - Filter by allocation
- `status` - Filter by status
- `paymentMethod` - Filter by payment method
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `collectedBy` - Filter by collector admin ID

**Response:**
```json
{
  "message": "Fee transactions fetched successfully",
  "data": {
    "transactions": [...],
    "summary": {
      "totalTransactions": 150,
      "totalAmount": 750000,
      "byPaymentMethod": {
        "cash": { "count": 120, "amount": 600000 },
        "bank_transfer": { "count": 25, "amount": 125000 },
        "online": { "count": 5, "amount": 25000 }
      },
      "byStatus": {
        "confirmed": { "count": 148, "amount": 740000 },
        "cancelled": { "count": 2, "amount": 10000 }
      }
    }
  }
}
```

### Get Transaction by ID
**GET** `/transactions/:id`

### Get Transaction by Receipt Number
**GET** `/transactions/receipt/:receiptNumber`

**Example:** `/transactions/receipt/FEE-2024-00001`

### Cancel Transaction
**POST** `/transactions/:id/cancel`

**Request Body:**
```json
{
  "cancellationReason": "Payment was duplicate / Payment bounced"
}
```

**Response:**
```json
{
  "message": "Transaction cancelled successfully",
  "data": {
    "id": 1,
    "receiptNumber": "FEE-2024-00001",
    "status": "cancelled",
    "cancelledAt": "2024-02-20T15:00:00.000Z",
    "cancellationReason": "Payment was duplicate"
  }
}
```

### Daily Collection Report
**GET** `/transactions/report/daily?date=2024-02-20`

**Response:**
```json
{
  "message": "Daily collection report generated successfully",
  "data": {
    "transactions": [...],
    "summary": {
      "date": "2024-02-20",
      "totalTransactions": 15,
      "totalAmount": 75000,
      "byPaymentMethod": {
        "cash": { "count": 12, "amount": 60000 },
        "bank_transfer": { "count": 3, "amount": 15000 }
      },
      "byCollector": {
        "Admin User": { "count": 10, "amount": 50000 },
        "Accountant": { "count": 5, "amount": 25000 }
      }
    }
  }
}
```

---

## Error Responses

### Validation Error
```json
{
  "message": "Category name is required",
  "error": "Validation error"
}
```

### Not Found
```json
{
  "message": "Fee category not found"
}
```

### Payment Exceeds Balance
```json
{
  "message": "Payment amount (10000) exceeds outstanding balance (5000)"
}
```

### Server Error
```json
{
  "message": "Error collecting fee payment",
  "error": "Database connection failed"
}
```

---

## Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request (resource created)
- `400 Bad Request` - Validation error or invalid input
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User doesn't have required permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Payment Methods

Valid values for `paymentMethod`:
- `cash` - Cash payment
- `bank_transfer` - Bank transfer
- `cheque` - Cheque payment
- `online` - Online payment
- `card` - Card payment

---

## Payment Status

Valid values for transaction `status`:
- `pending` - Payment not yet confirmed
- `confirmed` - Payment confirmed and recorded
- `cancelled` - Payment was cancelled

---

## Allocation Status

Valid values for allocation `status`:
- `pending` - No payment made yet
- `partial` - Some payment made but balance remaining
- `paid` - Full payment completed
- `overdue` - Payment overdue (past due date with balance)
- `waived` - Fee waived/exempted

---

## Example Workflow

### 1. Setup Fee Categories
```bash
# Run setup script
node backend/scripts/setupFeeManagement.js
```

### 2. Create Fee Structure
```bash
POST /api/fee-management/structures
{
  "name": "Class 8 - 2081-2082",
  "academicYear": "2081-2082",
  "class": "8",
  "items": [
    { "feeCategoryId": 1, "amount": 15000 },
    { "feeCategoryId": 3, "amount": 2000 }
  ]
}
```

### 3. Allocate to Class
```bash
POST /api/fee-management/allocations/class
{
  "class": "8",
  "feeStructureId": 1
}
```

### 4. Collect Payment
```bash
POST /api/fee-management/transactions/collect
{
  "feeAllocationId": 1,
  "amount": 5000,
  "paymentMethod": "cash",
  "paymentDate": "2024-02-20"
}

# Response: Receipt FEE-2024-00001
```

### 5. View Reports
```bash
GET /api/fee-management/transactions/report/daily?date=2024-02-20
```

---

## Testing with Postman/cURL

### Get Bearer Token
First, login as admin to get the token:
```bash
POST /api/admin/login
{
  "username": "admin",
  "password": "your-password"
}
```

### Use Token in Requests
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -X GET http://localhost:4000/api/fee-management/categories
```

---

**Need Help?** Refer to `FEE_MANAGEMENT_SYSTEM_GUIDE.md` for detailed implementation guide.
