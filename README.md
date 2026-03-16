# VeritasFlow — Enterprise Risk-Aware Workflow Orchestration System

> A secure, full-stack compliance engine that dynamically routes financial transactions through multi-level approval workflows based on real-time risk evaluation.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | `https://veritasflow.vercel.app` |
| Backend API | `https://veritasflow.onrender.com` |

**Test Credentials:**

| Role | Email | Password |
|---|---|---|
| Employee | sam@gmail.com | sam1234 |
| Manager | sampath@gmail.com | sam1234 |
| Senior Manager | harsha@gmail.com | sam1234 |
| Compliance Officer | bunny@gmail.com | sam1234 |

---

## What Problem Does This Solve?

In large financial organizations, critical operations like high-value transactions require strict authorization, multiple levels of verification, and complete auditability. Traditional systems often lead to unauthorized actions, operational delays, and compliance risks.

VeritasFlow solves this by:
- Evaluating every transaction through a **configurable rule-based risk engine**
- Automatically routing transactions through **dynamic approval workflows** based on risk level
- Enforcing **role-based access control** at every API endpoint
- Recording every action in an **immutable audit trail**

---

## System Architecture

```
User submits transaction
         │
         ▼
┌─────────────────────┐
│   Risk Engine       │  ← evaluates against DB rules
│   (Rule-Based)      │  ← returns { score, level, reasons }
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Workflow Engine    │  ← routes based on risk level
└─────────────────────┘
         │
    ┌────┴────┐────────────┐
    ▼         ▼            ▼
  LOW       MEDIUM        HIGH
  Auto      Manager    Manager →
 Approve   (Level 1)  Sr. Manager →
                      Compliance Officer
                         (Level 3)
         │
         ▼
┌─────────────────────┐
│   Audit Log         │  ← immutable, populated on every action
└─────────────────────┘
```

---

## Key Features

### Risk Evaluation Engine
- Rules stored in MongoDB — fully configurable at runtime
- No code change needed to add new compliance rules
- Each rule defines: `field`, `operator`, `value`, `score`, `reason`
- Weighted scoring: 0–30 = LOW, 31–60 = MEDIUM, 61+ = HIGH
- Automatic fraud flagging when `riskScore >= 80`

### Multi-Level Approval Workflow
- LOW risk → auto-approved instantly
- MEDIUM risk → Manager approval (Level 1)
- HIGH risk → Manager → Senior Manager → Compliance Officer (Levels 1, 2, 3)
- Each approval action is timestamped, attributed, and immutably recorded

### Role-Based Access Control
- Five roles: `USER`, `MANAGER`, `SENIOR_MANAGER`, `COMPLIANCE_OFFICER`, `ADMIN`
- JWT stored in HTTP-only cookies (never exposed to JavaScript)
- Every route protected by `verifyToken` + `authorizeRoles` middleware
- Ownership checks on audit trail — users can only view their own transactions

### Immutable Audit Trail
- Every approval action recorded with: actor, role, level, action, comments, timestamp
- Full approval chain visible per transaction
- Risk reasons stored alongside each transaction

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database with strict schema validation |
| JWT + bcrypt | Authentication and password hashing |
| cookie-parser | HTTP-only cookie management |
| dotenv | Environment configuration |

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework |
| React Router v6 | Client-side routing |
| Zustand + persist | Global state with localStorage persistence |
| Axios + interceptors | API calls with automatic 401 handling |
| Tailwind CSS v4 | Utility-first styling |

---

## Project Structure

```
VeritasFlow/
├── backend/
│   ├── APIS/
│   │   ├── commonAPI.js          # auth routes (signup, login, logout)
│   │   ├── userAPI.js            # transaction creation, history, audit
│   │   ├── managerAPI.js         # level 1 approval routes
│   │   ├── seniorManagerAPI.js   # level 2 approval routes
│   │   └── complianceOfficerAPI.js # level 3 approval + rule management
│   ├── MODELS/
│   │   ├── userModel.js          # user schema with roles
│   │   ├── transactionModel.js   # transaction + approval history schema
│   │   └── rulesModel.js         # dynamic risk rule schema
│   ├── SERVICES/
│   │   ├── authService.js        # register, authenticate
│   │   ├── riskEngine.js         # rule evaluation engine
│   │   └── workflowEngine.js     # approval routing logic
│   ├── MIDDLEWARES/
│   │   ├── verifyToken.js        # JWT verification
│   │   └── authorizeRoles.js     # role-based access control
│   └── server.js                 # app entry point
│
└── frontend/
    └── src/
        ├── auth/
        │   ├── Login.jsx
        │   └── ChangePassword.jsx
        ├── dashboard/
        │   ├── Dashboard.jsx         # overview + stats
        │   ├── NewTransaction.jsx    # transaction form
        │   └── Transactions.jsx      # history + audit trail
        ├── manager/
        │   └── ManagerDashboard.jsx
        ├── senior-manager/
        │   └── SeniorManagerDashboard.jsx
        ├── compliance/
        │   └── ComplianceDashboard.jsx  # approvals + rule management
        ├── COMPONENTS/
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   ├── Sidebar.jsx
        │   │   ├── Layout.jsx
        │   │   └── ProtectedRoute.jsx
        │   └── shared/
        │       ├── LoadingSpinner.jsx
        │       └── ErrorMessage.jsx
        ├── store/
        │   └── authStore.js          # zustand with persistence
        └── api/
            └── axios.js              # axios instance + 401 interceptor
```

