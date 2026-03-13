const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

/**
 * -------- POST: /navigation --------
 * Build the FULL journey in the correct order:
 * 1) Financial → upload-group, upload-financial
 * 2) RRP
 * 3) Additional
 */
router.post('/navigation', (req, res) => {
  let selected = req.body.documents
  console.log("RAW SELECTION:", selected)

  if (!selected) return res.redirect('/navigation')
  if (!Array.isArray(selected)) selected = [selected]

const pickedFinancial = selected.includes('upload-financial')

  const pickedRRP = selected.includes('upload-rrp')
  const pickedAdditional = selected.includes('upload-additional')

  // FULL fixed journey
  const journey = []

  // If financial selected, these two MUST always appear
  if (pickedFinancial) {
    journey.push('upload-financial')
  }

  if (pickedRRP) journey.push('upload-rrp')
  if (pickedAdditional) journey.push('upload-additional')

  // Save
  req.session.data.journey = journey
  req.session.data.pickedFinancial = pickedFinancial

  console.log("FINAL JOURNEY =", journey)

  // Flow entry point
  if (pickedFinancial) return res.redirect('upload-financial')

  return res.redirect(`/${journey[0]}`)
})

/**
 * -------- GET ROUTES --------
 * Pass BOTH:
 * - journey: the full list of selected pages
 * - currentPage
 */
router.get('/navigation', (req, res) => {
  res.render('navigation', {
    currentPage: 'navigation',
    journey: req.session.data.journey || []
  })
})



router.get('/upload-financial', (req, res) => {
  res.render('upload-financial', {
    currentPage: 'upload-financial',
    journey: req.session.data.journey || []
  })
})

router.get('/upload-rrp', (req, res) => {
  res.render('upload-rrp', {
    currentPage: 'upload-rrp',
    journey: req.session.data.journey || []
  })
})

router.get('/upload-additional', (req, res) => {
  res.render('upload-additional', {
    currentPage: 'upload-additional',
    journey: req.session.data.journey || []
  })
})

router.get('/declaration', (req, res) => {
  res.render('declaration', {
    currentPage: 'declaration',
    journey: req.session.data.journey || []
  })
})

/**
 * -------- POST: /groupradio --------
 */
router.post('/groupradio', (req, res) => {
  const answer = req.body.groupNeeded

  if (answer === 'yes') {
    return res.redirect('/upload-group')
  }

  return res.redirect('/upload-financial')
})

/**
 * -------- POST: /upload-group --------
 */
router.post('/upload-group', (req, res) => {
  return res.redirect('/upload-financial')
})

/**
 * -------- POST: /upload-financial --------
 */
router.post('/upload-financial', (req, res) => {
  const journey = req.session.data.journey || []

  // Find where we are
  const index = journey.indexOf('upload-financial')

  // Move to next page if exists
  if (index !== -1 && index < journey.length - 1) {
    return res.redirect(`/${journey[index + 1]}`)
  }

  return res.redirect('/declaration')
})

/**
 * -------- POST: /upload-rrp --------
 */
router.post('/upload-rrp', (req, res) => {
  const journey = req.session.data.journey || []
  const index = journey.indexOf('upload-rrp')

  if (index !== -1 && index < journey.length - 1) {
    return res.redirect(`/${journey[index + 1]}`)
  }

  return res.redirect('/declaration')
})

/**
 * -------- POST: /upload-additional --------
 */
router.post('/upload-additional', (req, res) => {
  const journey = req.session.data.journey || []
  const index = journey.indexOf('upload-additional')

  if (index !== -1 && index < journey.length - 1) {
    return res.redirect(`/${journey[index + 1]}`)
  }

  return res.redirect('/declaration')
})

module.exports = router