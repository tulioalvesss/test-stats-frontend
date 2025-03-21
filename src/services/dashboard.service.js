import { api } from './api'

export const DashboardService = {
  async fetchStats() {
    const [statsResponse, feedbacksResponse, errorsResponse] = await Promise.all([
      api.get('/downloads'),
      api.get('/evaluations'),
      api.get('/errors')
    ])

    const statsData = statsResponse.data.data.data
    const feedbacksData = feedbacksResponse.data.data.data
    const errorsData = errorsResponse.data.data.data

    const totalDownloads = statsData.length
    const downloadsAndroid = statsData.filter(stat => stat.platform === 'ANDROID').length
    const downloadsIos = statsData.filter(stat => stat.platform === 'IOS').length

    const totalEvaluations = feedbacksData.reduce((acc, feedback) => acc + feedback.evaluation, 0)
    const averageRating = (totalEvaluations / feedbacksData.length).toFixed(1)

    const totalErrors = errorsData.length
    const errorsAndroid = errorsData.filter(error => error.platform === 'ANDROID').length
    const errorsIos = errorsData.filter(error => error.platform === 'IOS').length

    return {
      downloads: totalDownloads,
      downloadsAndroid,
      downloadsIos,
      rating: averageRating,
      ratingAndroid: feedbacksData.filter(feedback => feedback.evaluation >= 4).length,
      ratingIos: feedbacksData.filter(feedback => feedback.evaluation < 4).length,
      errors: totalErrors,
      errorsAndroid,
      errorsIos,
      errorsLow: '-5%'
    }
  },

  async fetchFeedbacks() {
    const response = await api.get('/evaluations')
    const feedbacksData = response.data.data.data
    return feedbacksData.map(feedback => ({
      ...feedback,
      evaluation: Number(feedback.evaluation).toFixed(1)
    }))
  },

  async fetchFeatures() {
    const response = await api.get('/features')
    const featuresData = response.data.data.data
    return featuresData.map(feature => ({
      name: feature.name,
      percentage: feature.percentage || Math.floor(Math.random() * 30) + 70
    }))
  }
} 