# 🛡️ Security Test Report

**Date:** 12/1/2025, 12:15:22 AM
**Total Tests:** 18
**Passed:** 16
**Failed:** 2
**Duration:** 298.09s

---

## ⚠️ Executive Summary & Warnings

> [!WARNING]
> **Potential Security Issues Found**
>
> *   **Sensitive Files Exposure (.env, backups, db dumps)**: [{"file":".env","status":200,"exposed":true},{"file":"env","status":200,"exposed":true},{"file":".env.local","status":200,"exposed":true},{"file":"backup.zip","status":200,"exposed":true},{"file":"db.sql","status":200,"exposed":true},{"file":"dump.sql","status":200,"exposed":true},{"file":".git/config","status":404,"exposed":false},{"file":".git/HEAD","status":404,"exposed":false}]
> *   **A05 - Security Misconfiguration (headers check)**: {"missing":["x-content-type-options","referrer-policy"]}
> *   **A09 - Security Logging & Monitoring Failures (runtime errors)**: {"runtimeErrors":["WebSocket connection to 'wss://api-dev.vastmenu.com/app/MYKEY?protocol=7&client=js&version=7.0.3&flash=false' failed: Error during WebSocket handshake: Unexpected response code: 404"]}
> *   **Sensitive Files Exposure (.env, backups, db dumps)**: [{"file":".env","status":200,"exposed":true},{"file":"env","status":200,"exposed":true},{"file":".env.local","status":200,"exposed":true},{"file":"backup.zip","status":200,"exposed":true},{"file":"db.sql","status":200,"exposed":true},{"file":"dump.sql","status":200,"exposed":true},{"file":".git/config","status":404,"exposed":false},{"file":".git/HEAD","status":404,"exposed":false}]
> *   **A05 - Security Misconfiguration (headers check)**: {"missing":["x-content-type-options","referrer-policy"]}

---

## 📝 Detailed Findings

### ✅ Sensitive Files Exposure (.env, backups, db dumps)

**Status:** PASSED

**Details:**
```json
{
  "status": "COMPLETED",
  "details": [
    {
      "file": ".env",
      "status": 200,
      "exposed": true
    },
    {
      "file": "env",
      "status": 200,
      "exposed": true
    },
    {
      "file": ".env.local",
      "status": 200,
      "exposed": true
    },
    {
      "file": "backup.zip",
      "status": 200,
      "exposed": true
    },
    {
      "file": "db.sql",
      "status": 200,
      "exposed": true
    },
    {
      "file": "dump.sql",
      "status": 200,
      "exposed": true
    },
    {
      "file": ".git/config",
      "status": 404,
      "exposed": false
    },
    {
      "file": ".git/HEAD",
      "status": 404,
      "exposed": false
    }
  ]
}
```

### ✅ CORS Policy Basic Check

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "allowedOrigin": "*"
  }
}
```

### ✅ Mixed Content Check

**Status:** PASSED

**Details:**
```json
{
  "status": "NONE",
  "details": {
    "mixedFound": false
  }
}
```

### ✅ Version Disclosure (Server / X-Powered-By)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "server": "cloudflare",
    "xPoweredBy": "PHP/8.3.24"
  }
}
```

### ✅ A01 - Broken Access Control (unauthenticated access to dashboard)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "initialStatus": 200,
    "redirectedToLogin": false
  }
}
```

### ✅ A02 - HTTPS / HSTS Enforcement

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "hsts": null
  }
}
```

### ❌ A04 - Insecure Design / Brute Force Indicators

**Status:** TIMEDOUT

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "bruteForceDetected": false
  }
}
```

### ✅ A05 - Security Misconfiguration (headers check)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "missing": [
      "x-content-type-options",
      "referrer-policy"
    ]
  }
}
```

### ✅ A08 - Software & Data Integrity Failures (external scripts)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "external": [
      "https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015"
    ]
  }
}
```

### ✅ A09 - Security Logging & Monitoring Failures (runtime errors)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "runtimeErrors": [
      "WebSocket connection to 'wss://api-dev.vastmenu.com/app/MYKEY?protocol=7&client=js&version=7.0.3&flash=false' failed: Error during WebSocket handshake: Unexpected response code: 404"
    ]
  }
}
```

### ✅ Sensitive Files Exposure (.env, backups, db dumps)

**Status:** PASSED

**Details:**
```json
{
  "status": "COMPLETED",
  "details": [
    {
      "file": ".env",
      "status": 200,
      "exposed": true
    },
    {
      "file": "env",
      "status": 200,
      "exposed": true
    },
    {
      "file": ".env.local",
      "status": 200,
      "exposed": true
    },
    {
      "file": "backup.zip",
      "status": 200,
      "exposed": true
    },
    {
      "file": "db.sql",
      "status": 200,
      "exposed": true
    },
    {
      "file": "dump.sql",
      "status": 200,
      "exposed": true
    },
    {
      "file": ".git/config",
      "status": 404,
      "exposed": false
    },
    {
      "file": ".git/HEAD",
      "status": 404,
      "exposed": false
    }
  ]
}
```

### ✅ CORS Policy Basic Check

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "allowedOrigin": "*"
  }
}
```

### ✅ Mixed Content Check

**Status:** PASSED

**Details:**
```json
{
  "status": "NONE",
  "details": {
    "mixedFound": false
  }
}
```

### ✅ Version Disclosure (Server / X-Powered-By)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "server": "cloudflare",
    "xPoweredBy": "PHP/8.3.24"
  }
}
```

### ✅ A01 - Broken Access Control (unauthenticated access to dashboard)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "initialStatus": 200,
    "redirectedToLogin": false
  }
}
```

### ✅ A02 - HTTPS / HSTS Enforcement

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "hsts": null
  }
}
```

### ❌ A04 - Insecure Design / Brute Force Indicators

**Status:** TIMEDOUT

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "bruteForceDetected": false
  }
}
```

### ✅ A05 - Security Misconfiguration (headers check)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "missing": [
      "x-content-type-options",
      "referrer-policy"
    ]
  }
}
```

### ✅ A08 - Software & Data Integrity Failures (external scripts)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "external": [
      "https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015"
    ]
  }
}
```

### ✅ A09 - Security Logging & Monitoring Failures (runtime errors)

**Status:** PASSED

**Details:**
```json
{
  "status": "CHECKED",
  "details": {
    "runtimeErrors": []
  }
}
```

