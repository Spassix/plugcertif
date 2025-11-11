import MaintenancePage from '@/components/MaintenancePage'
import Script from 'next/script'

export default function Maintenance() {
  return (
    <>
      <Script
        id="show-page"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.style.visibility = 'visible';`,
        }}
      />
      <MaintenancePage />
    </>
  )
}