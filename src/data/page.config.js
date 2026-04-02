/**
 * Point principal à personnaliser par site : mapping content.json → blocs enregistrés.
 * Voir les clés `type` dans `@orbisite/blocks` (blockRegistry).
 * Avec multi-pages (`pages` dans le JSON), l’ordre des blocs peut être surchargé par route via `sections`.
 */
import { resolveForLocale } from '../utils/localeUtils'
import { extractContentImages } from '../utils/siteImages'

export const DEFAULT_SECTION_ORDER = [
  'navbar',
  'hero',
  'features',
  'bento',
  'pricing',
  'testimonials',
  'footer',
]

/**
 * @param {object} content — JSON fusionné pour la route courante
 * @param {string} locale
 * @param {() => void} onLocaleChange
 * @param {{ sections?: string[] | null, spaLinkComponent?: object | null, logoHref?: string }} [options]
 */
export function buildPageConfig(content, locale = 'fr', onLocaleChange = () => {}, options = {}) {
  const {
    sections = null,
    spaLinkComponent = null,
    logoHref = '#',
  } = options

  const order =
    Array.isArray(sections) && sections.length > 0 ? sections : DEFAULT_SECTION_ORDER

  const images = extractContentImages(content) ?? {}
  const nav = resolveForLocale(locale, content.navbar)
  const hero = resolveForLocale(locale, content.hero)
  const features = resolveForLocale(locale, content.features)
  const bento = resolveForLocale(locale, content.bento)
  const pricing = resolveForLocale(locale, content.pricing)
  const testimonials = resolveForLocale(locale, content.testimonials)
  const footer = resolveForLocale(locale, content.footer)

  const blocks = {
    navbar: () => ({
      type: 'navbar',
      props: {
        logo: nav.logo,
        logoSrc: images.logo,
        links: nav.links,
        ctaText: nav.cta,
        ctaHref: nav.ctaHref ?? '#contact',
        sticky: true,
        color: 'primary',
        locale,
        menuLabel: nav.menu,
        closeLabel: nav.close,
        onLocaleChange,
        spaLinkComponent,
        logoHref,
      },
    }),
    hero: () => ({
      type: 'hero',
      props: {
        sectionId: 'hero',
        title: hero.title,
        subtitle: hero.subtitle,
        ctaText: hero.cta,
        ctaHref: hero.ctaHref ?? '#pricing',
        variant: 'split',
        color: 'primary',
        imageUrl: images.hero,
        imageAlt: hero.imageAlt,
      },
    }),
    features: () => ({
      type: 'features',
      props: {
        sectionId: features.sectionId,
        title: features.title,
        subtitle: features.subtitle,
        color: 'secondary',
        items: features.items,
      },
    }),
    bento: () => ({
      type: 'bento',
      props: {
        sectionId: 'showcase',
        title: bento.title,
        subtitle: bento.subtitle,
        note: bento.note,
        color: 'secondary',
        items: bento.items.map((item, index) => ({
          ...item,
          imageUrl: images.bento?.[index],
        })),
      },
    }),
    pricing: () => ({
      type: 'pricing',
      props: {
        sectionId: 'pricing',
        title: pricing.title,
        subtitle: pricing.subtitle,
        color: 'primary',
        highlightedPlan:
          typeof pricing.highlightedPlan === 'number' ? pricing.highlightedPlan : 0,
        plans: pricing.plans.map((plan) => ({
          ...plan,
          ctaHref: plan.ctaHref ?? pricing.planCtaHref ?? '#contact',
        })),
      },
    }),
    testimonials: () => ({
      type: 'testimonials',
      props: {
        sectionId: 'testimonials',
        title: testimonials.title,
        subtitle: testimonials.subtitle,
        color: 'secondary',
        items: testimonials.items.map((item, index) => ({
          ...item,
          avatarUrl: images.testimonialAvatars?.[index],
        })),
      },
    }),
    footer: () => ({
      type: 'footer',
      props: {
        sectionId: 'contact',
        links:
          Array.isArray(footer.links) && footer.links.length > 0 ?
            footer.links.map((l) => ({
              label: l.label,
              href: l.href ?? '#',
            }))
          : [
              { label: footer.privacy, href: footer.linkHrefs?.privacy ?? '#' },
              { label: footer.terms, href: footer.linkHrefs?.terms ?? '#' },
              { label: footer.contact, href: footer.linkHrefs?.contact ?? '#contact' },
            ],
        socials:
          Array.isArray(footer.socials) && footer.socials.length > 0 ?
            footer.socials.map((s) => ({
              label: s.label,
              href: s.href ?? '#',
            }))
          : [
              { label: 'X', href: '#' },
              { label: 'LinkedIn', href: '#' },
              { label: 'GitHub', href: '#' },
            ],
        color: 'neutral',
        copyright: footer.copyright,
      },
    }),
  }

  const out = []
  for (const id of order) {
    const fn = blocks[id]
    if (fn) {
      out.push(fn())
    }
  }
  return out
}
