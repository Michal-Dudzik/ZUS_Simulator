import { supabase, isSupabaseConfigured } from './supabaseClient.js'

// Mock data for demo/UI mode (when Supabase is not configured)
const MOCK_FAQ_QUESTIONS = [
  {
    id: 1,
    question: 'Jak obliczyć wysokość mojej przyszłej emerytury?',
    email: 'jan.kowalski@example.com',
    status: 'answered',
    answer: 'Wysokość emerytury zależy od zgromadzonego kapitału i średniego dalszego trwania życia. Możesz skorzystać z naszego symulatora, aby uzyskać dokładne wyliczenia na podstawie Twoich danych.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    answered_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    question: 'Czy mogę przejść na emeryturę wcześniej niż w ustawowym wieku emerytalnym?',
    email: 'anna.nowak@example.com',
    status: 'answered',
    answer: 'Tak, istnieje możliwość przejścia na wcześniejszą emeryturę pod pewnymi warunkami, jednak należy pamiętać, że będzie ona niższa od emerytury w wieku ustawowym.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    answered_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    question: 'Co to jest kapitał początkowy i jak wpływa na moją emeryturę?',
    email: 'piotr.wisniewski@example.com',
    status: 'pending',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    question: 'Czy składki ZUS są waloryzowane?',
    email: 'maria.kaminska@example.com',
    status: 'pending',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    question: 'Jak działa system emerytalny w Polsce?',
    email: 'tomasz.lewandowski@example.com',
    status: 'answered',
    answer: 'Polski system emerytalny jest oparty na systemie kapitałowym. Składki odprowadzane do ZUS są zapisywane na indywidualnym koncie i waloryzowane, a następnie dzielone przez średnie dalsze trwanie życia.',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    answered_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    question: 'Czy prowadzenie działalności gospodarczej wpływa na wysokość emerytury?',
    email: 'katarzyna.zajac@example.com',
    status: 'answered',
    answer: 'Tak, przedsiębiorcy odprowadzają składki od zadeklarowanej podstawy wymiaru, co wpływa na przyszłą emeryturę. Istnieje możliwość dobrowolnego zwiększenia podstawy wymiaru składek.',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    answered_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    question: 'Co to jest średnie dalsze trwanie życia i jak jest obliczane?',
    email: 'marek.wojcik@example.com',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    question: 'Czy mogę otrzymać emeryturę z kilku krajów jednocześnie?',
    email: 'agnieszka.krawczyk@example.com',
    status: 'archived',
    answer: 'Tak, jeśli pracowałeś w różnych krajach UE, możesz otrzymywać emerytury z każdego z tych krajów proporcjonalnie do okresu składkowego.',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    answered_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    question: 'Jak wpływają luki w okresach składkowych na wysokość emerytury?',
    email: 'pawel.kowalczyk@example.com',
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    question: 'Czy można sprawdzić stan konta w ZUS online?',
    email: 'ewa.mazur@example.com',
    status: 'answered',
    answer: 'Tak, możesz sprawdzić stan swojego konta w ZUS za pośrednictwem platformy PUE ZUS (Platforma Usług Elektronicznych). Wystarczy się zarejestrować i zalogować.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    answered_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

/**
 * Submit a new FAQ question
 * @param {string} question - The question text
 * @param {string} email - User's email (optional)
 * @returns {Promise<{success: boolean, error?: string, data?: object}>}
 */
export async function submitFAQQuestion(question, email = null) {
  try {
    const questionData = {
      question,
      email,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    // If Supabase is not configured, just simulate success (no API calls)
    if (!isSupabaseConfigured || !supabase) {
      const newQuestion = {
        id: Date.now(),
        ...questionData,
      }
      console.info('UI mode: Simulating successful submission (no backend)')
      return { success: true, data: newQuestion }
    }

    // Use Supabase if configured
    const { data, error } = await supabase
      .from('faq_questions')
      .insert([questionData])
      .select()

    if (error) {
      console.error('Error submitting FAQ question to Supabase:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error submitting FAQ question:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all FAQ questions
 * @param {string} status - Filter by status (optional: 'pending', 'answered', 'archived')
 * @returns {Promise<{success: boolean, data: Array, error?: string}>}
 */
export async function getFAQQuestions(status = null) {
  try {
    // If Supabase is not configured, use mock data directly (no API calls)
    if (!isSupabaseConfigured || !supabase) {
      let questions = [...MOCK_FAQ_QUESTIONS]
      
      if (status) {
        questions = questions.filter(q => q.status === status)
      }
      
      return { success: true, data: questions }
    }

    // Use Supabase if configured
    let query = supabase
      .from('faq_questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching FAQ questions from Supabase:', error)
      return { success: false, data: [], error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching FAQ questions:', error)
    return { success: false, data: [], error: error.message }
  }
}

/**
 * Update FAQ question status
 * @param {number|string} id - Question ID
 * @param {string} status - New status
 * @param {string} answer - Answer text (optional)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateFAQQuestion(id, status, answer = null) {
  try {
    // If Supabase is not configured, just simulate success (no API calls)
    if (!isSupabaseConfigured || !supabase) {
      console.info('UI mode: Simulating successful update (no backend)')
      return { success: true }
    }

    const updates = { status }
    if (answer) {
      updates.answer = answer
      updates.answered_at = new Date().toISOString()
    }

    // Use Supabase if configured
    const { error } = await supabase
      .from('faq_questions')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating FAQ question in Supabase:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating FAQ question:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete FAQ question
 * @param {number|string} id - Question ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteFAQQuestion(id) {
  try {
    // If Supabase is not configured, just simulate success (no API calls)
    if (!isSupabaseConfigured || !supabase) {
      console.info('UI mode: Simulating successful delete (no backend)')
      return { success: true }
    }

    // Use Supabase if configured
    const { error } = await supabase
      .from('faq_questions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting FAQ question from Supabase:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting FAQ question:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get FAQ question statistics
 * @returns {Promise<{success: boolean, data: object, error?: string}>}
 */
export async function getFAQStatistics() {
  try {
    const { success, data } = await getFAQQuestions()
    
    if (!success) {
      return { success: false, data: {}, error: 'Failed to fetch questions' }
    }

    const stats = {
      total: data.length,
      pending: data.filter(q => q.status === 'pending').length,
      answered: data.filter(q => q.status === 'answered').length,
      archived: data.filter(q => q.status === 'archived').length,
    }

    return { success: true, data: stats }
  } catch (error) {
    console.error('Error calculating FAQ statistics:', error)
    return { success: false, data: {}, error: error.message }
  }
}
