import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'Is CropGuard AI available in Nigerian languages ?',
    a: 'Yes. CropGuard AI is available in English, Yoruba, Igbo and Nigerian Pidgin.',
  },
  {
    q: 'How do i take a good photo for diagnosis ?',
    a: 'Use good lighting, keep your phone steady and capture the affected leaf clearly. A single clear photo is enough to get started.',
  },
  {
    q: 'Does CropGuard Ai replace an agricultural expert ?',
    a: 'No. CropGuard AI gives you fast guidance and treatment advice, but it does not replace the judgement of a trained agricultural expert.',
  },
  {
    q: 'What crops can CropGuard AI identify disease in',
    a: 'CropGuard AI recognises common crop diseases across tomatoes, cassava, maize, peppers and more.',
  },
  {
    q: 'Can CropGuard Ai diagnosis every crop disease ?',
    a: "We cover the most common crop diseases first and add more all the time. If we can't identify one, we will tell you clearly.",
  },
]

function Faq() {
  const [openIndex, setOpenIndex] = useState<number>(-1)

  return (
    <section className="faq" id="faq">
      <div className="faq__inner">
        <h2 className="faq__title">Frequently Asked Question</h2>
        <ul className="faq__list" role="list">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <li key={item.q} className="faq-item">
                <button
                  type="button"
                  className="faq-item__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={22}
                    className={`faq-item__icon${isOpen ? ' faq-item__icon--open' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <div className="faq-item__a-wrap" aria-hidden={!isOpen}>
                  <p className="faq-item__a">{item.a}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default Faq