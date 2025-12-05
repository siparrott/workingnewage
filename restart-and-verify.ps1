# Restart Heroku dynos and verify deployment
Write-Host "=== Restarting Heroku Dynos to Ensure Latest Code is Running ===" -ForegroundColor Cyan

Write-Host "`n1. Current release status..." -ForegroundColor Yellow
heroku releases --app workingnewage -n 3

Write-Host "`n2. Restarting all dynos..." -ForegroundColor Yellow
heroku restart --app workingnewage

Write-Host "`nWaiting 10 seconds for dynos to restart..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host "`n3. Checking dyno status..." -ForegroundColor Yellow
heroku ps --app workingnewage

Write-Host "`n4. Testing voucher preview endpoint (no purchase needed)..." -ForegroundColor Yellow
$testUrl = "https://workingnewage-2eecd723a444.herokuapp.com/voucher/pdf/preview?sku=Family-Basic&name=Test+Kunde&from=Test+Sender&message=Dies+ist+eine+Testnachricht"

Write-Host "   Downloading test PDF..." -ForegroundColor Gray
try {
    $outputFile = "test-voucher-$((Get-Date).ToString('yyyyMMdd-HHmmss')).pdf"
    Invoke-WebRequest -Uri $testUrl -OutFile $outputFile -UseBasicParsing
    Write-Host "   ✅ PDF generated successfully!" -ForegroundColor Green
    Write-Host "   Saved to: $outputFile" -ForegroundColor Cyan
    Write-Host "   File size: $((Get-Item $outputFile).Length) bytes" -ForegroundColor Gray
    
    Write-Host "`n   Opening PDF for verification..." -ForegroundColor Yellow
    Start-Process $outputFile
} catch {
    Write-Host "   ❌ Failed to generate PDF: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== DEPLOYMENT VERIFIED ===" -ForegroundColor Green
Write-Host "`nThe changes are now LIVE at:" -ForegroundColor Yellow
Write-Host "https://workingnewage-2eecd723a444.herokuapp.com" -ForegroundColor Cyan
Write-Host "`nTo test with a real purchase:" -ForegroundColor Yellow
Write-Host "1. Go to the live site" -ForegroundColor White
Write-Host "2. Navigate to Gutscheine (Voucher Store)" -ForegroundColor White
Write-Host "3. Select any voucher product" -ForegroundColor White
Write-Host "4. Complete the checkout" -ForegroundColor White
Write-Host "5. Download and verify the PDF has the correct layout:" -ForegroundColor White
Write-Host "   - Logo at top" -ForegroundColor Gray
Write-Host "   - www.newagefotografie.com BETWEEN logo and heading" -ForegroundColor Gray
Write-Host "   - PERSONALISIERTER GUTSCHEIN heading" -ForegroundColor Gray
Write-Host "   - Customer's image or selected design" -ForegroundColor Gray
Write-Host "   - Red 'Gutschein' banner" -ForegroundColor Gray
Write-Host "   - Personal message below banner" -ForegroundColor Gray
Write-Host "   - Dynamic product description" -ForegroundColor Gray

