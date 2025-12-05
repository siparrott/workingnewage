# Test script to verify voucher endpoints are working correctly
Write-Host "=== Testing Voucher Endpoints ===" -ForegroundColor Cyan

$baseUrl = "https://workingnewage-2eecd723a444.herokuapp.com"

Write-Host "`n1. Testing voucher preview endpoint..." -ForegroundColor Yellow
$previewUrl = "$baseUrl/voucher/pdf/preview?sku=Family-Basic&name=Test&from=Tester&message=Test"
Write-Host "URL: $previewUrl" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $previewUrl -Method GET -TimeoutSec 30 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Preview endpoint is working (Status: $($response.StatusCode))" -ForegroundColor Green
        Write-Host "   Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Gray
        Write-Host "   Content-Length: $($response.Headers['Content-Length']) bytes" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Preview endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Checking Heroku app status..." -ForegroundColor Yellow
heroku ps --app workingnewage

Write-Host "`n3. Checking recent logs for voucher PDF generation..." -ForegroundColor Yellow
heroku logs --app workingnewage --tail=false -n 50 | Select-String -Pattern "voucher|pdf|PERSONALISIERTER"

Write-Host "`n=== Test Complete ===" -ForegroundColor Green
Write-Host "`nTo test with a real purchase:" -ForegroundColor Yellow
Write-Host "1. Go to: https://workingnewage-2eecd723a444.herokuapp.com" -ForegroundColor Cyan
Write-Host "2. Navigate to Voucher Store" -ForegroundColor Cyan
Write-Host "3. Select any voucher product" -ForegroundColor Cyan
Write-Host "4. Complete checkout" -ForegroundColor Cyan
Write-Host "5. Download the PDF and verify the layout" -ForegroundColor Cyan

