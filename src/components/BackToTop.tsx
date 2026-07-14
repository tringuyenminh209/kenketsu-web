import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '../lib/shared'

export function BackToTop() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label={t('common.backToTop', 'Back to top')}
      title={t('common.backToTop', 'Back to top')}
    >
      <Icon type="arrowUp" />
    </button>
  )
}
