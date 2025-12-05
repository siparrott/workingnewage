# Test the live voucher with centered website URL
Write-Host "=== Testing Live Voucher Layout ===" -ForegroundColor Cyan
Write-Host "`nDeployment Status: v177 is LIVE" -ForegroundColor Green
Write-Host "Deployed at: 2025/12/05 11:00:48" -ForegroundColor Gray

Write-Host "`n=== Downloading Test Voucher PDF ===" -ForegroundColor Yellow
$testUrl = "https://workingnewage-2eecd723a444.herokuapp.com/voucher/pdf/preview?sku=Family-Basic&name=Test+Empfänger&from=Test+Sender&message=Herzlichen+Glückwunsch+zu+diesem+besonderen+Anlass!"

$timestamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$outputFile = "voucher-centered-test-$timestamp.pdf"

Write-Host "Downloading from live server..." -ForegroundColor Gray
try {
    Invoke-WebRequest -Uri $testUrl -OutFile $outputFile -UseBasicParsing -TimeoutSec 30
    
    if (Test-Path $outputFile) {
        $fileSize = (Get-Item $outputFile).Length
        Write-Host "✅ PDF generated successfully!" -ForegroundColor Green
        Write-Host "   File: $outputFile" -ForegroundColor Cyan
        Write-Host "   Size: $fileSize bytes" -ForegroundColor Gray
        
        Write-Host "`n=== Opening PDF for visual verification ===" -ForegroundColor Yellow
        Start-Process $outputFile
        
        Write-Host "`n=== What to Check ===" -ForegroundColor Cyan
        Write-Host "1. ✓ Logo is centered at the top" -ForegroundColor White
        Write-Host "2. ✓ 'www.newagefotografie.com' is PERFECTLY CENTERED under the logo" -ForegroundColor Yellow
        Write-Host "3. ✓ 'PERSONALISIERTER GUTSCHEIN' heading is centered" -ForegroundColor White
        Write-Host "4. ✓ Red 'Gutschein' banner is present" -ForegroundColor White
        Write-Host "5. ✓ Personal message appears below banner" -ForegroundColor White
        Write-Host "6. ✓ Product description shows correctly" -ForegroundColor White
        
    } else {
        Write-Host "❌ Failed to download PDF" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== For Real Purchase Test ===" -ForegroundColor Yellow
Write-Host "1. Go to: https://workingnewage-2eecd723a444.herokuapp.com" -ForegroundColor Cyan
Write-Host "2. Navigate to Gutscheine (Voucher Store)" -ForegroundColor White
Write-Host "3. Select any voucher product" -ForegroundColor White
Write-Host "4. Complete checkout and purchase" -ForegroundColor White
Write-Host "5. Download PDF and verify the centered layout" -ForegroundColor White

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Green

