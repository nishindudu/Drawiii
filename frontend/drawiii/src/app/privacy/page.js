import { Dancing_Script, Noto_Serif_Georgian } from "next/font/google"
import styles from "../page.module.css"


const dancingScript = Dancing_Script({
  weight: '400',
  subsets: ['latin']
})

const notoSerifGeorgian = Noto_Serif_Georgian({
  weight: 'variable',
  subsets: ['georgian']
})


export default function PrivacyPage() {
    return (
        <>
            <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "d6ffa59403cb49f0ae4dc5ad5c1547f4"}'></script>
            <div style={{ textAlign: 'center', padding: '2rem', paddingTop: '0' }}>
                <h1 align="center" className={`${dancingScript.className} ${styles.mainHead}`}>Drawiii</h1><br></br><br></br>
                <h3 style={{ fontSize: '1.5rem', textAlign: 'left' }} className={`${notoSerifGeorgian.className}`}>Privacy at Drawiii</h3><br></br>
                <p style={{ fontSize: '1rem', fontWeight: '400', textAlign: 'justify' }} className={`${notoSerifGeorgian.className}`}>
                    We use Cloudflare Analytics to understand our website traffic. Cloudflare&apos;s service is designed to be privacy-first and does not use cookies or track you across other sites.
                    No personally identifiable information (like your name or email) is collected. All data is aggregated and used solely to improve the website.
                </p>
            </div>
        </>
    )
}