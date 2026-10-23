Add-Type -AssemblyName System.Drawing

function Convert-BlackToAlpha {
  param(
    [string]$Src,
    [string]$Dst,
    [int]$Threshold = 22
  )

  $srcImg = [System.Drawing.Bitmap]::FromFile($Src)
  $bmp = New-Object System.Drawing.Bitmap $srcImg.Width, $srcImg.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

  $rect = New-Object System.Drawing.Rectangle 0, 0, $srcImg.Width, $srcImg.Height
  $srcData = $srcImg.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $dstData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

  $bytes = [Math]::Abs($srcData.Stride) * $srcImg.Height
  $srcBuf = New-Object byte[] $bytes
  $dstBuf = New-Object byte[] $bytes
  [Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcBuf, 0, $bytes)

  for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = $srcBuf[$i]
    $g = $srcBuf[$i + 1]
    $r = $srcBuf[$i + 2]
    $lum = [Math]::Max([Math]::Max($r, $g), $b)

    if ($lum -le $Threshold) {
      $dstBuf[$i] = 0
      $dstBuf[$i + 1] = 0
      $dstBuf[$i + 2] = 0
      $dstBuf[$i + 3] = 0
    }
    elseif ($lum -lt ($Threshold + 28)) {
      $alpha = [Math]::Min(255, [int]((($lum - $Threshold) / 28.0) * 255))
      $dstBuf[$i] = $b
      $dstBuf[$i + 1] = $g
      $dstBuf[$i + 2] = $r
      $dstBuf[$i + 3] = $alpha
    }
    else {
      $dstBuf[$i] = $b
      $dstBuf[$i + 1] = $g
      $dstBuf[$i + 2] = $r
      $dstBuf[$i + 3] = 255
    }
  }

  [Runtime.InteropServices.Marshal]::Copy($dstBuf, 0, $dstData.Scan0, $bytes)
  $srcImg.UnlockBits($srcData)
  $bmp.UnlockBits($dstData)
  $srcImg.Dispose()

  $dir = Split-Path -Parent $Dst
  if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
  }
  $bmp.Save($Dst, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "Wrote $Dst"
}

$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root "public\images\hanging-lamp.jpg"))) {
  $root = "D:\techloom.ai_projects\wedding"
}

$img = Join-Path $root "public\images"
Convert-BlackToAlpha -Src (Join-Path $img "hanging-lamp.jpg") -Dst (Join-Path $img "hanging-lamp.png")
Convert-BlackToAlpha -Src (Join-Path $img "floral-corner-top.jpg") -Dst (Join-Path $img "floral-corner-top.png")
Convert-BlackToAlpha -Src (Join-Path $img "floral-corner-bottom.jpg") -Dst (Join-Path $img "floral-corner-bottom.png")
Write-Output "done"
