$base = "https://civicsense-jdvw.onrender.com"

# ── Test 1: Health Check ──────────────────────────────────────────
Write-Host "`n[1] Health Check" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$base/api/health" | ConvertTo-Json

# ── Test 2: Register new citizen ─────────────────────────────────
Write-Host "`n[2] Register Citizen" -ForegroundColor Cyan
try {
    $reg = Invoke-RestMethod -Uri "$base/api/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Test Citizen","email":"testcitizen@demo.com","password":"demo123","role":"citizen"}'
    $reg | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Register Failed/Skipped (Might exist): $($_.Exception.Message)" -ForegroundColor Yellow
}

# ── Test 3: Login as citizen ──────────────────────────────────────
Write-Host "`n[3] Login Citizen" -ForegroundColor Cyan
$login = Invoke-RestMethod -Uri "$base/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"citizen@civicsense.com","password":"demo123"}'
$citizenToken = $login.data.token
Write-Host "Token OK: $($citizenToken.Substring(0,20))..."

# ── Test 4: Submit Complaint ──────────────────────────────────────
Write-Host "`n[4] Submit Complaint" -ForegroundColor Cyan
$headers = @{ Authorization = "Bearer $citizenToken" }
$body = '{"title":"Roads broken near school zone","description":"The road near Government Primary School in Sector 5 has massive potholes causing accidents daily. Three vehicles damaged this week alone.","location":"Sector 5, Shirpur"}'
$complaint = Invoke-RestMethod -Uri "$base/api/complaints" -Method POST -ContentType "application/json" -Headers $headers -Body $body
$complaint | ConvertTo-Json -Depth 5
$trackingId = $complaint.data.trackingId
Write-Host "Tracking ID: $trackingId" -ForegroundColor Green

# ── Test 5: Track complaint publicly ─────────────────────────────
Write-Host "`n[5] Track Complaint (public)" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$base/api/complaints/$trackingId" | ConvertTo-Json -Depth 5

# ── Test 6: Get my complaints ─────────────────────────────────────
Write-Host "`n[6] My Complaints" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$base/api/complaints/user" -Headers $headers | ConvertTo-Json -Depth 3

# ── Test 7: Login as Admin ────────────────────────────────────────
Write-Host "`n[7] Login Admin" -ForegroundColor Cyan
$adminLogin = Invoke-RestMethod -Uri "$base/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@civicsense.com","password":"demo123"}'
$adminToken = $adminLogin.data.token
Write-Host "Admin Token OK: $($adminToken.Substring(0,20))..."

# ── Test 8: Admin list complaints ────────────────────────────────
Write-Host "`n[8] Admin Dashboard Complaints" -ForegroundColor Cyan
$adminHeaders = @{ Authorization = "Bearer $adminToken" }
$adminComplaints = Invoke-RestMethod -Uri "$base/api/admin/complaints?sortBy=urgencyScore&order=desc&limit=5" -Headers $adminHeaders
$adminComplaints | ConvertTo-Json -Depth 3

# ── Test 9: Admin update status ───────────────────────────────────
Write-Host "`n[9] Update Status to In Progress" -ForegroundColor Cyan
$statusBody = "{`"status`":`"In Progress`",`"note`":`"Assigned to road repair team`"}"
Invoke-RestMethod -Uri "$base/api/admin/complaints/$trackingId/status" -Method PUT -ContentType "application/json" -Headers $adminHeaders -Body $statusBody | ConvertTo-Json -Depth 3

# ── Test 10: Analytics ────────────────────────────────────────────
Write-Host "`n[10] Analytics Dashboard" -ForegroundColor Cyan
$analytics = Invoke-RestMethod -Uri "$base/api/admin/analytics" -Headers $adminHeaders
$analytics.data.kpis | ConvertTo-Json

# ── Test 11: Chatbot ──────────────────────────────────────────────
Write-Host "`n[11] Chatbot" -ForegroundColor Cyan
$chatBody = '{"message":"What is the status of my complaint?"}'
Invoke-RestMethod -Uri "$base/api/complaints/chat" -Method POST -ContentType "application/json" -Headers $headers -Body $chatBody | ConvertTo-Json -Depth 3