---

## API Reference

### Auth Routes
```
POST   /veritasflow/signup           Register new user
POST   /veritasflow/login            Login and receive JWT cookie
GET    /veritasflow/logout           Clear session cookie
PUT    /veritasflow/change-password  Update password
```

### User Routes (requires USER role)
```
POST   /veritasflow/user-api/transaction/create          Create transaction
GET    /veritasflow/user-api/transactions                Get all my transactions
GET    /veritasflow/user-api/transactions/:id/audit      Get audit trail
```

### Manager Routes (requires MANAGER role)
```
GET    /veritasflow/manager-api/transactions/pending         Pending at level 1
POST   /veritasflow/manager-api/transactions/:id/action      Approve or reject
```

### Senior Manager Routes (requires SENIOR_MANAGER role)
```
GET    /veritasflow/senior-manager-api/transactions/pending       Pending at level 2
POST   /veritasflow/senior-manager-api/transactions/:id/action    Approve or reject
```

### Compliance Officer Routes (requires COMPLIANCE_OFFICER role)
```
GET    /veritasflow/co-api/transactions/pending         Pending at level 3
POST   /veritasflow/co-api/transactions/:id/action      Final approval or rejection
GET    /veritasflow/co-api/rules                        View all active rules
POST   /veritasflow/co-api/rules                        Add new rule
DELETE /veritasflow/co-api/rules/:id                    Delete rule
```

---

## Risk Engine — How It Works

Rules are stored in MongoDB with this structure:

```json
{
  "name": "HIGH_VALUE_TRANSFER",
  "condition": {
    "field": "amount",
    "operator": "GT",
    "value": 100000
  },
  "score": 40,
  "reason": "Transaction exceeds ₹1,00,000 threshold",
  "isActive": true
}
```

Supported operators: `GT`, `LT`, `EQ`, `IN`

The engine loops through all active rules, evaluates each condition against the transaction, accumulates scores, and returns:

```json
{
  "score": 78,
  "level": "HIGH",
  "reasons": ["Transaction exceeds ₹1,00,000 threshold"]
}
```

Adding a new compliance rule requires **zero code changes** — just a POST request to `/co-api/rules`.

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend

```bash
git clone https://github.com/yourusername/veritasflow.git
cd veritasflow/backend
npm install
```

Create `.env`:
```env
PORT=4040
DB_URL=mongodb://localhost:27017/veritasflow
JWT_SECRET=your_secret_key_here
```

```bash
npm run dev
```

### Frontend

```bash
cd veritasflow/frontend
npm install
npm run dev
```

Update `src/api/axios.js` baseURL to `http://localhost:4040/veritasflow`.

---

## Deployment

| Service | Platform |
|---|---|
| Backend | Render.com (Web Service) |
| Frontend | Vercel |
| Database | MongoDB Atlas |

---

## Resume Bullets

```
• Built an enterprise-grade compliance orchestration system with a configurable
  rule-based risk engine that dynamically routes transactions through 3-level
  approval workflows (Manager → Senior Manager → Compliance Officer)

• Designed a weighted scoring engine evaluating transactions against MongoDB-stored
  rules with zero code changes needed to add new compliance rules at runtime

• Implemented role-based access control across 5 user roles with JWT HTTP-only
  cookies, immutable audit trails, and automatic fraud flagging for high-risk transactions
```

---

## What I Learned

- Finite state machine design for multi-step approval workflows
- Rule engine architecture — separating rule definition from evaluation logic
- Multi-tenant RBAC patterns with middleware-level enforcement
- Immutable audit trail design for compliance systems
- Real-world banking workflow patterns (maker-checker systems)

---

## Author

**Addani Akaash** — Computer Science Engineering, Anurag University (2023–2027)

- Email: addaniakaash524@gmail.com
- Linkedin: https://www.linkedin.com/in/addani-akaash-46a72a373

---
