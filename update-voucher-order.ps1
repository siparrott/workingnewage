# PowerShell script to update voucher product display order via API
$baseUrl = "https://workingnewage-2eecd723a444.herokuapp.com"

Write-Host "=== Updating Voucher Product Display Order ===" -ForegroundColor Cyan

# First, get all products to find their IDs
Write-Host "`n1. Fetching all voucher products..." -ForegroundColor Yellow
try {
    $products = Invoke-RestMethod -Uri "$baseUrl/api/vouchers/products" -Method GET
    Write-Host "   Found $($products.Count) products" -ForegroundColor Green
    
    # Find Family Basic
    $familyBasic = $products | Where-Object { $_.name -like '*Family Basic*' -or $_.slug -like '*family-basic*' }
    if ($familyBasic) {
        Write-Host "   Found Family Basic: ID=$($familyBasic.id), Current Order=$($familyBasic.displayOrder)" -ForegroundColor Cyan
    }
    
    # Find Eventfotografie
    $eventPhoto = $products | Where-Object { $_.name -like '*Event*' -or $_.slug -like '*event*' }
    if ($eventPhoto) {
        Write-Host "   Found Eventfotografie: ID=$($eventPhoto.id), Current Order=$($eventPhoto.displayOrder)" -ForegroundColor Cyan
    }
    
    # Update Family Basic to display_order = 1
    if ($familyBasic) {
        Write-Host "`n2. Updating Family Basic to display first..." -ForegroundColor Yellow
        $updateUrl = "$baseUrl/api/vouchers/products/$($familyBasic.id)"
        $body = @{
            displayOrder = 1
        } | ConvertTo-Json
        
        try {
            $result = Invoke-RestMethod -Uri $updateUrl -Method PUT -Body $body -ContentType "application/json"
            Write-Host "   ✅ Family Basic updated to display_order = 1" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Failed to update Family Basic: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "   Note: This endpoint requires authentication. Please update via database or admin panel." -ForegroundColor Yellow
        }
    }
    
    # Update Eventfotografie to higher order
    if ($eventPhoto) {
        Write-Host "`n3. Moving Eventfotografie down in order..." -ForegroundColor Yellow
        $updateUrl = "$baseUrl/api/vouchers/products/$($eventPhoto.id)"
        $body = @{
            displayOrder = 100
        } | ConvertTo-Json
        
        try {
            $result = Invoke-RestMethod -Uri $updateUrl -Method PUT -Body $body -ContentType "application/json"
            Write-Host "   ✅ Eventfotografie updated to display_order = 100" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Failed to update Eventfotografie: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Manual SQL Alternative ===" -ForegroundColor Yellow
Write-Host "If API update fails due to auth, run these SQL commands on your database:" -ForegroundColor White
Write-Host @"
-- Set Family Basic first
UPDATE voucher_products SET display_order = 1 WHERE name LIKE '%Family Basic%';

-- Move Eventfotografie down
UPDATE voucher_products SET display_order = 100 WHERE name LIKE '%Event%';

-- Verify
SELECT name, display_order FROM voucher_products WHERE is_active = true ORDER BY display_order;
"@ -ForegroundColor Cyan

Write-Host "`n=== Complete ===" -ForegroundColor Green

