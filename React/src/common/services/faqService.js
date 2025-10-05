import { supabase, isSupabaseConfigured } from './supabaseClient.js'

// LocalStorage key for FAQ questions when Supabase is not configured
const FAQ_QUESTIONS_STORAGE_KEY = 'faq_questions'

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

    if (isSupabaseConfigured && supabase) {
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
    } else {
      // Fall back to localStorage
      const existingQuestions = getLocalFAQQuestions()
      const newQuestion = {
        id: Date.now(),
        ...questionData,
      }
      
      existingQuestions.push(newQuestion)
      localStorage.setItem(FAQ_QUESTIONS_STORAGE_KEY, JSON.stringify(existingQuestions))
      
      return { success: true, data: newQuestion }
    }
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
    if (isSupabaseConfigured && supabase) {
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
    } else {
      // Fall back to localStorage
      let questions = getLocalFAQQuestions()
      
      if (status) {
        questions = questions.filter(q => q.status === status)
      }
      
      return { success: true, data: questions }
    }
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
    const updates = { status }
    if (answer) {
      updates.answer = answer
      updates.answered_at = new Date().toISOString()
    }

    if (isSupabaseConfigured && supabase) {
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
    } else {
      // Fall back to localStorage
      const questions = getLocalFAQQuestions()
      const questionIndex = questions.findIndex(q => q.id === id)
      
      if (questionIndex === -1) {
        return { success: false, error: 'Question not found' }
      }
      
      questions[questionIndex] = {
        ...questions[questionIndex],
        ...updates,
      }
      
      localStorage.setItem(FAQ_QUESTIONS_STORAGE_KEY, JSON.stringify(questions))
      return { success: true }
    }
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
    if (isSupabaseConfigured && supabase) {
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
    } else {
      // Fall back to localStorage
      const questions = getLocalFAQQuestions()
      const filteredQuestions = questions.filter(q => q.id !== id)
      
      localStorage.setItem(FAQ_QUESTIONS_STORAGE_KEY, JSON.stringify(filteredQuestions))
      return { success: true }
    }
  } catch (error) {
    console.error('Error deleting FAQ question:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get FAQ questions from localStorage
 * @returns {Array}
 */
function getLocalFAQQuestions() {
  try {
    const stored = localStorage.getItem(FAQ_QUESTIONS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading FAQ questions from localStorage:', error)
    return []
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
