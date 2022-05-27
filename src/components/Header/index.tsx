import Link from 'next/link'
import styles from './header.module.scss'

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.nav}>
          <Link href='/'>
            <a >
              <img src="/images/Logo.svg" alt="logo" />
            </a>

          </Link>


        </div>
      </div>
    </div>
  )
}
