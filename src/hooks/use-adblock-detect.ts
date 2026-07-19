// src/hooks/use-adblock-detect.ts
'use client'
import { useEffect, useState } from 'react'
// Domains heavily targeted by all major adblockers
const AD_IMAGE_URLS = [
  'https://pagead2.googlesyndication.com/pagead/images/ads_icon.svg',
  'https://ad.doubleclick.net/favicon.ico',
]
export function useAdblockDetect() {
  const [adblockDetected, setAdblockDetected] = useState(false)
  useEffect(() => {
    let isMounted = true
    const runDetection = async () => {
      // --- Strategy 1: Network request to known ad domains ---
      // Only run if online, otherwise network errors are expected
      if (navigator.onLine) {
        const networkBlocked = await new Promise<boolean>((resolve) => {
          let loadedCount = 0
          let resolved = false
          AD_IMAGE_URLS.forEach((url) => {
            const img = new Image()
            // Cache buster
            img.src = `${url}?cb=${Date.now()}`
            img.onload = () => {
              if (resolved) return
              loadedCount++
              // If ALL images load successfully, adblocker is NOT blocking network
              if (loadedCount === AD_IMAGE_URLS.length) {
                resolved = true
                resolve(false) 
              }
            }
            img.onerror = () => {
              if (resolved) return
              // If ANY image fails to load while online, adblocker is blocking it
              resolved = true
              resolve(true) 
            }
          })
          // Fallback timeout in case images hang
          setTimeout(() => {
            if (!resolved) {
              resolved = true
              resolve(false)
            }
          }, 3000)
        })
        if (networkBlocked) {
          if (isMounted) setAdblockDetected(true)
          return // No need to check bait if network is already blocked
        }
      }
      // --- Strategy 2: Bait element for cosmetic filtering ---
      const bait = document.createElement('div')
      bait.innerHTML = 'Advertisement'
      // 'adsbox' and 'data-ad' are specifically targeted by EasyList/uBlock
      bait.className = 'adsbox ad-banner ad-placeholder'
      bait.id = 'ad-banner'
      bait.setAttribute('data-ad', 'true')
      // Use !important to prevent site CSS from accidentally overriding the adblocker's hide logic
      bait.style.cssText =
        'position:absolute !important;top:-10px !important;left:-10px !important;width:1px !important;height:1px !important;overflow:hidden !important;pointer-events:none !important;'
      document.body.appendChild(bait)
      // Give the adblocker's MutationObserver ample time to process and hide the element
      setTimeout(() => {
        if (!isMounted) {
          bait.remove()
          return
        }
        const isHidden =
          bait.offsetHeight === 0 ||
          getComputedStyle(bait).display === 'none' ||
          getComputedStyle(bait).visibility === 'hidden'
        if (isHidden) {
          setAdblockDetected(true)
        }
        bait.remove()
      }, 1500) // 1500ms is the sweet spot for cosmetic filters
    }
    runDetection()
    return () => {
      isMounted = false
    }
  }, [])
  return adblockDetected
}