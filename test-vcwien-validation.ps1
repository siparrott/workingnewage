# Test VCWIEN coupon validation
$baseUrl = "https://workingnewage-2eecd723a444.herokuapp.com"

Write-Host "=== Testing VCWIEN Coupon Validation ===" -ForegroundColor Cyan

# Test with correct data
$body = @{
    code = "VCWIEN"
    orderAmount = 95.00
    items = @(
        @{
            productSlug = "family-basic"
            sku = "family-basic"
            name = "Family Basic"
            price = 95.00
            quantity = 1
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "`nRequest Body:" -ForegroundColor Yellow
Write-Host $body -ForegroundColor Gray

Write-Host "`nSending validation request..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/vouchers/coupons/validate" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "`n✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Gray
    
} catch {
    Write-Host "`n❌ FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}

# Also test with uppercase SKU
Write-Host "`n`n=== Testing with uppercase SKU ===" -ForegroundColor Cyan
$body2 = @{
    code = "VCWIEN"
    orderAmount = 95.00
    items = @(
        @{
            productSlug = "Family-Basic"
            sku = "Family-Basic"
            name = "Family Basic"
            price = 95.00
            quantity = 1
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response2 = Invoke-RestMethod -Uri "$baseUrl/api/vouchers/coupons/validate" `
        -Method POST `
        -Body $body2 `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✅ Also works with uppercase!" -ForegroundColor Green
} catch {
    Write-Host "❌ Uppercase SKU failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

